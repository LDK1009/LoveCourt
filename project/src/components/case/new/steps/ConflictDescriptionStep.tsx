import { TextField, Box, styled } from "@mui/material";

const FormSection = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
`;

interface ConflictDescriptionStepProps {
  caseData: {
    title: string;
    description: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ConflictDescriptionStep = ({ caseData, handleChange }: ConflictDescriptionStepProps) => {
  return (
    <FormSection>
      <TextField
        fullWidth
        label="제목"
        name="title"
        value={caseData.title}
        onChange={handleChange}
        placeholder="예: 남자친구가 내 생일을 잊어버렸어요"
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="갈등 상황 설명"
        name="description"
        value={caseData.description}
        onChange={handleChange}
        placeholder="갈등 상황에 대해 자세히 설명해주세요..."
        margin="normal"
        multiline
        rows={6}
        required
      />
    </FormSection>
  );
};

export default ConflictDescriptionStep; 