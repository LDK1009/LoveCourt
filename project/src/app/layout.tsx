import ThemeProviderWrapper from "@/styles/ThemeProviderWrapper";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CommonBottomNavigation from "@/components/common/CommonBottomNavigation";
import ClientSnackbarProvider from "@/lib/ClientSnackbarProvider";
import Header from "@/components/common/Header";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

// SEO 메타데이터
export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "연애재판 | 연인과의 갈등, AI 판사가 공정하게 판결해드려요",
  description:
    "누구 잘못인지 헷갈리는 연애 갈등, 이제 AI 판사에게 맡겨보세요. 객관적인 판결로 당신의 연애 분쟁을 해결해드립니다.",
  keywords:
    "연애 재판, 커플 갈등 판결, 연애 분쟁, 연인 싸움, 객관적 판단, AI 판사, 연애 판결, 20대 연애, 데이트 갈등, 연애 법정",
  openGraph: {
    title: "연애재판 | 연인과의 갈등, AI 판사가 공정하게 판결해드려요",
    description:
      "누구 잘못인지 헷갈리는 연애 갈등, 이제 AI 판사에게 맡겨보세요. 객관적인 판결로 당신의 연애 분쟁을 해결해드립니다.",
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/og.png`,
        width: 1200,
        height: 630,
        alt: "연애재판 - AI 기반 연애 갈등 판결 서비스",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "연애재판 | 연인과의 갈등, AI 판사가 공정하게 판결해드려요",
    description:
      "누구 잘못인지 헷갈리는 연애 갈등, 이제 AI 판사에게 맡겨보세요. 객관적인 판결로 당신의 연애 분쟁을 해결해드립니다.",
    images: [`${process.env.NEXT_PUBLIC_API_BASE_URL}/img/og.png`],
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4615072495258371"
          crossOrigin="anonymous"
        ></script>
        <Script id="google-conversion-tracking" strategy="afterInteractive">
          {`
            gtag('event', 'conversion', {
              'send_to': 'AW-16921971256/EDJPCJaHr6kaELiUg4U_',
              'value': 1.0,
              'currency': 'KRW'
            });
          `}
        </Script>
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
      <GoogleAnalytics gaId="AW-16921971256" />
    </html>
  );
}
