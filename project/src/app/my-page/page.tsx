import { Metadata } from "next";
import MyPageContainer from "@/components/my-page/MyPageContainer";

export const metadata: Metadata = {
  title: '마이페이지 | 나의 연애 재판 기록과 관심 판결',
  description: '내가 의뢰한 연애 재판과 관심있는 판결 사례를 한눈에 모아보세요. 나만의 연애 분쟁 히스토리를 관리하고 중요한 판결을 저장할 수 있어요.',
  keywords: '마이페이지, 연애 재판 기록, 북마크, 내 판결, 연애 분쟁 기록, 연애 판결 히스토리, 관심 판결, 개인화 서비스',
  openGraph: {
    title: '마이페이지 | 나의 연애 재판 기록과 관심 판결',
    description: '내가 의뢰한 연애 재판과 관심있는 판결 사례를 한눈에 모아보세요. 나만의 연애 분쟁 히스토리를 관리하고 중요한 판결을 저장할 수 있어요.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/og.png`,
        width: 1200,
        height: 630,
        alt: '연애재판 | 나만의 연애 판결 관리',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '마이페이지 | 나의 연애 재판 기록과 관심 판결',
    description: '내가 의뢰한 연애 재판과 관심있는 판결 사례를 한눈에 모아보세요. 나만의 연애 분쟁 히스토리를 관리하고 중요한 판결을 저장할 수 있어요.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MyPage() {
  return <MyPageContainer />;
}
