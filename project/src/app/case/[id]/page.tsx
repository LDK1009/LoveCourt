import { Metadata } from "next";
import CaseDetailContainer from "@/components/case/detail/CaseDetailContainer";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

// ✨ Next.js 15에서는 파라미터를 비동기적으로 처리해야 함
type PropsType = Promise<{ id: string; }>

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

// ✨ 동적 메타데이터 생성 함수 수정
export async function generateMetadata({ params }: { params: PropsType }): Promise<Metadata> {
  const { id } = await params; // ✨ 비동기 파라미터 처리
  const numId = parseInt(id);

  if (!numId || isNaN(numId)) {
    return {
      title: "잘못된 사례 ID | 연애재판",
      description: "AI 기반 연애 논쟁 판결 서비스",
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  const caseData = await getCaseData(numId);

  if (caseData) {
    return {
      title: `${caseData.title} | 연애재판`,
      description: caseData.description.substring(0, 160),
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: `${caseData.title} | 연애재판`,
        description: caseData.description.substring(0, 160),
        url: `/case/${id}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/og.png`,
            width: 1200,
            height: 630,
            alt: "LoveCourt-logo",
          },
        ],
      },
    };
  }

  return {
    title: "사례 상세 | 연애재판",
    description: "AI 기반 연애 논쟁 판결 서비스",
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ✨ 페이지 컴포넌트 수정
export default async function CaseDetailPage({ params }: { params: PropsType }) {
  const { id } = await params; // ✨ 비동기 파라미터 처리
  const numId = parseInt(id);

  if (!numId || isNaN(numId)) {
    notFound();
  }

  const caseData = await getCaseData(numId);

  if (!caseData) {
    notFound();
  }

  return <CaseDetailContainer caseId={numId} />;
}
