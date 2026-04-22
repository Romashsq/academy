/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Запрещаем встраивание в iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Запрещаем MIME-sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Контролируем Referer заголовок
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Запрещаем доступ к камере/микрофону/геолокации
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // HSTS — только HTTPS (включается в продакшене)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // CSP — контент только с нашего домена + Google для OAuth аватаров
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js требует unsafe-inline для hydration скриптов
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Разрешаем загрузку аватаров Google и GitHub
      "img-src 'self' data: blob: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://images.unsplash.com",
      // API запросы только к нашему домену
      "connect-src 'self'",
      // Медиа только с нашего домена
      "media-src 'self'",
      // Запрещаем <object>, <embed>
      "object-src 'none'",
      // Запрещаем встраивание через frame-ancestors
      "frame-ancestors 'none'",
      // Базовый URI только наш домен
      "base-uri 'self'",
      // Формы только на наш домен
      "form-action 'self'",
    ].join("; "),
  },
  // Убираем заголовок X-Powered-By (не раскрываем стек)
  { key: "X-Powered-By", value: "" },
];

const nextConfig = {
  // Gzip/Brotli сжатие ответов сервера
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
    // Tree-shake только stateless пакеты — framer-motion и react-markdown ломают RSC чанки
    optimizePackageImports: ["lucide-react", "recharts"],
  },

  // Применяем security headers + кеш статических ассетов
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders.filter((h) => h.value !== ""),
      },
      // Долгосрочное кеширование статических файлов Next.js (хэш в имени = safe to cache forever)
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Кеш загруженных файлов пользователей
      {
        source: "/uploads/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=3600" }],
      },
    ];
  },

  // Убираем X-Powered-By глобально
  poweredByHeader: false,
};

export default nextConfig;
