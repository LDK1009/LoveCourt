"use client";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import GavelIcon from "@mui/icons-material/Gavel";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SchoolIcon from "@mui/icons-material/School";
import ChildCareIcon from "@mui/icons-material/ChildCare";

// 강도 옵션
const intensityOptions = [
  { value: "low", label: "순한맛", icon: <EmojiFoodBeverageIcon /> },
  { value: "medium", label: "중간맛", icon: <LocalFireDepartmentIcon /> },
  { value: "high", label: "매운맛", icon: <WhatshotIcon /> },
];

// 캐릭터 옵션
const characterOptions = [
  { value: "judge", label: "판사", icon: <GavelIcon /> },
  { value: "grandma", label: "할머니", icon: <ElderlyWomanIcon /> },
  { value: "governor", label: "사또", icon: <AccountBalanceIcon /> },
  { value: "rapper", label: "래퍼", icon: <MusicNoteIcon /> },
  { value: "teacher", label: "선생님", icon: <SchoolIcon /> },
  { value: "kid", label: "잼민이", icon: <ChildCareIcon /> },
];

type IntensityCharacterSelectionStepProps = {
  caseData: {
    intensity: string;
    character: string;
  };
  handleChange: (e: { target: { name: string; value: string } }) => void;
};

const IntensityCharacterSelectionStep = ({ caseData, handleChange }: IntensityCharacterSelectionStepProps) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      판결 설정
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
      AI가 판결을 내릴 때의 강도와 캐릭터를 선택해주세요.
    </Typography>

    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 3 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>답변 강도</InputLabel>
        <Select name="intensity" value={caseData.intensity} label="답변 강도" onChange={handleChange}>
          {intensityOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>캐릭터</InputLabel>
        <Select name="character" value={caseData.character} label="캐릭터" onChange={handleChange}>
          {characterOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </Box>
);

export default IntensityCharacterSelectionStep; 