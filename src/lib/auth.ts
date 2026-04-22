import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./prisma";

// ============================================
// СХЕМА ВАЛИДАЦИИ
// ============================================

const credentialsSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль минимум 6 символов"),
});

// ============================================
// NEXTAUTH КОНФИГУРАЦИЯ
// ============================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  // Используем JWT стратегию для Credentials (PrismaAdapter требует database для OAuth)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },

  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    // ──────────────────────────────────────────
    // Google OAuth
    // ──────────────────────────────────────────
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // ──────────────────────────────────────────
    // Email + Password
    // ──────────────────────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            hashedPassword: true,
            role: true,
          },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Добавляем кастомные поля в JWT токен
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user.id ?? "") as string;
        token.role = (user as { role?: string }).role ?? "student";
      }

      // При обновлении сессии (update()) — валидируем данные перед записью в JWT
      if (trigger === "update" && session) {
        if (typeof session.name === "string" && session.name.trim().length >= 2 && session.name.length <= 50) {
          token.name = session.name.trim();
        }
        // Разрешаем только HTTPS аватары с доверенных доменов
        const trustedImageDomains = ["lh3.googleusercontent.com", "avatars.githubusercontent.com"];
        if (
          typeof session.image === "string" &&
          session.image.startsWith("https://") &&
          trustedImageDomains.some((d) => session.image.includes(d))
        ) {
          token.image = session.image;
        }
      }

      return token;
    },

    // Добавляем кастомные поля в объект session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  events: {
    // Обновляем lastActiveAt при каждой сессии
    async signIn({ user }) {
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        }).catch(() => {
          // Тихо игнорируем ошибку — не критично
        });
      }
    },
  },
});
