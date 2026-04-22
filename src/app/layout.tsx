import type { Metadata, Viewport } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastContainer } from "@/components/ui/toast-notification";
import { SplashScreen } from "@/components/ui/splash-screen";
import { StoreHydration } from "@/components/providers/store-hydration";
import "./globals.css";

// ============================================
// ШРИФТЫ
// ============================================

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ============================================
// МЕТАДАННЫЕ
// ============================================

export const metadata: Metadata = {
  title: {
    default: "VibeCode Academy",
    template: "%s | VibeCode Academy",
  },
  description:
    "Online school for AI, Vibe Coding and prompt engineering. Build apps with AI without coding skills.",
  keywords: [
    "vibe coding",
    "prompt engineering",
    "AI",
    "cursor ai",
    "chatgpt",
    "claude",
    "artificial intelligence",
    "online course",
  ],
  authors: [{ name: "VibeCode Academy" }],
  creator: "VibeCode Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "VibeCode Academy",
    title: "VibeCode Academy — Learn to Build with AI",
    description:
      "60+ lessons on AI, Vibe Coding and prompt engineering. Start for free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeCode Academy",
    description: "Learn to build with AI",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#84cc16",
  colorScheme: "dark light",
};

// ============================================
// ROOT LAYOUT
// ============================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      {/* Anti-flash: читаем тему из localStorage до гидратации React */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('vibecode-theme');var t=s?JSON.parse(s).state?.theme:'dark';document.documentElement.classList.remove('dark','light');document.documentElement.classList.add(t||'dark');}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="font-inter antialiased">
        <AuthSessionProvider>
          <ThemeProvider>
            <StoreHydration />
            <SplashScreen />
            {children}
            <ToastContainer />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
