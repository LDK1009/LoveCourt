import { Box, Typography, Chip, styled } from "@mui/material";

const FormSection = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
`;

const ReviewItem = styled(Box)`
  margin-bottom: 16px;
`;

interface ReviewSubmitStepProps {
  caseData: {
    title: string;
    description: string;
    person_a: string;
    person_b: string;
    relationship: string;
    duration: string;
    category: string;
    tags: string[];
  };
}

const ReviewSubmitStep = ({ caseData }: ReviewSubmitStepProps) => {
  return (
    <FormSection>
      <Typography variant="h6" gutterBottom>
        입력 정보 확인
      </Typography>
      
      <ReviewItem>
        <Typography variant="subtitle1" fontWeight="bold">제목:</Typography>
        <Typography variant="body1">{caseData.title}</Typography>
      </ReviewItem>
      
      <ReviewItem>
        <Typography variant="subtitle1" fontWeight="bold">갈등 상황:</Typography>
        <Typography variant="body1">{caseData.description}</Typography>
      </ReviewItem>
      
      <ReviewItem>
        <Typography variant="subtitle1" fontWeight="bold">당사자:</Typography>
        <Typography variant="body1">{caseData.person_a} vs {caseData.person_b}</Typography>
      </ReviewItem>
      
      <ReviewItem>
        <Typography variant="subtitle1" fontWeight="bold">관계:</Typography>
        <Typography variant="body1">{caseData.relationship} ({caseData.duration})</Typography>
      </ReviewItem>
      
      {caseData.category && (
        <ReviewItem>
          <Typography variant="subtitle1" fontWeight="bold">카테고리:</Typography>
          <Typography variant="body1">{caseData.category}</Typography>
        </ReviewItem>
      )}
      
      {caseData.tags.length > 0 && (
        <ReviewItem>
          <Typography variant="subtitle1" fontWeight="bold">태그:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {caseData.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        </ReviewItem>
      )}
      
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        제출 후에는 AI가 갈등 상황을 분석하여 객관적인 판단을 제공합니다.
      </Typography>
    </FormSection>
  );
};

export default ReviewSubmitStep; 