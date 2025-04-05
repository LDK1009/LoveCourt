import { Metadata } from "next";
import SignInContainer from "@/components/sign-in/SignInContainer";

export const metadata: Metadata = {
  title: "로그인 | 연애재판에서 나만의 판결 기록 관리하기",
  description: "로그인하고 나만의 연애 재판 기록을 관리하세요. 판결 결과를 저장하고 다른 사용자들의 의견도 확인할 수 있어요.",
  keywords: "연애재판 로그인, 회원가입, 소셜 로그인, 연애 판결 기록, 개인화 서비스, 연애 분쟁 관리",
  openGraph: {
    title: "로그인 | 연애재판에서 나만의 판결 기록 관리하기",
    description: "로그인하고 나만의 연애 재판 기록을 관리하세요. 판결 결과를 저장하고 다른 사용자들의 의견도 확인할 수 있어요.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/og.png`,
        width: 1200,
        height: 630,
        alt: "연애재판 | 로그인 및 회원가입",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "로그인 | 연애재판에서 나만의 판결 기록 관리하기",
    description: "로그인하고 나만의 연애 재판 기록을 관리하세요. 판결 결과를 저장하고 다른 사용자들의 의견도 확인할 수 있어요.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const SignInPage = () => {
  return (
    <div>
      <SignInContainer />
    </div>
  );
};

export default SignInPage;
