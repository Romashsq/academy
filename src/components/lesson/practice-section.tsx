"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ClipboardList,
  Upload,
  Link2,
  Image,
  CheckCircle2,
  Pencil,
  X,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  ThumbsUp,
  AlertCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useChatStore } from "@/store/chat-store";
import { notify } from "@/store/notification-store";

// ============================================
// ТИПЫ
// ============================================

export interface PracticeTaskData {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  order: number;
  imageUrl?: string | null;
  imageAlt?: string | null;
  submissions: SubmissionData[];
}

interface AiReview {
  rating: "excellent" | "good" | "needs_work";
  feedback: string;
  tips: string[];
}

interface SubmissionData {
  id: string;
  type: "file" | "screenshot" | "link";
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  linkUrl?: string | null;
  comment?: string | null;
  status: string;
  submittedAt: string;
  aiReview?: string | null;
}

interface Props {
  lessonId: string;
  tasks: PracticeTaskData[];
}

type SubmitType = "file" | "screenshot" | "link";
type TaskState = "idle" | "open" | "editing";

// ============================================
// УТИЛИТЫ
// ============================================

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================
// ФОРМА САБМИТА (внутри задания)
// ============================================

interface SubmitFormProps {
  taskId: string;
  lessonId: string;
  existingSubmission: SubmissionData | null;
  onSuccess: (sub: SubmissionData) => void;
  onCancel: () => void;
}

function SubmitForm({ taskId, lessonId, existingSubmission, onSuccess, onCancel }: SubmitFormProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<SubmitType>(existingSubmission?.type ?? "link");
  const [linkUrl, setLinkUrl] = useState(existingSubmission?.linkUrl ?? "");
  const [comment, setComment] = useState(existingSubmission?.comment ?? "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string; size: number } | null>(
    existingSubmission?.fileUrl
      ? { url: existingSubmission.fileUrl, name: existingSubmission.fileName ?? "", size: existingSubmission.fileSize ?? 0 }
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setUploadedFile({ url: data.fileUrl, name: data.fileName, size: data.fileSize });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("practice.uploadError"));
    } finally {
      setUploading(false);
    }
  }, [t]);

  const handleSubmit = async () => {
    setError(null);

    if (type === "link" && !linkUrl.trim()) {
      setError(t("practice.linkRequired"));
      return;
    }
    if ((type === "file" || type === "screenshot") && !uploadedFile) {
      setError(t("practice.fileRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = { taskId, type, comment };
      if (type === "link") body.linkUrl = linkUrl;
      if (uploadedFile) {
        body.fileUrl = uploadedFile.url;
        body.fileName = uploadedFile.name;
        body.fileSize = uploadedFile.size;
      }

      const url = existingSubmission
        ? `/api/practice/submission/${existingSubmission.id}`
        : `/api/practice/${lessonId}/submit`;
      const method = existingSubmission ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submit failed");
      onSuccess(data.submission);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("practice.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Выбор типа */}
      <div className="flex gap-2">
        {(["link", "screenshot", "file"] as SubmitType[]).map((t_) => (
          <button
            key={t_}
            onClick={() => { setType(t_); setUploadedFile(null); setError(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              type === t_
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
            }`}
          >
            {t_ === "link" && <Link2 className="w-3 h-3" />}
            {t_ === "screenshot" && <Image className="w-3 h-3" />}
            {t_ === "file" && <FileText className="w-3 h-3" />}
            {t("practice.type_" + t_)}
          </button>
        ))}
      </div>

      {/* Поле ввода */}
      {type === "link" ? (
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder={t("practice.linkPlaceholder")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
        />
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept={type === "screenshot" ? "image/*" : "image/*,.pdf"}
            onChange={handleFileUpload}
            className="hidden"
          />
          {uploadedFile ? (
            <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-300 truncate flex-1">{uploadedFile.name}</span>
              <span className="text-xs text-gray-500">{formatBytes(uploadedFile.size)}</span>
              <button onClick={() => { setUploadedFile(null); if (fileRef.current) fileRef.current.value = ""; }}>
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-2 py-6 border border-dashed border-white/20 rounded-xl text-gray-400 hover:border-emerald-500/40 hover:text-gray-300 transition-all"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span className="text-sm">
                {uploading ? t("practice.uploading") : (type === "screenshot" ? t("practice.uploadScreenshot") : t("practice.uploadFile"))}
              </span>
              <span className="text-xs text-gray-600">{t("practice.maxSize")}</span>
            </button>
          )}
        </div>
      )}

      {/* Комментарий */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("practice.commentPlaceholder")}
        rows={2}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
      />

      {/* Ошибка */}
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Кнопки */}
      <div className="flex gap-2">
        <Button onClick={handleSubmit} loading={submitting} size="sm" className="gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {existingSubmission ? t("practice.saveEdit") : t("practice.submit")}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {t("practice.cancel")}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// AI-РЕВЬЮ КОМПОНЕНТ
// ============================================

interface AiReviewCardProps {
  submissionId: string;
  cachedReview: AiReview | null;
  taskTitle: string;
  taskDescription: string;
}

function AiReviewCard({ submissionId, cachedReview, taskTitle, taskDescription }: AiReviewCardProps) {
  const { t } = useTranslation();
  const { setOpen: setChatOpen, setPrefillMessage } = useChatStore();
  const [review, setReview] = useState<AiReview | null>(cachedReview);
  const [loading, setLoading] = useState(!cachedReview);
  const [error, setError] = useState(false);

  const fetchReview = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/practice/submission/${submissionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReview(data.review);
      if (data.review?.rating === "needs_work") {
        setTimeout(() => {
          notify.info(
            "Need help with this task? Ask the mentor — they'll explain! 💬",
            "🤔"
          );
        }, 1200);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    if (!cachedReview) {
      fetchReview();
    }
  }, [cachedReview, fetchReview]);

  const ratingConfig = {
    excellent: { icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    good: { icon: ThumbsUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    needs_work: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  };

  return (
    <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
      {/* Заголовок */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-violet-500/10">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-violet-400 text-xs font-semibold">{t("practice.aiReviewTitle")}</span>
      </div>

      <div className="p-4">
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            {t("practice.aiReviewLoading")}
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-between">
            <span className="text-red-400 text-sm">{t("practice.aiReviewError")}</span>
            <button
              onClick={fetchReview}
              className="text-violet-400 text-xs hover:text-violet-300 underline"
            >
              {t("practice.aiReviewRetry")}
            </button>
          </div>
        )}

        {review && !loading && (
          <div className="space-y-3">
            {/* Рейтинг */}
            {(() => {
              const cfg = ratingConfig[review.rating] ?? ratingConfig.good;
              const RatingIcon = cfg.icon;
              const ratingKey = `practice.aiReviewRating_${review.rating}` as Parameters<typeof t>[0];
              return (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                  <RatingIcon className="w-3.5 h-3.5" />
                  {t(ratingKey)}
                </div>
              );
            })()}

            {/* Основной фидбек */}
            <p className="text-gray-300 text-sm leading-relaxed">{review.feedback}</p>

            {/* Советы */}
            {review.tips.length > 0 && (
              <div>
                <p className="text-gray-500 text-xs font-medium mb-2">{t("practice.aiReviewTips")}:</p>
                <ul className="space-y-1.5">
                  {review.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-violet-400 mt-0.5 flex-shrink-0">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Кнопка ментора при needs_work */}
            {review.rating === "needs_work" && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/15 mt-1">
                <p className="text-xs text-gray-400">
                  {"Want the AI mentor to explain this topic in detail?"}
                </p>
                <button
                  onClick={() => {
                    const msg = `I submitted the task "${taskTitle}" but got needs_work. Please explain this topic in more detail: ${taskDescription}`;
                    setPrefillMessage(msg);
                    setChatOpen(true);
                  }}
                  className="ml-3 flex-shrink-0 text-xs text-violet-400 hover:text-violet-300 border border-violet-500/30 px-2.5 py-1 rounded-lg hover:bg-violet-500/10 transition-all"
                >
                  Ask mentor →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ОТОБРАЖЕНИЕ ОТПРАВЛЕННОГО ОТВЕТА
// ============================================

interface SubmissionViewProps {
  submission: SubmissionData;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  taskTitle: string;
  taskDescription: string;
}

function SubmissionView({ submission, onEdit, onDelete, deleting, taskTitle, taskDescription }: SubmissionViewProps) {
  const { t } = useTranslation();
  const cachedReview: AiReview | null = submission.aiReview
    ? (() => { try { return JSON.parse(submission.aiReview!); } catch { return null; } })()
    : null;
  const date = new Date(submission.submittedAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-400 text-sm font-medium">{t("practice.submitted")}</span>
          <span className="text-gray-600 text-xs">{date}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title={t("practice.edit")}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="p-1 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
            title={t("practice.cancelSubmit")}
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Содержимое сабмита */}
      {submission.type === "link" && submission.linkUrl && (
        <a
          href={submission.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-emerald-400 text-sm hover:underline"
        >
          <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{submission.linkUrl}</span>
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      )}

      {(submission.type === "file" || submission.type === "screenshot") && submission.fileUrl && (
        <div>
          {submission.type === "screenshot" ? (
            <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={submission.fileUrl}
                alt="screenshot"
                className="max-h-48 rounded-lg border border-white/10 object-contain"
              />
            </a>
          ) : (
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 text-sm hover:underline"
            >
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{submission.fileName ?? t("practice.file")}</span>
              {submission.fileSize && (
                <span className="text-gray-500 text-xs flex-shrink-0">{formatBytes(submission.fileSize)}</span>
              )}
            </a>
          )}
        </div>
      )}

      {submission.comment && (
        <p className="mt-2 text-gray-400 text-xs leading-relaxed">{submission.comment}</p>
      )}

      {/* AI-ревью */}
      <AiReviewCard
        submissionId={submission.id}
        cachedReview={cachedReview}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
      />
    </div>
  );
}

// ============================================
// ОДНО ЗАДАНИЕ
// ============================================

interface TaskCardProps {
  task: PracticeTaskData;
  lessonId: string;
}

function TaskCard({ task, lessonId }: TaskCardProps) {
  const { t } = useTranslation();
  const [taskState, setTaskState] = useState<TaskState>("idle");
  const [submission, setSubmission] = useState<SubmissionData | null>(task.submissions[0] ?? null);
  const [expanded, setExpanded] = useState(!submission);
  const [deleting, setDeleting] = useState(false);

  const title = task.titleEn ?? task.title;
  const description = task.descriptionEn ?? task.description;
  const isDone = !!submission;

  const handleDelete = async () => {
    if (!submission) return;
    setDeleting(true);
    try {
      await fetch(`/api/practice/submission/${submission.id}`, { method: "DELETE" });
      setSubmission(null);
      setTaskState("idle");
      setExpanded(true);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`rounded-xl border transition-colors ${isDone ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "border-white/10 bg-white/[0.02]"}`}>
      {/* Заголовок задания */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${isDone ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-gray-400"}`}>
          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : task.order}
        </div>
        <span className={`font-medium text-sm flex-1 ${isDone ? "text-emerald-300" : "text-white"}`}>
          {title}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
      </button>

      {/* Раскрытое содержимое */}
      {expanded && (
        <div className="px-4 pb-4">
          {/* Иллюстрация задания */}
          {task.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={task.imageUrl}
              alt={task.imageAlt ?? title}
              className="w-full h-40 object-cover rounded-lg mb-4 opacity-80"
            />
          )}
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>

          {/* Если есть сабмит и не редактируем */}
          {submission && taskState !== "editing" && (
            <SubmissionView
              submission={submission}
              onEdit={() => setTaskState("editing")}
              onDelete={handleDelete}
              deleting={deleting}
              taskTitle={title}
              taskDescription={description}
            />
          )}

          {/* Форма */}
          {(taskState === "open" || taskState === "editing") && (
            <SubmitForm
              taskId={task.id}
              lessonId={lessonId}
              existingSubmission={taskState === "editing" ? submission : null}
              onSuccess={(sub) => {
                setSubmission(sub);
                setTaskState("idle");
                setExpanded(true);
              }}
              onCancel={() => setTaskState("idle")}
            />
          )}

          {/* Кнопка «Добавить ответ» если нет сабмита */}
          {!submission && taskState === "idle" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => setTaskState("open")}
            >
              <Upload className="w-3.5 h-3.5" />
              {t("practice.addAnswer")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// PRACTICE SECTION (главный компонент)
// ============================================

export function PracticeSection({ lessonId, tasks }: Props) {
  const { t } = useTranslation();

  const completedCount = tasks.filter((task) => task.submissions.length > 0).length;
  const allDone = completedCount === tasks.length;

  return (
    <div className="mt-10 border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
      {/* Заголовок */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${allDone ? "bg-emerald-500/20" : "bg-violet-500/20"}`}>
          <ClipboardList className={`w-5 h-5 ${allDone ? "text-emerald-400" : "text-violet-400"}`} />
        </div>
        <div>
          <h3 className="font-syne font-semibold text-white">{t("practice.title")}</h3>
          <p className="text-gray-500 text-xs">
            {completedCount} / {tasks.length} {t("practice.tasksCompleted")}
          </p>
        </div>
        {allDone && (
          <div className="ml-auto bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1 text-emerald-400 text-xs font-semibold">
            {t("practice.allDone")}
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-5">{t("practice.description")}</p>

      {/* Список заданий */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            lessonId={lessonId}
          />
        ))}
      </div>
    </div>
  );
}
