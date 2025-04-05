import { Metadata } from "next";
import NewCaseForm from "@/components/case/new/NewCaseForm";

export const metadata: Metadata = {
  title: "연애 재판 신청하기 | 당신의 연애 갈등, AI 판사가 판결합니다",
  description: "연인과의 갈등 상황을 입력하고 AI 판사의 공정한 판결을 받아보세요. 누구의 잘못인지 객관적인 판단으로 연애 분쟁을 해결합니다.",
  keywords: "연애 재판 신청, 커플 갈등 판결, 연인 분쟁 해결, 연애 판결, 객관적 판단, AI 판사, 연애 법정, 연애 분쟁, 데이트 갈등 판결",
  openGraph: {
    title: "연애 재판 신청하기 | 당신의 연애 갈등, AI 판사가 판결합니다",
    description: "연인과의 갈등 상황을 입력하고 AI 판사의 공정한 판결을 받아보세요. 누구의 잘못인지 객관적인 판단으로 연애 분쟁을 해결합니다.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/og.png`,
        width: 1200,
        height: 630,
        alt: "연애재판 | 연애 갈등 판결 신청",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "연애 재판 신청하기 | 당신의 연애 갈등, AI 판사가 판결합니다",
    description: "연인과의 갈등 상황을 입력하고 AI 판사의 공정한 판결을 받아보세요. 누구의 잘못인지 객관적인 판단으로 연애 분쟁을 해결합니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NewCasePage() {
  return <NewCaseForm />;
} 