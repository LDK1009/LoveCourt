import { Metadata } from "next";
import CaseDetailContainer from "@/components/case/detail/CaseDetailContainer";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

interface CaseDetailPageProps {
  params: {
    id: string;
  };
}

async function getCaseData(id: number) {
  try {
    const { data, error } = await supabase.from("cases").select("title, description").eq("id", id).single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("사례 데이터 가져오기 오류:", error);
    return null;
  }
}

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const id = params.id ? parseInt(params.id) : null;

  if (!id || isNaN(id)) {
    return {
      title: "잘못된 사례 ID | 연애재판",
      description: "AI 기반 연애 논쟁 판결 서비스",
    };
  }

  const caseData = await getCaseData(id);

  if (caseData) {
    return {
      title: `${caseData.title} | 연애재판`,
      description: caseData.description.substring(0, 160),
    };
  }

  return {
    title: "사례 상세 | 연애재판",
    description: "AI 기반 연애 논쟁 판결 서비스",
  };
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const id = params.id ? parseInt(params.id) : null;

  if (!id || isNaN(id)) {
    notFound();
  }

  const caseData = await getCaseData(id);

  if (!caseData) {
    notFound();
  }

  return <CaseDetailContainer caseId={id} />;
}
