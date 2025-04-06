"use client"; // 클라이언트 컴포넌트 선언

import { useState } from "react";
import { Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography, styled } from "@mui/material"; // Material UI 컴포넌트 임포트
import { useRouter } from "next/navigation"; // Next.js 라우터 훅
import { enqueueSnackbar } from "notistack"; // 알림 표시 라이브러리
import { createCase } from "@/service/cases"; // 케이스 생성 API 함수
// import { useAuthStore } from "@/store"; // 인증 상태 관리 스토어
import ConflictDescriptionStep from "./steps/ConflictDescriptionStep"; // 단계별 컴포넌트 임포트
import AdditionalInfoStep from "./steps/AdditionalInfoStep";
import ReviewSubmitStep from "./steps/ReviewSubmitStep";
import IntensityCharacterSelectionStep from "./steps/IntensityCharacterSelectionStep";

// 단계 제목 배열
const steps = ["상황", "관계", "옵션", "제출"];

const NewCaseForm = () => {
  // 라우터
  const router = useRouter();
  // 활성화된 단계
  const [activeStep, setActiveStep] = useState(0);
  // 케이스 데이터
  const [caseData, setCaseData] = useState({
    title: "", // 제목
    description: "", // 설명
    person_a: "", // 당사자 A
    person_b: "", // 당사자 B
    relationship: "연인", // 관계 (기본값: 연인)
    duration: "", // 관계 지속 기간
    category: "", // 카테고리
    tags: [] as string[], // 태그 배열
    intensity: "medium", // 답변 강도 (기본값: 중간맛)
    character: "judge", // 캐릭터 (기본값: 판사)
  });
  // 현재 입력 중인 태그
  const [currentTag, setCurrentTag] = useState("");
  // 제출 버튼 비활성화 여부
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  // 다음 단계로 이동하는 함수
  const handleNext = () => {
    // 첫 번째 단계에서 필수 입력값 검증
    if (activeStep === 0 && (!caseData.title || !caseData.description)) {
      enqueueSnackbar("제목과 갈등 상황을 입력해주세요.", { variant: "error" });
      return;
    }

    // 두 번째 단계에서 필수 입력값 검증
    if (activeStep === 1 && (!caseData.person_a || !caseData.person_b)) {
      enqueueSnackbar("당사자 정보를 입력해주세요.", { variant: "error" });
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // 이전 단계로 이동하는 함수
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // 입력 필드 변경 처리 함수
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setCaseData({
      ...caseData,
      [name]: value,
    });
  };

  // 태그 추가 함수
  const handleAddTag = () => {
    if (currentTag && !caseData.tags.includes(currentTag)) {
      setCaseData({
        ...caseData,
        tags: [...caseData.tags, currentTag],
      });
      setCurrentTag("");
    }
  };

  // 태그 삭제 함수
  const handleDeleteTag = (tagToDelete: string) => {
    setCaseData({
      ...caseData,
      tags: caseData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  // 케이스 제출 함수
  const handleSubmit = async () => {
    setIsSubmitDisabled(true);

    // API 호출하여 케이스 생성
    const response = await createCase(caseData);

    // 케이스 생성 성공 시
    if (response?.data) {
      router.push(`/case/${response?.data?.id}`); // 생성된 케이스 페이지로 이동
    }
    // 케이스 생성 실패 시
    else {
      setIsSubmitDisabled(false);
    }
  };

  return (
    <Container maxWidth="md">
      <FormPaper>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          재판 청구서
        </Typography>

        {/* 단계 표시기 - 상하 배치 스타일 */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="body1" align="center" fontWeight={activeStep === index ? "bold" : "normal"}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* 첫 번째 단계: 갈등 상황 설명 */}
        {activeStep === 0 && <ConflictDescriptionStep caseData={caseData} handleChange={handleChange} />}

        {/* 두 번째 단계: 추가 정보 입력 */}
        {activeStep === 1 && (
          <AdditionalInfoStep
            caseData={caseData}
            handleChange={handleChange}
            currentTag={currentTag}
            setCurrentTag={setCurrentTag}
            handleAddTag={handleAddTag}
            handleDeleteTag={handleDeleteTag}
          />
        )}

        {/* 세 번째 단계: 판결 설정 */}
        {activeStep === 2 && <IntensityCharacterSelectionStep caseData={caseData} handleChange={handleChange} />}

        {/* 네 번째 단계: 검토 및 제출 */}
        {activeStep === 3 && (
          <ReviewSubmitStep
            caseData={{
              ...caseData,
              intensity: caseData.intensity as "low" | "medium" | "high",
              character: caseData.character as "judge" | "grandma" | "governor" | "rapper" | "teacher" | "kid",
            }}
          />
        )}

        {/* 이전/다음/제출 버튼 */}
        <ButtonContainer>
          {activeStep > 0 ? (
            <Button onClick={handleBack}>이전</Button>
          ) : (
            <Button onClick={handleBack} disabled></Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} sx={{ justifySelf: "end" }}>
              다음
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit} disabled={isSubmitDisabled}>
              제출하기
            </Button>
          )}
        </ButtonContainer>
      </FormPaper>
    </Container>
  );
};

export default NewCaseForm;

// 스타일링된 Paper 컴포넌트
const FormPaper = styled(Paper)`
  padding: 32px;
  margin: 24px 0;
`;

// 버튼 컨테이너 스타일링
const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 32px;
`;
