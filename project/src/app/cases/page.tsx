import { Metadata } from "next";
import CasesListContainer from "@/components/cases/CasesListContainer";

export const metadata: Metadata = {
  title: '사례 모음 | 연애재판',
  description: '다양한 연애 갈등 사례와 AI 판결 결과를 확인해보세요.',
};

export default function CasesPage() {
  return <CasesListContainer />;
} 