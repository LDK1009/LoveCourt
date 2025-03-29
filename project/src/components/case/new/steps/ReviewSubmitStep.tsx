"use client";

import { Box, Chip, Divider, Typography } from "@mui/material";

// 강도 레이블 매핑
const intensityLabels = {
  low: "순한맛",
  medium: "중간맛",
  high: "매운맛",
};

// 캐릭터 레이블 매핑
const characterLabels = {
  judge: "판사",
  grandma: "할머니",
  governor: "사또",
  rapper: "래퍼",
  teacher: "선생님",
  kid: "잼민이",
};

type ReviewSubmitStepProps = {
  caseData: {
    title: string;
    description: string;
    person_a: string;
    person_b: string;
    relationship: string;
    duration: string;
    category: string;
    tags: string[];
    intensity: "low" | "medium" | "high";
    character: "judge" | "grandma" | "governor" | "rapper" | "teacher" | "kid";
  };
};

const ReviewSubmitStep = ({ caseData }: ReviewSubmitStepProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        입력 내용 확인
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        입력하신 내용을 확인하고 제출해주세요.
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          제목
        </Typography>
        <Typography variant="body1" paragraph>
          {caseData.title}
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold">
          갈등 상황 설명
        </Typography>
        <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-wrap" }}>
          {caseData.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold">
          당사자 정보
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Typography variant="body1">원고(고소인) : {caseData.person_a}</Typography>
          <Typography variant="body1">피고(피고소인) : {caseData.person_b}</Typography>
          <Typography variant="body1">관계 : {caseData.relationship}</Typography>
          <Typography variant="body1">관계 기간 : {caseData.duration}</Typography>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold">
          카테고리
        </Typography>
        <Typography variant="body1" paragraph>
          {caseData.category}
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold">
          태그
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {caseData.tags.length > 0 ? (
            caseData.tags.map((tag) => <Chip key={tag} label={tag} />)
          ) : (
            <Typography variant="body2" color="text.secondary">
              태그가 없습니다.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold">
          판결 설정
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Typography variant="body1">답변 강도 : {intensityLabels[caseData.intensity]}</Typography>
          <Typography variant="body1">캐릭터 : {characterLabels[caseData.character]}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewSubmitStep;
