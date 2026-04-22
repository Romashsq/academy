import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================
// PROTECTED ROUTES — требуют авторизации
// ============================================

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/courses",
  "/lessons",
  "/profile",
  "/achievements",
  "/settings",
  "/leaderboard",
  "/search",
];

// API роуты, которые требуют авторизации (централизованная защита)
const PROTECTED_API_PREFIXES = [
  "/api/progress",
  "/api/quiz",
  "/api/practice",
  "/api/upload",
  "/api/chat",
  "/api/user",
  "/api/search",
];

// AUTH ROUTES — редирект на /dashboard если уже авторизован
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

// ============================================
// HELPERS
// ============================================

// Защита от Open Redirect: разрешаем только относительные пути нашего домена
function getSafeCallbackUrl(pathname: string): string {
  if (
    typeof pathname === "string" &&
    pathname.startsWith("/") &&
    !pathname.startsWith("//") && // Протоколо-независимые URL типа //evil.com
    !pathname.includes("://")      // Абсолютные URL с протоколом
  ) {
    return pathname;
  }
  return "/dashboard";
}

// ============================================
// MIDDLEWARE
// ============================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPage = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Пропускаем незащищённые маршруты без проверки сессии
  if (!isProtectedPage && !isProtectedApi && !isAuthRoute) {
    return NextResponse.next();
  }

  const session = await auth();

  // Защищённые страницы — редирект на логин
  if (isProtectedPage && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", getSafeCallbackUrl(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // Защищённые API — 401 без сессии
  if (isProtectedApi && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Авторизованный пользователь не должен видеть страницы входа
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Исключаем статику, но включаем все страницы и API кроме auth
    "/((?!api/auth|_next/static|_next/image|favicon.ico|uploads).*)",
  ],
};
