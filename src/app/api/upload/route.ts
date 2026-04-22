import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ============================================
// WHITELIST — только безопасные типы файлов
// ============================================

const ALLOWED_TYPES: Record<string, { maxBytes: number; magic: number[] | null }> = {
  "image/jpeg":      { maxBytes: 5 * 1024 * 1024, magic: [0xFF, 0xD8, 0xFF] },
  "image/png":       { maxBytes: 5 * 1024 * 1024, magic: [0x89, 0x50, 0x4E, 0x47] },
  "image/gif":       { maxBytes: 5 * 1024 * 1024, magic: [0x47, 0x49, 0x46] },
  "image/webp":      { maxBytes: 5 * 1024 * 1024, magic: null }, // RIFF....WEBP — проверяем отдельно
  "application/pdf": { maxBytes: 10 * 1024 * 1024, magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
};

// Опасные расширения — блокируем независимо от MIME
const BLOCKED_EXTENSIONS = new Set([
  ".exe", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx",
  ".html", ".htm", ".php", ".py", ".sh", ".bat", ".cmd",
  ".ps1", ".vbs", ".rb", ".pl", ".jar", ".dll", ".so",
  ".zip", ".tar", ".gz", ".rar", ".7z",
]);

function checkMagicBytes(buffer: Buffer, magic: number[] | null, mimeType: string): boolean {
  if (magic === null) {
    // WebP: начинается с RIFF (52 49 46 46) и байты 8-11 = WEBP (57 45 42 50)
    if (mimeType === "image/webp") {
      return (
        buffer[0] === 0x52 && buffer[1] === 0x49 &&
        buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 &&
        buffer[10] === 0x42 && buffer[11] === 0x50
      );
    }
    return true;
  }
  return magic.every((byte, i) => buffer[i] === byte);
}

function sanitizeFilename(name: string): string {
  // Убираем path traversal и оставляем только безопасные символы
  const base = path.basename(name);
  const sanitized = base.replace(/[^a-zA-Z0-9._\-]/g, "_").slice(0, 100);
  return sanitized || "file";
}

// POST /api/upload — загрузка файла
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Validate userId format — prevent path traversal via crafted session IDs
  const userId = session.user.id;
  if (!userId || !/^[a-zA-Z0-9_-]+$/.test(userId)) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  // Reject oversized requests before reading the body
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 11 * 1024 * 1024) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  // Rate limit: max 20 uploads per hour per user
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentUploads = await prisma.practiceSubmission.count({
    where: {
      userId,
      fileUrl: { not: null },
      submittedAt: { gte: oneHourAgo },
    },
  });
  if (recentUploads >= 20) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait before uploading more files." },
      { status: 429 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  // 1. Проверяем MIME тип
  const typeConfig = ALLOWED_TYPES[file.type];
  if (!typeConfig) {
    return NextResponse.json(
      { error: "File type not allowed. Only images (JPEG, PNG, GIF, WebP) and PDF are accepted." },
      { status: 400 }
    );
  }

  // 2. Проверяем расширение
  const ext = path.extname(file.name).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: "File extension not allowed." }, { status: 400 });
  }

  // 3. Проверяем размер (per-type лимит)
  if (file.size > typeConfig.maxBytes) {
    const maxMb = Math.round(typeConfig.maxBytes / 1024 / 1024);
    return NextResponse.json({ error: `File too large. Max ${maxMb} MB for this type.` }, { status: 400 });
  }

  // 4. Проверяем magic bytes (сигнатуру файла)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (!checkMagicBytes(buffer, typeConfig.magic, file.type)) {
    return NextResponse.json(
      { error: "File content does not match declared type." },
      { status: 400 }
    );
  }

  // 5. Безопасное имя файла (оригинальное имя только для БД, не для пути)
  const originalName = sanitizeFilename(file.name);
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const userDir = path.join(process.cwd(), "public", "uploads", userId);

  await mkdir(userDir, { recursive: true });
  await writeFile(path.join(userDir, safeName), buffer);

  const fileUrl = `/uploads/${userId}/${safeName}`;

  return NextResponse.json({
    fileUrl,
    fileName: originalName,
    fileSize: file.size,
  });
}
