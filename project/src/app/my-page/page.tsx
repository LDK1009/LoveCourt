import { Metadata } from "next";
import MyPageContainer from "@/components/my-page/MyPageContainer";

export const metadata: Metadata = {
  title: '마이페이지 | 연애재판',
  description: '내 사례와 북마크를 관리하세요.',
};

export default function MyPage() {
  return <MyPageContainer />;
}
