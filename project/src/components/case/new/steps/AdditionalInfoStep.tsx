import {
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  styled,
} from "@mui/material";
import { RefObject } from 'react';

interface AdditionalInfoStepProps {
  caseData: {
    person_a: string;
    person_b: string;
    relationship: string;
    duration: string;
    category: string;
    tags: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  currentTag: string;
  setCurrentTag: (tag: string) => void;
  handleAddTag: () => void;
  handleDeleteTag: (tag: string) => void;
  personAInputRef: RefObject<HTMLInputElement | null>;
}

const AdditionalInfoStep = ({
  caseData,
  handleChange,
  currentTag,
  setCurrentTag,
  handleAddTag,
  handleDeleteTag,
  personAInputRef
}: AdditionalInfoStepProps) => {
  return (
    <FormSection>
      <Grid>
        <TextField
          fullWidth
          label="원고(고소인)"
          name="person_a"
          value={caseData.person_a}
          onChange={handleChange}
          placeholder="ex) 여자친구"
          margin="normal"
          required
          inputRef={personAInputRef}
        />
        <TextField
          fullWidth
          label="피고(피고소인)"
          name="person_b"
          onChange={handleChange}
          placeholder="ex) 남자친구"
          margin="normal"
          required
        />
      </Grid>

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">연애 관계</FormLabel>
        <RadioGroup row name="relationship" value={caseData.relationship} onChange={handleChange}>
          <FormControlLabel value="연인" control={<Radio />} label="연인" />
          <FormControlLabel value="부부" control={<Radio />} label="부부" />
          <FormControlLabel value="썸" control={<Radio />} label="썸" />
          <FormControlLabel value="기타" control={<Radio />} label="기타" />
        </RadioGroup>
      </FormControl>

      <TextField
        fullWidth
        label="연애 기간"
        name="duration"
        value={caseData.duration}
        onChange={handleChange}
        placeholder="예: 1년 2개월"
        margin="normal"
      />

      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend">카테고리</FormLabel>
        <RadioGroup row name="category" value={caseData.category} onChange={handleChange}>
          <FormControlLabel value="데이트" control={<Radio />} label="데이트" />
          <FormControlLabel value="금전" control={<Radio />} label="금전" />
          <FormControlLabel value="선물" control={<Radio />} label="선물" />
          <FormControlLabel value="의사소통" control={<Radio />} label="의사소통" />
          <FormControlLabel value="기타" control={<Radio />} label="기타" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <FormLabel component="legend" sx={{ mb: 1 }}>
          태그
        </FormLabel>
        <TagInputContainer>
          <TextField
            label="태그 추가"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="태그를 입력하고 추가 버튼을 누르세요"
            size="small"
            fullWidth
          />
          <Button variant="outlined" onClick={handleAddTag} disabled={!currentTag}>
            추가
          </Button>
        </TagInputContainer>
        <TagsContainer>
          {caseData.tags.map((tag) => (
            <Chip key={tag} label={tag} onDelete={() => handleDeleteTag(tag)} color="primary" variant="outlined" />
          ))}
        </TagsContainer>
      </Box>
    </FormSection>
  );
};

export default AdditionalInfoStep;

const FormSection = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
`;

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TagInputContainer = styled(Box)`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const TagsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
