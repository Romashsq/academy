import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Блокируем приватные/внутренние адреса (SSRF protection)
const isPublicUrl = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    const privatePatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^::1$/,
      /^0\.0\.0\.0$/,
      /^metadata\.google\.internal$/i,
    ];
    return !privatePatterns.some((p) => p.test(hostname));
  } catch {
    return false;
  }
};

const submitSchema = z.object({
  taskId: z.string().cuid(),
  type: z.enum(["file", "screenshot", "link"]),
  fileUrl: z.string().optional(),
  fileName: z.string().max(255).optional(),
  fileSize: z.number().int().min(0).max(10 * 1024 * 1024).optional(), // max 10MB
  linkUrl: z
    .string()
    .url()
    .refine((url) => url.startsWith("https://") || url.startsWith("http://"), {
      message: "Only http/https URLs are allowed",
    })
    .refine(isPublicUrl, { message: "Private or internal URLs are not allowed" })
    .optional(),
  comment: z.string().max(1000).optional(),
});

// POST /api/practice/[lessonId]/submit
export async function POST(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { taskId, type, fileUrl, fileName, fileSize, linkUrl, comment } = parsed.data;

  // Prevent users from referencing another user's uploaded file
  if (fileUrl !== undefined && !fileUrl.startsWith(`/uploads/${session.user.id}/`)) {
    return NextResponse.json({ error: "Invalid file reference." }, { status: 400 });
  }

  // Проверяем что задание принадлежит этому уроку
  const task = await prisma.practiceTask.findFirst({
    where: { id: taskId, lessonId: params.lessonId },
  });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  // Если уже есть активный сабмит — заменяем (upsert через cancel + create)
  await prisma.practiceSubmission.updateMany({
    where: { taskId, userId: session.user.id, status: "active" },
    data: { status: "cancelled" },
  });

  const submission = await prisma.practiceSubmission.create({
    data: {
      userId: session.user.id,
      taskId,
      type,
      fileUrl,
      fileName,
      fileSize,
      linkUrl,
      comment,
      status: "active",
    },
  });

  return NextResponse.json({ submission });
}
