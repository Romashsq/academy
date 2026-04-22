import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { calculateLevel } from "@/lib/utils";
import type { Metadata } from "next";
import { CertificateClient } from "./certificate-client";

export const metadata: Metadata = {
  title: "Certificate — VibeCode Academy",
  description: "Course completion certificate for AI development",
};

export default async function CertificatePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [user, completedCount, totalCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, totalXP: true, createdAt: true },
    }),
    prisma.lessonProgress.count({
      where: { userId: session.user.id, completed: true },
    }),
    prisma.lesson.count({ where: { isPublished: true } }),
  ]);

  if (!user) redirect("/login");

  const { level, title: levelTitle } = calculateLevel(user.totalXP);

  // Unique certificate ID based on userId + date
  const certId = Buffer.from(`${session.user.id}-vibecode`).toString("base64").slice(0, 12).toUpperCase();

  return (
    <CertificateClient
      name={user.name ?? "Student"}
      completedCount={completedCount}
      totalCount={totalCount}
      totalXP={user.totalXP}
      level={level}
      levelTitle={levelTitle}
      certId={certId}
      userId={session.user.id}
    />
  );
}
