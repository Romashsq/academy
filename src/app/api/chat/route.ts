import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

// ============================================
// SYSTEM PROMPT — Vibe AI Mentor at VibeCode Academy
// ============================================

const SYSTEM_PROMPT = `You are Vibe AI — the personal AI mentor at VibeCode Academy, an online platform teaching AI development, Vibe Coding, and prompt engineering to students in Ukraine and Russian-speaking markets.

## Your Role
- You are a MENTOR, not just a chatbot. You know each student's progress and guide them personally.
- Friendly, sharp, direct — like a senior developer who genuinely enjoys teaching
- Always respond in the SAME LANGUAGE the user writes in (if Russian → Russian, if English → English)
- Use emojis occasionally to keep things lively 🚀

## VibeCode Academy — Full Course Structure (10 modules, 65+ lessons)

### Module 1 🚀 Введение в ИИ-разработку
Что такое Вайбкодинг, Инструменты Вайбкодинга (Cursor/Bolt/Lovable), Первый разговор с Claude,
Структура хорошего промпта, Zero-shot и few-shot prompting, Chain-of-thought промптинг,
Итеративное улучшение промптов, Ролевые промпты, Системные промпты, Финальный проект модуля

### Module 2 💬 Работа с Claude AI
Возможности Claude (vs ChatGPT), Загрузка файлов и документов, Анализ изображений,
Claude Projects, Работа с кодом в Claude, Создание контента с Claude,
Аналитика и исследования, Claude API основы, Автоматизация задач, Финальный проект модуля

### Module 3 🤖 Создание Telegram-ботов
Архитектура Telegram-ботов, BotFather и токены, Python + aiogram 3.x,
Команды и хэндлеры, Инлайн-клавиатуры и меню, FSM и состояния,
Работа с базой данных (SQLite/aiosqlite), Деплой бота на сервер,
Webhook vs polling, Финальный проект модуля

### Module 4 ⚡ Vibe Coding — практика
Cursor AI (основы и продвинутое), Bolt.new, Lovable, Replit AI,
V0.dev by Vercel, Деплой на Vercel, GitHub Copilot, Windsurf,
Cursor Rules и кастомизация, Финальный проект модуля

### Module 5 🔌 API и интеграции
REST API концепции, OpenAI API, Anthropic API (Claude),
Make.com автоматизации, Zapier, Notion API,
Telegram API напрямую, Google Sheets API, Webhooks, Финальный проект модуля

### Module 6 🧠 ИИ-агенты
Что такое ИИ-агент, LangChain основы, CrewAI,
AutoGPT концепции, Tool use в агентах, Memory системы,
Planning в агентах, Multi-agent системы, Деплой агентов, Финальный проект модуля

### Module 7 💰 Монетизация и продажи
Продуктовое мышление для фрилансера, Поиск первых клиентов,
Оценка проектов и ценообразование, Создание портфолио,
Фриланс-платформы (Upwork/Freelancehunt), Telegram для продаж,
Реальные кейсы и примеры, Переговоры с клиентами,
Контракты и безопасность, Финальный проект модуля

### Module 8 🏗️ Продвинутая архитектура
Паттерны проектирования с ИИ, Микросервисы + ИИ, RAG системы,
Vector databases (Pinecone/Chroma), Fine-tuning моделей,
Prompt caching (Anthropic), Batching запросов, Streaming,
Cost optimization, Финальный проект модуля

### Module 9 📊 Данные и аналитика
Парсинг данных с ИИ, pandas + ИИ-ассистент, Data visualization,
SQL с ИИ-помощником, Автоматические отчёты, Google Analytics + ИИ,
A/B тестирование, Прогнозирование, Дашборды, Финальный проект модуля

### Module 10 🎓 Финальный проект
Планирование продукта, Техническое задание, MVP разработка,
Тестирование и QA, Деплой и запуск, Маркетинг и первые пользователи,
Метрики и аналитика, Итерации по фидбеку, Презентация проекта, Выпуск!

## Your Expertise (always give working, production-ready answers)
- **Prompt Engineering**: Zero-shot, few-shot, chain-of-thought, role prompting, structured output
- **Vibe Coding**: Cursor AI, Bolt.new, Lovable, Replit — building without traditional coding
- **Telegram Bots**: aiogram 3.x (Python), FSM, databases, webhooks, payments
- **Claude API & OpenAI API**: integration, streaming, tool use, vision
- **AI Agents**: LangChain, CrewAI, tool use, memory, planning
- **APIs & Automation**: Make.com, Zapier, REST APIs, webhooks

## Rules
- ALWAYS respond in the SAME language as the user (Russian → Russian, English → English)
- When a student is struggling (needs_work on homework) — be EXTRA encouraging and explain the topic step by step
- When generating code: provide COMPLETE, RUNNABLE examples with all imports
- When asked about a course topic — refer to the specific module and lesson
- Add deployment instructions after code examples
- Keep answers focused and practical — no fluff
- If a student asks about their progress, use the data provided in Student Progress section`;

// ============================================
// GET — load chat history
// ============================================

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "30"), 100);

  const messages = await prisma.aiChatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: { id: true, role: true, content: true, createdAt: true },
  });

  return Response.json(messages);
}

// ============================================
// POST — send message + stream response + save
// ============================================

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { messages, context, userMessageId, imageUrl } = await req.json();

  // Validate messages
  if (!Array.isArray(messages) || messages.length > 100) {
    return new Response("Invalid messages", { status: 400 });
  }

  // Limit context length to prevent prompt injection / oversized payloads
  const safeContext = typeof context === "string" ? context.slice(0, 500) : "";

  // SSRF prevention: only allow local /uploads/ paths, never external URLs
  const safeImageUrl =
    typeof imageUrl === "string" && imageUrl.startsWith("/uploads/")
      ? imageUrl
      : null;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new Response("OpenAI API key not configured", { status: 500 });

  // Rate limiting: max 50 messages per 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const msgCount = await prisma.aiChatMessage.count({
    where: { userId: session.user.id, role: "user", createdAt: { gte: since } },
  });
  if (msgCount >= 50) {
    return Response.json({ error: "Daily message limit reached (50/day). Try again tomorrow." }, { status: 429 });
  }

  // Загружаем контекст студента из БД — все 3 запроса параллельно
  const [completedLessons, student, completedCount] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId: session.user.id, completed: true },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: {
        lesson: {
          select: {
            title: true,
            module: { select: { title: true, order: true } },
          },
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, totalXP: true, currentStreak: true },
    }),
    prisma.lessonProgress.count({ where: { userId: session.user.id, completed: true } }),
  ]);

  const recentLessonsStr = completedLessons.length > 0
    ? completedLessons
        .map((lp) => `Module ${lp.lesson.module.order} → ${lp.lesson.title}`)
        .join(" | ")
    : "";

  const studentCtx = student
    ? `Student: ${student.name ?? "Anonymous"} | Completed: ${completedCount}/65 lessons | XP: ${student.totalXP} | Streak: ${student.currentStreak} days${recentLessonsStr ? ` | Recently completed: ${recentLessonsStr}` : ""}`
    : "";

  const systemContent = [
    SYSTEM_PROMPT,
    studentCtx ? `\n\n## Student Progress\n${studentCtx}` : "",
    safeContext ? `\n\n## Current Lesson Context\n${safeContext}` : "",
  ].join("");

  const client = new OpenAI({ apiKey });

  const lastUserMsg = messages.findLast((m: { role: string; content: string }) => m.role === "user");

  // Мультимодальный контент (если прикреплено изображение)
  type MsgContent = string | OpenAI.ChatCompletionContentPart[];
  let lastUserContent: MsgContent = lastUserMsg?.content ?? "";

  if (safeImageUrl && lastUserMsg) {
    try {
      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const fullUrl = `${baseUrl}${safeImageUrl}`;
      const imgRes = await fetch(fullUrl);
      if (imgRes.ok) {
        const ct = imgRes.headers.get("content-type") ?? "image/jpeg";
        if (ct.startsWith("image/")) {
          const b64 = Buffer.from(await imgRes.arrayBuffer()).toString("base64");
          lastUserContent = [
            { type: "text", text: lastUserMsg.content || "What do you see in this screenshot?" },
            { type: "image_url", image_url: { url: `data:${ct};base64,${b64}`, detail: "low" } },
          ];
        }
      }
    } catch {
      // Если не удалось загрузить изображение — отправляем только текст
    }
  }

  // Save user message to DB (только текст)
  if (lastUserMsg) {
    await prisma.aiChatMessage.create({
      data: {
        id: userMessageId ?? undefined,
        userId: session.user.id,
        role: "user",
        content: lastUserMsg.content || (safeImageUrl ? "[image attached]" : ""),
      },
    });
  }

  // Строим список сообщений для OpenAI
  const openAiMessages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemContent },
    ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: lastUserContent },
  ];

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: openAiMessages,
    max_tokens: 2048,
    temperature: 0.7,
  });

  const encoder = new TextEncoder();
  let fullResponse = "";
  const userId = session.user.id;

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        // Save assistant response to DB after stream completes
        if (fullResponse) {
          await prisma.aiChatMessage.create({
            data: { userId, role: "assistant", content: fullResponse },
          });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

// ============================================
// DELETE — clear chat history
// ============================================

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  await prisma.aiChatMessage.deleteMany({ where: { userId: session.user.id } });
  return Response.json({ ok: true });
}
