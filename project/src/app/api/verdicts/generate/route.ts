import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import OpenAI from "openai";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST 요청 핸들러 함수
 * 클라이언트로부터 case_id를 받아 AI 판결을 생성하는 API 엔드포인트
 */
export async function POST(request: NextRequest) {
  // 요청 본문에서 JSON 데이터 파싱
  const body = await request.json();
  const { case_id } = body;

  // case_id가 없는 경우 에러 응답 반환
  if (!case_id) {
    return NextResponse.json(
      { data: null, error: "case_id error.", message: "case_id가 필요합니다." },
      { status: 400 }
    );
  }

  // Supabase에서 케이스 정보 조회
  const caseResponse = await supabase.from("cases").select("*").eq("id", case_id).single();

  // 케이스를 찾지 못한 경우 에러 응답 반환
  if (caseResponse.error) {
    return NextResponse.json(
      { data: null, error: "caseResponse error.", message: "케이스를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 조회된 케이스 데이터 저장
  const caseData = caseResponse.data;

  // AI 판결을 위한 프롬프트 구성
  const userPrompt = `
## 사례 제목
${caseData.title}

## 갈등 상황 설명
${caseData.description}

## 당사자 정보
- 원고(고소인): ${caseData.person_a}
- 피고(피고소인): ${caseData.person_b}
- 연애 관계: ${caseData.relationship}
- 연애 기간: ${caseData.duration}
- 카테고리: ${caseData.category}
`;

  const systemPrompt = `당신은 연애 갈등 상황을 분석하고 객관적인 판결을 내리는 AI 판사입니다.
제공된 갈등 상황을 분석하고 누구의 입장이 더 타당한지 판결해주세요.

다음 형식으로 판결을 내려주세요:
{
  "verdict": "person_a" | "person_b" | "both" | "neither",
  "reasoning": "판결 근거를 상세히 설명",
  "legal_basis": "관련된 법률이나 원칙을 언급",
  "ai_comment": "AI 코멘트(당사자들에게 도움이 될 만한 조언을 제공)"
}

반드시 JSON 형식으로 응답해야 합니다.`;

  // OpenAI API를 호출하여 AI 판결 생성
  const completion = await openai.chat.completions.create({
    model: "gpt-4o", // 사용할 AI 모델 지정
    messages: [
      // 시스템 메시지로 AI의 역할과 응답 형식 정의
      { role: "system", content: systemPrompt },
      // 사용자 메시지로 케이스 정보 전달
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7, // 응답의 창의성 조절 (0: 결정적, 1: 창의적)
    response_format: { type: "json_object" }, // JSON 형식 응답 강제
  });

  // AI 응답 추출
  const aiResponse = completion.choices[0].message.content;

  // AI 응답이 없는 경우 에러 응답 반환
  if (!aiResponse) {
    return NextResponse.json(
      { data: null, error: "aiResponse error.", message: "AI 응답을 받지 못했습니다." },
      { status: 500 }
    );
  } else {
    // 성공적인 응답 반환
    return NextResponse.json(
      {
        data: aiResponse,
        error: null,
        message: "판결이 성공적으로 생성되었습니다.",
      },
      { status: 200 }
    );
  }
}
