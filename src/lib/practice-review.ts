import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

// ============================================
// ТИПЫ
// ============================================

export interface AiReview {
  rating: "excellent" | "good" | "needs_work";
  feedback: string;
  tips: string[];
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function getClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "placeholder" });
}

// Загружаем изображение по URL для отправки в GPT-4o (мультимодальность)
async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;
    const buffer = await res.arrayBuffer();
    const b64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${b64}`;
  } catch {
    return null;
  }
}

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ РЕВЬЮ
// ============================================

export async function generatePracticeReview(
  submissionId: string
): Promise<AiReview> {
  const submission = await prisma.practiceSubmission.findUnique({
    where: { id: submissionId },
    include: {
      task: {
        select: {
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
        },
      },
    },
  });

  if (!submission) throw new Error("Submission not found");

  const taskTitle = submission.task.titleEn ?? submission.task.title;
  const taskDescription = submission.task.descriptionEn ?? submission.task.description;

  const systemPrompt = `You are a strict mentor at VibeCode Academy, an online platform teaching AI development,
Vibe Coding, and prompt engineering. The course covers: AI dev, prompt engineering,
Telegram bots (Python/aiogram), Vibe Coding tools (Cursor, Bolt.new, Lovable), APIs, AI agents.

MANDATORY STEPS before scoring:

STEP 1 — STRICT RELEVANCE CHECK:
Look at the submitted content and ask yourself: "Does this CLEARLY demonstrate the task?"

IRRELEVANT content (immediately needs_work):
- Photos of cats, animals, nature, people, memes
- Desktop screenshot without code or tools
- Random websites unrelated to the task
- Empty/blank screen or just a browser window
- Any image/file NOT demonstrating completion of this specific task
- Screenshots without code, terminal, working result, or a tool from the task

ONLY if the content CLEARLY shows:
✓ Code (in editor, terminal, IDE)
✓ A working bot/site/app
✓ Interface of a tool from the task (Cursor, Bolt, Claude, Telegram, etc.)
✓ Actual result of completing the task
→ proceed to STEP 2

When in doubt about relevance — mark as needs_work.
DO NOT invent praise for irrelevant content.

STEP 2 — QUALITY ASSESSMENT (relevant submissions only):
- Specific and to the point (no fluff)
- Encouraging but honest
- Note what's good and what can be improved
- In English

Answer strictly in JSON, no markdown.`;

  const outputSchema = `{
  "rating": "excellent" | "good" | "needs_work",
  "feedback": "string (2-3 sentences)",
  "tips": ["tip1", "tip2", "tip3"]
}`;

  const submissionDetails: string[] = [];
  if (submission.type === "link" && submission.linkUrl) {
    submissionDetails.push(`Link: ${submission.linkUrl}`);
  }
  if ((submission.type === "file" || submission.type === "screenshot") && submission.fileName) {
    submissionDetails.push(`File: ${submission.fileName}`);
  }
  if (submission.comment) {
    submissionDetails.push(`Student comment: ${submission.comment}`);
  }

  const userText = `Task: ${taskTitle}\nTask description: ${taskDescription}\n\nStudent submitted:\n${submissionDetails.join("\n") || "No comment"}\n\nFIRST check: is the content actually related to this task? If not — needs_work, no excuses.\n\nREMEMBER: If the screenshot has NO clear signs of task completion (code, working result, required tool) — it's AUTOMATICALLY needs_work. Don't invent approval.\nReturn JSON:\n${outputSchema}`;

  // Строим контент сообщения
  type UserContent = OpenAI.ChatCompletionContentPart[];
  const content: UserContent = [{ type: "text", text: userText }];

  // Если скриншот — добавляем изображение
  if (submission.type === "screenshot" && submission.fileUrl) {
    const dataUrl = await fetchImageAsBase64(submission.fileUrl);
    if (dataUrl) {
      content.push({ type: "image_url", image_url: { url: dataUrl, detail: "low" } });
    }
  }

  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini", // быстро и дёшево для ревью
    max_tokens: 512,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "{}";

  let parsed: AiReview;
  try {
    const obj = JSON.parse(raw);
    parsed = {
      rating: ["excellent", "good", "needs_work"].includes(obj.rating) ? obj.rating : "good",
      feedback: String(obj.feedback ?? ""),
      tips: Array.isArray(obj.tips) ? obj.tips.map(String).slice(0, 3) : [],
    };
  } catch {
    parsed = {
      rating: "good",
      feedback: "Work received. Keep practicing!",
      tips: [],
    };
  }

  // Сохраняем в БД
  await prisma.practiceSubmission.update({
    where: { id: submissionId },
    data: {
      aiReview: JSON.stringify(parsed),
      aiReviewAt: new Date(),
    },
  });

  return parsed;
}
