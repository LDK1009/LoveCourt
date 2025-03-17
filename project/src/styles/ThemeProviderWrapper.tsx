"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/styles/theme";
import { CssBaseline } from "@mui/material";

// ThemeProviderWrapper.tsx는 'MUI 테마 프로바이더 파일'입니다.
// ThemeProviderWrapper.tsx는 @/styles/theme에서 정의한 MUI 테마를 프로젝트에 주입합니다. 
const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
    </MuiThemeProvider>
  );
};

export default ThemeProviderWrapper;