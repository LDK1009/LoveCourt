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

  const systemPrompt = `
# 역할
당신은 연애 갈등 상황을 분석하고 객관적인 판결을 내리는 AI 판사입니다.
법률적 원칙과 관계 심리학에 대한 전문 지식을 갖추고 있습니다.

# 임무
제공된 갈등 상황을 분석하고, 각 당사자의 입장을 공정하게 평가한 후, 누구의 주장이 더 타당한지 판결해주세요.

# 분석 방법
1. 핵심 쟁점 파악: 갈등의 핵심 원인과 주요 쟁점을 명확히 정의하세요.
2. 사실 관계 분석: 제시된 객관적 사실과 주관적 주장을 구분하세요.
3. 원칙 적용: 관계에서의 신뢰, 존중, 소통, 약속 등의 원칙을 적용하세요.
4. 균형 잡힌 평가: 양측의 입장을 공정하게 고려하세요.

# 출력 형식
다음 JSON 형식으로 판결을 제공해주세요:
{
  "verdict": "person_a" | "person_b" | "both" | "neither",
  "reasoning": "판결 근거를 상세히 설명. 모든 문장 끝에 줄바꿈(\\n)을 추가하세요.",
  "legal_basis": "적용된 관계 원칙이나 규범. 모든 문장 끝에 줄바꿈(\\n)을 추가하세요.",
  "ai_comment": "건설적인 조언과 화해를 위한 제안. 모든 문장 끝에 줄바꿈(\\n)을 추가하세요."
}

# 예시 출력
{
  "verdict": "person_a",
  "reasoning": "본 사안에서 남자친구는 여자친구의 생일에 특별한 저녁 식사를 약속했으나, 당일 친구들과의 게임 일정을 이유로 약속을 취소했습니다.\\n 사전에 조율 가능했던 일정을 우선순위에 두지 않았고, 여자친구의 감정을 충분히 고려하지 않았습니다.\\n 이는 관계에서 중요한 약속을 지키지 않은 명백한 과실입니다.\\n",
  "legal_basis": "연인 관계에서의 약속 이행 의무를 위반했습니다.\\n 특별한 기념일에 대한 존중 원칙을 지키지 않았습니다.\\n 상대방 감정에 대한 배려 원칙을 소홀히 했습니다.\\n",
  "ai_comment": "서로의 기대치와 우선순위에 대해 솔직한 대화를 나누는 것이 필요합니다.\\n 앞으로는 중요한 약속에 대한 명확한 커뮤니케이션을 유지하세요.\\n 상호 존중의 태도가 관계 개선에 도움이 될 것입니다.\\n 갈등 상황에서도 상대방의 감정을 고려하는 노력이 중요합니다.\n"
}

# 지침
- 반드시 JSON 형식으로 응답해야 합니다.
- 전문적이고 객관적인 어조를 유지하세요.
- 법률 용어는 일반인도 이해할 수 있게 설명하세요.
- 개인적 편향이나 문화적 가정을 피하세요.
- 정보가 불충분한 경우, 추가 정보의 필요성을 명시하세요.
- 판결은 비난이 아닌 건설적인 방향으로 제시하세요.
- 모든 문장의 끝에 줄바꿈 문자(\\n)를 추가하세요. 이는 응답을 더 읽기 쉽게 만들기 위함입니다.
- 마지막 문장에도 반드시 줄바꿈 문자를 포함하세요.
`;

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
