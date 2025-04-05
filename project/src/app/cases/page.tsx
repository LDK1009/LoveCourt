import CasesListContainer from "@/components/cases/CasesListContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "연애 판결 사례 모음 | 다른 커플들의 갈등은 어떻게 판결됐을까?",
  description: "다양한 연애 갈등 사례와 AI 판사의 판결 결과를 확인해보세요. 비슷한 상황에서 누구의 잘못인지 객관적인 판단을 참고할 수 있어요.",
  keywords: "연애 판결 사례, 커플 갈등 판결, 연애 분쟁 사례, 연인 싸움 판결, 데이트 갈등 판결, 실제 연애 판결, 연애 법정 사례, 20대 연애 판결",
  openGraph: {
    title: "연애 판결 사례 모음 | 다른 커플들의 갈등은 어떻게 판결됐을까?",
    description: "다양한 연애 갈등 사례와 AI 판사의 판결 결과를 확인해보세요. 비슷한 상황에서 누구의 잘못인지 객관적인 판단을 참고할 수 있어요.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/og.png`,
        width: 1200,
        height: 630,
        alt: "연애재판 | 연애 갈등 판결 사례 모음",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "연애 판결 사례 모음 | 다른 커플들의 갈등은 어떻게 판결됐을까?",
    description: "다양한 연애 갈등 사례와 AI 판사의 판결 결과를 확인해보세요. 비슷한 상황에서 누구의 잘못인지 객관적인 판단을 참고할 수 있어요.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CasesPage() {
  return <CasesListContainer />;
}
