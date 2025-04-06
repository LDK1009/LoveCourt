"use client";

import { Box, FormControl, InputLabel, Select, MenuItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import {
  EmojiFoodBeverageRounded,
  LocalFireDepartmentRounded,
  WhatshotRounded,
  GavelRounded,
  ElderlyWomanRounded,
  AccountBalanceRounded,
  MusicNoteRounded,
  SchoolRounded,
  ChildCareRounded,
} from "@mui/icons-material";

// 강도 옵션
const intensityOptions = [
  { value: "low", label: "순한맛", icon: <EmojiFoodBeverageRounded /> },
  { value: "medium", label: "중간맛", icon: <LocalFireDepartmentRounded /> },
  { value: "high", label: "매운맛", icon: <WhatshotRounded /> },
];

// 캐릭터 옵션
const characterOptions = [
  { value: "judge", label: "판사", icon: <GavelRounded /> },
  { value: "grandma", label: "할머니", icon: <ElderlyWomanRounded /> },
  { value: "governor", label: "사또", icon: <AccountBalanceRounded /> },
  { value: "rapper", label: "래퍼", icon: <MusicNoteRounded /> },
  { value: "teacher", label: "선생님", icon: <SchoolRounded /> },
  { value: "kid", label: "잼민이", icon: <ChildCareRounded /> },
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

    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 3, "& svg": { color: "primary.main" } }}>
      {/* 답변 강도 */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>답변 강도</InputLabel>
        <Select name="intensity" value={caseData.intensity} label="답변 강도" onChange={handleChange}>
          {intensityOptions.map((option) => (
            <MenuItem key={option.value} value={option.value} sx={{ "& svg": { color: "primary.main" } }}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 캐릭터 */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>캐릭터</InputLabel>
        <Select name="character" value={caseData.character} label="캐릭터" onChange={handleChange}>
          {characterOptions.map((option) => (
            <MenuItem key={option.value} value={option.value} sx={{ "& svg": { color: "primary.main" } }}>
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
