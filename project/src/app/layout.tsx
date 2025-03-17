import ThemeProviderWrapper from "@/styles/ThemeProviderWrapper";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CommonBottomNavigation from "@/components/common/CommonBottomNavigation";
import ClientSnackbarProvider from "@/lib/ClientSnackbarProvider";
import Header from "@/components/common/Header";

// SEO 메타데이터
export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "연애재판 - AI 기반 연애 논쟁 판결 서비스",
  description: "AI를 활용한 연애 관련 논쟁 판별 및 법률 기반 객관적 판단을 제공하는 서비스",
  keywords: "연애재판, 연애 갈등, 커플 논쟁, AI 판결, 법률 기반 판단",
  openGraph: {
    title: "연애재판 - AI 기반 연애 논쟁 판결 서비스",
    description: "AI를 활용한 연애 관련 논쟁 판별 및 법률 기반 객관적 판단을 제공하는 서비스",
    url: "https://lovecourt.vercel.app",
    images: [
      {
        url: "https://lovecourt.vercel.app/img/og.png",
        width: 1200,
        height: 630,
        alt: "LoveCourt-logo",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/img/logo-192.png",
    apple: "/img/logo-512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <AppRouterCacheProvider>
          {/* MUI 테마 프로바이더 */}
          <ThemeProviderWrapper>
            <ClientSnackbarProvider />
            <Header />
            <main
              style={{
                paddingTop: "64px",
                paddingBottom: "72px",
                minHeight: "100vh",
                width: "100%",
                maxWidth: "100vw",
                overflowX: "hidden",
                boxSizing: "border-box",
              }}
            >
              {children}
            </main>
            <CommonBottomNavigation />
          </ThemeProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
