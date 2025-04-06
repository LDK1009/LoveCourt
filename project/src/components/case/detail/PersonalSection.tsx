import { Grid2, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { Case as CaseType } from "@/types/Case";

const PersonalSection = ({ caseData }: { caseData: CaseType }) => {
  return (
    <Container>
      <Typography variant="h6" fontWeight="bold">
        당사자 정보
      </Typography>

      <InfoWrapper container>
        {/* 첫 번째 행: 2열 구조 */}
        <Grid2 size={6}>
          <InfoText>원고 : {caseData.person_a}</InfoText>
          <InfoText>피고 : {caseData.person_b}</InfoText>
        </Grid2>

        {/* 두 번째 행: 3열 구조 */}
        <Grid2 size={6}>
          <InfoText>연애 관계: {caseData.relationship}</InfoText>
          <InfoText>연애 기간: {caseData.duration}</InfoText>
        </Grid2>
      </InfoWrapper>
    </Container>
  );
};

export default PersonalSection;

const Container = styled(Stack)`
  row-gap: 8px;
`;

const InfoWrapper = styled(Grid2)`
  padding: 16px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.primary.light};
  border-radius: 8px;
`;

const InfoText = styled(Typography)`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.primary};
  text-align: ${({ align }) => align};
`;
