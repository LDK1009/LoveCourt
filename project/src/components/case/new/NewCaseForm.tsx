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

// 단계 제목 배열
const steps = ["갈등 상황 설명", "추가 정보 입력", "검토 및 제출"];

const NewCaseForm = () => {
  const router = useRouter(); // 라우터 인스턴스
  const [activeStep, setActiveStep] = useState(0); // 현재 활성화된 단계
  const [caseData, setCaseData] = useState({
    title: "", // 제목
    description: "", // 설명
    person_a: "", // 당사자 A
    person_b: "", // 당사자 B
    relationship: "연인", // 관계 (기본값: 연인)
    duration: "", // 관계 지속 기간
    category: "", // 카테고리
    tags: [] as string[], // 태그 배열
  });
  const [currentTag, setCurrentTag] = useState(""); // 현재 입력 중인 태그

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    // API 호출하여 케이스 생성
    const response = await createCase(caseData);
    router.push(`/case/${response?.data?.id}`); // 생성된 케이스 페이지로 이동
  };

  return (
    <Container maxWidth="md">
      <FormPaper>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          갈등 상황 입력
        </Typography>

        {/* 단계 표시기 */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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

        {/* 세 번째 단계: 검토 및 제출 */}
        {activeStep === 2 && <ReviewSubmitStep caseData={caseData} />}

        {/* 이전/다음/제출 버튼 */}
        <ButtonContainer>
          {activeStep > 0 && <Button onClick={handleBack}>이전</Button>}

          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              다음
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>
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
