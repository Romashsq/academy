"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Zap, ArrowRight, CheckCircle2, ChevronRight,
  Sparkles, Code2, Rocket, Brain, Bot, Layers, Shield,
  MessageSquare, FileCheck, Star, Flame, BookOpen, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function useSmoothScroll() {
  return useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);
}

const tools = [
  { name: "Claude", emoji: "🧠" },
  { name: "ChatGPT", emoji: "🤖" },
  { name: "Cursor", emoji: "⚡" },
  { name: "Bolt.new", emoji: "🔥" },
  { name: "Lovable", emoji: "💜" },
  { name: "Make.com", emoji: "🔌" },
  { name: "Replit", emoji: "🚀" },
  { name: "aiogram", emoji: "🐍" },
];

const modulesData = [
  {
    emoji: "🚀", lessons: 10, free: true,
    title: { ru: "Введение в ИИ-разработку", en: "Intro to AI Development" },
    desc: { ru: "Разбираемся что такое Вайбкодинг, осваиваем Claude и Cursor, пишем первые работающие промпты с нуля.", en: "Understand Vibe Coding, master Claude and Cursor, write your first working prompts from scratch." },
  },
  {
    emoji: "💬", lessons: 10, free: false,
    title: { ru: "Работа с Claude AI", en: "Working with Claude AI" },
    desc: { ru: "Загрузка файлов, анализ изображений, Claude Projects — учимся использовать Claude как профессиональный инструмент.", en: "File uploads, image analysis, Claude Projects — learn to use Claude as a professional tool." },
  },
  {
    emoji: "🤖", lessons: 10, free: false,
    title: { ru: "Создание Telegram-ботов", en: "Building Telegram Bots" },
    desc: { ru: "Python + aiogram 3.x: создаём ботов с меню, FSM, базой данных и деплоем на сервер.", en: "Python + aiogram 3.x: build bots with menus, FSM, database and server deployment." },
  },
  {
    emoji: "⚡", lessons: 10, free: false,
    title: { ru: "Vibe Coding — практика", en: "Vibe Coding in Practice" },
    desc: { ru: "Cursor, Bolt.new, Lovable, Replit — строим полноценные продукты без написания кода вручную.", en: "Cursor, Bolt.new, Lovable, Replit — build full products without writing code manually." },
  },
  {
    emoji: "🔌", lessons: 10, free: false,
    title: { ru: "API и интеграции", en: "APIs & Integrations" },
    desc: { ru: "Подключаем OpenAI, Anthropic, Make.com и Zapier. Автоматизируем рутину через API.", en: "Connect OpenAI, Anthropic, Make.com and Zapier. Automate routine work through APIs." },
  },
  {
    emoji: "🧠", lessons: 10, free: false,
    title: { ru: "ИИ-агенты", en: "AI Agents" },
    desc: { ru: "LangChain, CrewAI и мультиагентные системы — создаём ИИ, который работает автономно.", en: "LangChain, CrewAI and multi-agent systems — build AI that works autonomously." },
  },
  {
    emoji: "💰", lessons: 10, free: false,
    title: { ru: "Монетизация и продажи", en: "Monetization & Sales" },
    desc: { ru: "Ищем первых клиентов, строим портфолио, оцениваем проекты и выходим на фриланс-платформы.", en: "Find first clients, build a portfolio, price projects and work through freelance platforms." },
  },
  {
    emoji: "🏗️", lessons: 10, free: false,
    title: { ru: "Продвинутая архитектура", en: "Advanced Architecture" },
    desc: { ru: "RAG-системы, векторные базы данных, prompt caching и оптимизация стоимости запросов.", en: "RAG systems, vector databases, prompt caching and query cost optimization." },
  },
  {
    emoji: "📊", lessons: 10, free: false,
    title: { ru: "Данные и аналитика", en: "Data & Analytics" },
    desc: { ru: "Парсинг данных, pandas с ИИ-помощником, автоматические отчёты и дашборды.", en: "Data scraping, pandas with AI assistant, automated reports and dashboards." },
  },
  {
    emoji: "🎓", lessons: 10, free: false,
    title: { ru: "Финальный проект", en: "Final Project" },
    desc: { ru: "Планируем, строим и запускаем собственный MVP — от идеи до живого продукта.", en: "Plan, build and launch your own MVP — from idea to a live product." },
  },
];

const faqs: Record<string, { ru: string; en: string }> = {
  q1: { ru: "Нужны ли навыки программирования?", en: "Do I need programming skills?" },
  a1: { ru: "Нет. Курс создан для тех, кто не умеет программировать. Ты научишься строить продукты с помощью ИИ-инструментов.", en: "No. The course is for non-programmers. You'll learn to build products using AI tools." },
  q2: { ru: "Сколько времени нужно в день?", en: "How much time per day?" },
  a2: { ru: "30–60 минут в день достаточно. Курс рассчитан на 4–6 недель при таком темпе.", en: "30–60 minutes a day is enough. The course is designed for 4–6 weeks at that pace." },
  q3: { ru: "Как работает проверка домашних заданий?", en: "How does homework review work?" },
  a3: { ru: "Ты загружаешь скриншот или ссылку на своё задание, Vibe AI проверяет работу и даёт детальную обратную связь в течение секунды.", en: "You upload a screenshot or link to your work, Vibe AI reviews it and gives detailed feedback within seconds." },
  q4: { ru: "Что получу после курса?", en: "What will I get after the course?" },
  a4: { ru: "Реальные проекты в портфолио, навыки работы с ИИ-инструментами и сертификат после финального проекта.", en: "Real projects in your portfolio, AI tool skills and a certificate after the final project." },
};

export function LandingClient() {
  const ru = false;

  const scrollTo = useSmoothScroll();

  return (
    <div className="min-h-screen bg-[#070810] text-white overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#070810]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-500 to-lime-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-syne font-bold text-[17px] tracking-tight">VibeCode Academy</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[13px] text-gray-500">
            <a href="#how" onClick={scrollTo("how")} className="hover:text-white transition-colors cursor-pointer">
              {ru ? "Как работает" : "How it works"}
            </a>
            <a href="#ai-mentor" onClick={scrollTo("ai-mentor")} className="hover:text-white transition-colors cursor-pointer">
              {ru ? "AI-ментор" : "AI Mentor"}
            </a>
            <a href="#curriculum" onClick={scrollTo("curriculum")} className="hover:text-white transition-colors cursor-pointer">
              {ru ? "Программа" : "Curriculum"}
            </a>
            <a href="#pricing" onClick={scrollTo("pricing")} className="hover:text-white transition-colors cursor-pointer">
              {ru ? "Цены" : "Pricing"}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white text-[13px]">
                {ru ? "Войти" : "Log in"}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1.5 text-[13px]">
                <Sparkles className="w-3.5 h-3.5" />
                {ru ? "Начать бесплатно" : "Start free"}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-lime-500/[0.06] rounded-full blur-[140px]" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.025,
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-500/25 bg-lime-500/[0.06] text-lime-400/90 text-[13px] mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            {ru ? "Учись создавать с ИИ — не просто изучать" : "Learn to build with AI — not just study it"}
          </div>

          <h1 className="font-syne text-[56px] md:text-[80px] font-bold leading-[1.0] mb-7 tracking-tight">
            {ru ? (
              <>Создавай продукты<br /><span className="text-lime-400">с помощью ИИ</span></>
            ) : (
              <>Build products<br /><span className="text-lime-400">with AI</span></>
            )}
          </h1>

          <p className="text-[17px] text-gray-400 mb-5 max-w-2xl mx-auto leading-relaxed">
            {ru
              ? "Практический курс — ты не просто смотришь видео, а строишь реальные проекты: Telegram-боты, SaaS-сервисы, ИИ-агенты. Каждый проект готов к показу клиентам и идёт в портфолио."
              : "A practical course — you don't just watch videos, you build real projects: Telegram bots, SaaS services, AI agents. Every project is client-ready and goes into your portfolio."}
          </p>
          <p className="text-[15px] text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
            {ru
              ? "AI-ментор проверяет задания и отвечает на вопросы 24/7. Cursor, Claude, Bolt.new — только актуальные инструменты 2025 года."
              : "AI mentor reviews tasks and answers questions 24/7. Cursor, Claude, Bolt.new — only relevant 2025 tools."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="xl" className="gap-2 px-10 shadow-lg shadow-lime-500/15">
                {ru ? "Начать бесплатно" : "Start for free"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#curriculum" onClick={scrollTo("curriculum")}>
              <Button size="xl" variant="outline" className="px-8 border-white/10 hover:border-white/20 text-gray-300">
                {ru ? "Смотреть программу" : "View curriculum"}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="border-y border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "65+",  label: ru ? "Уроков" : "Lessons" },
            { value: "10",   label: ru ? "Модулей" : "Modules" },
            { value: "24/7", label: ru ? "AI-ментор" : "AI Mentor" },
            { value: "∞",    label: ru ? "Доступ навсегда" : "Lifetime access" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-syne text-3xl font-bold text-lime-400 mb-1">{s.value}</div>
              <div className="text-[13px] text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOOLS ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] text-gray-600 uppercase tracking-[0.18em] mb-7">
            {ru ? "Инструменты которые ты освоишь" : "Tools you will master"}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {tools.map((t) => (
              <div key={t.name} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.02] text-[13px] text-gray-400 hover:border-lime-500/20 hover:text-white transition-all">
                <span>{t.emoji}</span>
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6 border-t border-white/[0.06] scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] text-lime-400/70 uppercase tracking-[0.18em] mb-4 font-mono">
              {ru ? "Как это работает" : "How it works"}
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-bold mb-4">
              {ru ? "Три шага до результата" : "Three steps to results"}
            </h2>
            <p className="text-gray-500 text-[15px] max-w-md mx-auto">
              {ru ? "Без воды — только практика и реальные проекты" : "No fluff — just practice and real projects"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: "01", icon: BookOpen, title: ru ? "Смотришь урок" : "Watch the lesson", desc: ru ? "Структурированный контент с примерами кода, скриншотами и пошаговыми инструкциями." : "Structured content with code examples, screenshots and step-by-step instructions." },
              { num: "02", icon: Code2,    title: ru ? "Делаешь задание" : "Do the task",      desc: ru ? "Практическое задание по теме. Загружаешь результат — скриншот или ссылку на проект." : "A practical task on the topic. Upload the result — a screenshot or project link." },
              { num: "03", icon: Bot,      title: ru ? "Получаешь фидбек" : "Get feedback",    desc: ru ? "Vibe AI мгновенно проверяет работу и даёт оценку. Застрял — спрашивай в чате." : "Vibe AI instantly reviews your work. Stuck — ask in the chat." },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="p-7 rounded-2xl border border-white/[0.07] bg-white/[0.015] hover:border-lime-500/15 hover:bg-lime-500/[0.02] transition-all">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-syne text-[42px] font-bold text-white/[0.04] leading-none select-none">{step.num}</span>
                    <div className="w-9 h-9 rounded-xl bg-lime-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-lime-400" style={{ width: 18, height: 18 }} />
                    </div>
                  </div>
                  <h3 className="font-syne font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] text-lime-400/70 uppercase tracking-[0.18em] mb-4 font-mono">
              {ru ? "Что ты построишь" : "What you will build"}
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-bold mb-4">
              {ru ? "5 реальных проектов в портфолио" : "5 real projects for your portfolio"}
            </h2>
            <p className="text-gray-500 text-[15px] max-w-lg mx-auto">
              {ru
                ? "Не учебные задачи — а работающие продукты, которые можно сразу продавать клиентам или запускать как стартап"
                : "Not toy exercises — working products you can sell to clients or launch as a startup"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                emoji: "🤖",
                tag: ru ? "Модуль 3" : "Module 3",
                title: ru ? "Telegram-бот с ИИ" : "AI Telegram Bot",
                desc: ru
                  ? "Бот с меню, FSM-диалогами, базой данных и интеграцией Claude. Отвечает на вопросы, собирает заявки, отправляет уведомления — готов к продаже от $200."
                  : "Bot with menus, FSM dialogs, database and Claude integration. Answers questions, collects leads — ready to sell for $200+.",
                stack: ["Python", "aiogram 3", "SQLite", "Claude API"],
              },
              {
                emoji: "⚡",
                tag: ru ? "Модуль 4" : "Module 4",
                title: ru ? "SaaS-лендинг с AI" : "AI SaaS Landing",
                desc: ru
                  ? "Полноценный сайт для стартапа или сервиса: лендинг, форма оплаты, кабинет пользователя. Собирается в Bolt.new или Lovable за несколько часов."
                  : "Full website for a startup: landing, payment form, user dashboard. Built in Bolt.new or Lovable in a few hours.",
                stack: ["Bolt.new", "Lovable", "Vercel", "Stripe"],
              },
              {
                emoji: "🧠",
                tag: ru ? "Модуль 6" : "Module 6",
                title: ru ? "ИИ-агент для задач" : "AI Task Agent",
                desc: ru
                  ? "Агент на LangChain или CrewAI, который самостоятельно ищет информацию, пишет тексты и выполняет задачи без твоего участия."
                  : "LangChain or CrewAI agent that independently searches info, writes content and completes tasks without you.",
                stack: ["LangChain", "CrewAI", "OpenAI", "Python"],
              },
              {
                emoji: "🔌",
                tag: ru ? "Модуль 5" : "Module 5",
                title: ru ? "Автоматизация бизнеса" : "Business Automation",
                desc: ru
                  ? "Система автоматизации на Make.com: собирает данные из форм, отправляет в CRM, уведомляет в Telegram, генерирует документы через AI."
                  : "Make.com automation: collects form data, sends to CRM, notifies via Telegram, generates documents via AI.",
                stack: ["Make.com", "Zapier", "Notion API", "Telegram"],
              },
              {
                emoji: "📊",
                tag: ru ? "Модуль 9" : "Module 9",
                title: ru ? "AI-аналитика и дашборд" : "AI Analytics Dashboard",
                desc: ru
                  ? "Парсишь данные, обрабатываешь с помощью pandas и ИИ, строишь автоматический дашборд с графиками и выводами — всё без ручного кода."
                  : "Parse data, process with pandas and AI, build an automatic dashboard with charts and insights — all without manual coding.",
                stack: ["Python", "pandas", "Recharts", "Claude"],
              },
              {
                emoji: "🎓",
                tag: ru ? "Модуль 10" : "Module 10",
                title: ru ? "Твой MVP-стартап" : "Your MVP Startup",
                desc: ru
                  ? "Финальный проект — твоя собственная идея. Планируешь, строишь и запускаешь полноценный продукт с реальными пользователями. Сертификат после запуска."
                  : "Final project — your own idea. Plan, build and launch a real product with actual users. Certificate after launch.",
                stack: [ru ? "Твой стек" : "Your stack", "Vercel", "AI tools", "🏆"],
              },
            ].map((p) => (
              <div key={p.title} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.015] hover:border-lime-500/15 hover:bg-lime-500/[0.02] transition-all flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{p.emoji}</span>
                  <span className="text-[11px] text-lime-400/60 font-mono bg-lime-500/[0.08] border border-lime-500/15 px-2.5 py-1 rounded-full">{p.tag}</span>
                </div>
                <h3 className="font-syne font-bold text-white mb-2 text-[16px]">{p.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed flex-1 mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="text-[11px] text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] text-lime-400/70 uppercase tracking-[0.18em] mb-4 font-mono">
              {ru ? "Что входит" : "What's included"}
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-bold">
              {ru ? "Всё что нужно для старта" : "Everything you need to start"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Brain,     color: "text-violet-400", bg: "bg-violet-500/10",  title: ru ? "От нуля до продукта" : "Zero to product",     desc: ru ? "10 модулей с нарастающей сложностью. Начинаешь с первого промпта — заканчиваешь запущенным MVP с реальными пользователями." : "10 modules with increasing complexity. Start with your first prompt — finish with a live MVP with real users." },
              { icon: Bot,       color: "text-lime-400",   bg: "bg-lime-500/10",    title: ru ? "AI-ментор 24/7" : "AI Mentor 24/7",            desc: ru ? "Vibe AI знает содержание всех 65+ уроков. Задай вопрос по теме урока — получишь точный ответ, а не общие советы." : "Vibe AI knows all 65+ lessons. Ask a question on any lesson — get a precise answer, not generic advice." },
              { icon: FileCheck, color: "text-blue-400",   bg: "bg-blue-500/10",    title: ru ? "Проверка заданий" : "Task Review",             desc: ru ? "Загружаешь скриншот или ссылку — AI проверяет за секунду, ставит оценку и даёт конкретные советы что улучшить." : "Upload a screenshot or link — AI reviews in seconds, grades your work and gives specific improvement tips." },
              { icon: Code2,     color: "text-orange-400", bg: "bg-orange-500/10",  title: ru ? "5 реальных проектов" : "5 real projects",      desc: ru ? "Telegram-бот, SaaS-сервис, ИИ-агент, автоматизация на Make.com, аналитический дашборд — всё идёт в портфолио." : "Telegram bot, SaaS service, AI agent, Make.com automation, analytics dashboard — all go into your portfolio." },
              { icon: Layers,    color: "text-pink-400",   bg: "bg-pink-500/10",    title: ru ? "Актуальный стек 2025" : "2025 Tech Stack",     desc: ru ? "Cursor AI, Claude, Bolt.new, Make.com, aiogram — только инструменты которые реально используют и за которые платят прямо сейчас." : "Cursor AI, Claude, Bolt.new, Make.com, aiogram — only tools that are actually used and paid for right now." },
              { icon: Shield,    color: "text-emerald-400",bg: "bg-emerald-500/10", title: ru ? "Доступ навсегда" : "Lifetime access",          desc: ru ? "Платишь один раз — получаешь всё: текущие уроки, новые модули, обновления стека. Курс растёт вместе с рынком ИИ." : "Pay once — get everything: current lessons, new modules, stack updates. The course grows with the AI market." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.015] hover:border-white/[0.12] transition-all">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-syne font-bold text-white mb-2 text-[15px]">{f.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI MENTOR ── */}
      <section id="ai-mentor" className="py-24 px-6 border-t border-white/[0.06] scroll-mt-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] text-lime-400/70 uppercase tracking-[0.18em] mb-4 font-mono">
              {ru ? "Vibe AI — твой ментор" : "Vibe AI — your mentor"}
            </p>
            <h2 className="font-syne text-4xl font-bold mb-5">
              {ru ? "ИИ, который знает весь курс" : "AI that knows the full course"}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-9 text-[15px]">
              {ru
                ? "Vibe AI — это не просто чат-бот. Он знает содержание всех 10 модулей, понимает на каком этапе ты находишься и даёт точные советы именно по твоей теме."
                : "Vibe AI is not just a chatbot. It knows all 10 modules, understands your progress and gives precise advice on your specific topic."}
            </p>
            <div className="space-y-3.5">
              {[
                { icon: MessageSquare, color: "text-lime-400",   bg: "bg-lime-500/10",   text: ru ? "Отвечает на вопросы по любой теме курса" : "Answers questions on any course topic" },
                { icon: FileCheck,     color: "text-blue-400",   bg: "bg-blue-500/10",   text: ru ? "Проверяет домашние задания и даёт оценку" : "Reviews homework and provides a grade" },
                { icon: Rocket,        color: "text-violet-400", bg: "bg-violet-500/10", text: ru ? "Помогает с кодом, ошибками и деплоем" : "Helps with code, errors and deployment" },
                { icon: Flame,         color: "text-orange-400", bg: "bg-orange-500/10", text: ru ? "Мотивирует и объясняет темы повторно" : "Motivates and re-explains topics" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="text-gray-300 text-[14px]">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-lime-500/[0.04] rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl border border-white/[0.08] bg-[#0b0d16] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-lime-400 to-lime-700 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-lime-400 rounded-full border-2 border-[#0b0d16]" />
                </div>
                <div>
                  <p className="text-white text-[13px] font-semibold leading-none">Vibe AI</p>
                  <p className="text-lime-400 text-[11px] font-mono mt-0.5">● {ru ? "онлайн" : "online"}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-lime-400 to-lime-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-gray-200 max-w-[82%] leading-relaxed">
                    {ru ? "Привет! Вижу, что ты проходишь модуль по Telegram-ботам 🤖 Чем могу помочь?" : "Hey! I see you're on the Telegram Bots module 🤖 How can I help?"}
                  </div>
                </div>
                <div className="flex gap-2.5 flex-row-reverse">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] text-gray-400">Я</span>
                  </div>
                  <div className="bg-lime-500/[0.12] border border-lime-500/20 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13px] text-lime-100 max-w-[82%] leading-relaxed">
                    {ru ? "Как добавить базу данных в бот?" : "How do I add a database to the bot?"}
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-lime-400 to-lime-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-gray-200 max-w-[82%] leading-relaxed">
                    {ru ? "Используй aiosqlite — асинхронная SQLite. Установи: pip install aiosqlite, затем создай init_db()..." : "Use aiosqlite — it's async SQLite. Install: pip install aiosqlite, then create init_db()..."}
                  </div>
                </div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-3 mt-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Star className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-violet-400 text-[11px] font-semibold">{ru ? "Проверка задания" : "Task review"}</span>
                    <span className="ml-auto text-[11px] text-yellow-400 font-semibold bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                      ✓ {ru ? "Отлично" : "Excellent"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[12px] leading-relaxed">
                    {ru ? "Бот работает корректно! Код чистый. Совет: добавь обработку ошибок в /start." : "Bot works correctly! Clean code. Tip: add error handling in /start."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GAMIFICATION ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-lime-500/[0.04] rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl border border-white/[0.08] bg-[#0b0d16] p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="font-syne font-bold text-white text-[13px]">{ru ? "Твой прогресс" : "Your progress"}</span>
                <div className="flex items-center gap-1.5 bg-lime-500/10 border border-lime-500/20 rounded-full px-2.5 py-1">
                  <Star className="w-3 h-3 text-lime-400" />
                  <span className="text-lime-400 text-[12px] font-semibold">2 840 XP</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex justify-between text-[12px] mb-2">
                  <span className="text-lime-400/80">{ru ? "Ур.4 — Эксперт" : "Lvl.4 — Expert"}</span>
                  <span className="text-lime-400">2840 / 5000 XP</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full bg-gradient-to-r from-lime-500 to-lime-400 w-[57%]" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/[0.05] border border-orange-500/15">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-orange-400 font-bold text-lg leading-none">{ru ? "7 дней" : "7 days"}</div>
                  <div className="text-gray-600 text-[12px] mt-0.5">{ru ? "стрик не прерван" : "streak intact"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[13px] font-medium truncate">{ru ? "FSM в Telegram-боте — пройдено" : "FSM in Telegram Bot — completed"}</p>
                  <p className="text-gray-600 text-[11px]">+150 XP · {ru ? "только что" : "just now"}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] text-lime-400/70 uppercase tracking-[0.18em] mb-4 font-mono">
              {ru ? "Геймификация" : "Gamification"}
            </p>
            <h2 className="font-syne text-4xl font-bold mb-5">
              {ru ? "Учёба — это игра" : "Learning is a game"}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 text-[15px]">
              {ru
                ? "XP, уровни и стрики делают обучение увлекательным. Видишь прогресс — продолжаешь учиться."
                : "XP, levels and streaks make learning engaging. You see progress — you keep going."}
            </p>
            <div className="space-y-3">
              {[
                { icon: "⚡", text: ru ? "XP за каждый урок и квиз" : "XP for every lesson and quiz" },
                { icon: "🔥", text: ru ? "Стрики за ежедневное обучение" : "Streaks for daily learning" },
                { icon: "🏆", text: ru ? "Достижения за ключевые этапы" : "Achievements for key milestones" },
                { icon: "📊", text: ru ? "Таблица лидеров среди студентов" : "Student leaderboard" },
                { icon: "🚀", text: ru ? "Уровни от Новичка до Мастера" : "Levels from Beginner to Master" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-gray-400">
                  <span className="text-[18px] w-7 text-center flex-shrink-0">{item.icon}</span>
                  <span className="text-[14px]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section id="curriculum" className="py-24 px-6 border-t border-white/[0.06] scroll-mt-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-lime-400/70 uppercase tracking-[0.18em] mb-4 font-mono">
              {ru ? "Программа курса" : "Course curriculum"}
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-bold mb-3">
              {ru ? "10 модулей · 65+ уроков" : "10 modules · 65+ lessons"}
            </h2>
            <p className="text-gray-500 text-[15px]">
              {ru ? "От первого промпта до запущенного продукта" : "From your first prompt to a launched product"}
            </p>
          </div>

          <div className="space-y-1.5">
            {modulesData.map((mod, i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/[0.07] bg-white/[0.015] overflow-hidden hover:border-white/[0.12] transition-colors"
              >
                <summary className="flex items-center gap-4 p-4 cursor-pointer list-none">
                  <span className="text-[20px] w-8 text-center flex-shrink-0">{mod.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white text-[14px]">
                        {ru ? mod.title.ru : mod.title.en}
                      </span>
                      {mod.free && (
                        <Badge variant="free" className="text-[10px]">
                          {ru ? "Бесплатно" : "Free"}
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-600 text-[12px]">{mod.lessons} {ru ? "уроков" : "lessons"}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-700 group-open:rotate-90 transition-transform duration-200 flex-shrink-0" />
                </summary>
                <div className="px-4 pb-4 pt-1 border-t border-white/[0.05]">
                  <p className="text-gray-500 text-[13px] leading-relaxed pl-12">
                    {ru ? mod.desc.ru : mod.desc.en}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center pt-8">
            <Link href="/register">
              <Button className="gap-2">
                {ru ? "Начать бесплатно" : "Start for free"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 border-t border-white/[0.06] scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-lime-400/70 uppercase tracking-[0.18em] mb-4 font-mono">
              {ru ? "Цены" : "Pricing"}
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-bold mb-3">
              {ru ? "Прозрачно и честно" : "Transparent and fair"}
            </h2>
            <p className="text-gray-500 text-[15px]">
              {ru ? "Начни бесплатно — переходи на полный доступ когда будешь готов" : "Start free — upgrade when you're ready"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-7 rounded-2xl border border-white/[0.07] bg-white/[0.015]">
              <h3 className="font-syne font-bold text-white text-lg mb-1">{ru ? "Бесплатно" : "Free"}</h3>
              <p className="text-gray-600 text-[13px] mb-6">{ru ? "Попробуй без риска" : "Try without risk"}</p>
              <div className="mb-7">
                <span className="font-syne text-4xl font-bold text-white">$0</span>
                <span className="text-gray-600 text-[13px] ml-2">{ru ? "навсегда" : "forever"}</span>
              </div>
              <ul className="space-y-2.5 mb-7">
                {(ru
                  ? ["Первые уроки каждого модуля", "Система XP и достижений", "Квизы и практические задания", "Таблица лидеров", "AI-ментор (базовый доступ)"]
                  : ["First lessons of each module", "XP and achievement system", "Quizzes and practice tasks", "Leaderboard", "AI Mentor (basic access)"]
                ).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-lime-400/70 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full border-white/10 hover:border-white/20">
                  {ru ? "Начать бесплатно" : "Start for free"}
                </Button>
              </Link>
            </div>

            <div className="relative p-7 rounded-2xl border border-lime-500/30 bg-lime-500/[0.04]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-lime-500 to-lime-600 text-black text-[11px] font-bold px-4 py-1 rounded-full">
                  {ru ? "Популярный" : "Popular"}
                </span>
              </div>
              <h3 className="font-syne font-bold text-white text-lg mb-1">{ru ? "Полный доступ" : "Full Access"}</h3>
              <p className="text-gray-500 text-[13px] mb-6">{ru ? "Всё включено навсегда" : "Everything included forever"}</p>
              <div className="mb-7">
                <span className="font-syne text-4xl font-bold text-white">$49</span>
                <span className="text-gray-500 text-[13px] ml-2">{ru ? "единоразово" : "one-time"}</span>
              </div>
              <ul className="space-y-2.5 mb-7">
                {(ru
                  ? ["Все 65+ уроков без ограничений", "Финальные проекты с AI-проверкой", "Сертификат после курса", "Все будущие обновления", "Приоритетная поддержка"]
                  : ["All 65+ lessons unlimited", "Final projects with AI review", "Certificate after the course", "All future updates", "Priority support"]
                ).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full shadow-lg shadow-lime-500/20">
                  {ru ? "Получить полный доступ" : "Get full access"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-lime-400/70 uppercase tracking-[0.18em] mb-4 font-mono">FAQ</p>
            <h2 className="font-syne text-4xl font-bold">{ru ? "Частые вопросы" : "Common questions"}</h2>
          </div>
          <div className="space-y-2">
            {(["1", "2", "3", "4"] as const).map((n) => (
              <details key={n} className="group rounded-xl border border-white/[0.07] bg-white/[0.015] overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-white text-[14px] font-medium hover:text-lime-400 transition-colors">
                  {ru ? faqs[`q${n}`].ru : faqs[`q${n}`].en}
                  <ChevronRight className="w-4 h-4 text-gray-700 flex-shrink-0 group-open:rotate-90 transition-transform duration-200 ml-4" />
                </summary>
                <div className="px-5 pb-5 text-gray-500 text-[13px] leading-relaxed border-t border-white/[0.05] pt-4">
                  {ru ? faqs[`a${n}`].ru : faqs[`a${n}`].en}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-lime-500/[0.06] rounded-full blur-[100px]" />
        </div>
        <div className="max-w-xl mx-auto text-center relative z-10">
          <h2 className="font-syne text-5xl md:text-[64px] font-bold mb-6 leading-[1.0] tracking-tight">
            {ru ? "Начни строить" : "Start building"}<br />
            <span className="text-lime-400">{ru ? "прямо сейчас" : "right now"}</span>
          </h2>
          <p className="text-gray-500 text-[16px] mb-10">
            {ru ? "Первые уроки бесплатны. Регистрация за 30 секунд." : "First lessons are free. Sign up in 30 seconds."}
          </p>
          <Link href="/register">
            <Button size="xl" className="gap-2 px-12 shadow-xl shadow-lime-500/15">
              {ru ? "Начать бесплатно" : "Start for free"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-gray-700 text-[12px] mt-5">
            {ru ? "Без кредитной карты · Отмена в любое время" : "No credit card · Cancel anytime"}
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-lime-500 to-lime-700 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-syne font-bold text-white text-[15px]">VibeCode Academy</span>
            </div>
            <div className="flex items-center gap-6 text-[13px] text-gray-600">
              <a href="#curriculum" onClick={scrollTo("curriculum")} className="hover:text-white transition-colors cursor-pointer">
                {ru ? "Программа" : "Curriculum"}
              </a>
              <a href="#pricing" onClick={scrollTo("pricing")} className="hover:text-white transition-colors cursor-pointer">
                {ru ? "Цены" : "Pricing"}
              </a>
              <Link href="/login" className="hover:text-white transition-colors">{ru ? "Войти" : "Log in"}</Link>
              <Link href="/register" className="hover:text-white transition-colors">{ru ? "Регистрация" : "Sign up"}</Link>
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-700 text-[12px]">© 2025 VibeCode Academy. {ru ? "Все права защищены." : "All rights reserved."}</p>
            <div className="flex items-center gap-1.5 text-gray-700 text-[12px]">
              <TrendingUp className="w-3.5 h-3.5" />
              {ru ? "Сделано с ❤️ и Claude AI" : "Made with ❤️ and Claude AI"}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
