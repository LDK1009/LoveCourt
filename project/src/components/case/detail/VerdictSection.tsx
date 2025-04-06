import { Stack } from "@mui/material";
import { styled } from "@mui/material";
import { Typography } from "@mui/material";
import { Verdict } from "@/types/Verdict";
import { GavelRounded } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { getVerdictByCaseId } from "@/service/cases";
import { Case as CaseType } from "@/types/Case";
import { mixinBoxShadow } from "@/styles/mixins";

interface PropsType {
  caseId: number;
  caseData: CaseType;
}

const VerdictSection = ({ caseId, caseData }: PropsType) => {
  // 판결 데이터
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  // 판결 조회 (useCallback으로 메모이제이션)
  const getVerdictData = useCallback(async () => {
    const { data, error } = await getVerdictByCaseId(caseId);
    if (error) {
      enqueueSnackbar("AI 판결 조회 실패", { variant: "error" });
      return;
    }
    setVerdict(data);
  }, [caseId]);

  // 판결 조회
  useEffect(() => {
    getVerdictData();
  }, [getVerdictData]);

  return (
    <Container>
      {/* 판결 타이틀 */}
      <TitleWrapper>
        <GavelRounded />
        <Typography variant="h5" fontWeight="bold">
          {verdict?.verdict === "person_a" && `${caseData.person_b} 유죄`}
          {verdict?.verdict === "person_b" && `${caseData.person_a} 유죄`}
          {verdict?.verdict === "both" && `${caseData.person_a} 유죄 | ${caseData.person_b} 유죄`}
          {verdict?.verdict === "neither" && `${caseData.person_a} 무죄 | ${caseData.person_b} 무죄`}
        </Typography>
      </TitleWrapper>
      {/* 판결 텍스트 */}
      <VerdictTextWrapper>
        <SubtitleWrapper>
          <Subtitle variant="body1">판결 근거</Subtitle>
          <VerdictText variant="body2">{verdict?.reasoning}</VerdictText>
        </SubtitleWrapper>

        <SubtitleWrapper>
          <Subtitle variant="body1">법률적 근거</Subtitle>
          <VerdictText variant="body2">{verdict?.legal_basis}</VerdictText>
        </SubtitleWrapper>

        <SubtitleWrapper>
          <Subtitle variant="body1">AI 코멘트</Subtitle>
          <VerdictText variant="body2">{verdict?.ai_comment}</VerdictText>
        </SubtitleWrapper>
      </VerdictTextWrapper>
    </Container>
  );
};

export default VerdictSection;

const Container = styled(Stack)`
  row-gap: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  ${mixinBoxShadow(1)}
  box-shadow: 0px 0px 16px 0px rgba(233, 30, 99, 0.3);
`;

const TitleWrapper = styled(Stack)`
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const VerdictTextWrapper = styled(Stack)`
  row-gap: 16px;
`;

const SubtitleWrapper = styled(Stack)``;

const Subtitle = styled(Typography)`
  font-weight: bold;
`;

const VerdictText = styled(Typography)`
  white-space: pre-line;
`;
