"use client";

import { useState, useEffect } from "react";
import { Button, Snackbar, Alert, styled } from "@mui/material";
import { GetApp, Close } from "@mui/icons-material";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // beforeinstallprompt 이벤트 리스너 등록
    const handleBeforeInstallPrompt = (e: Event) => {
      // 기본 동작 방지
      e.preventDefault();
      // 이벤트 저장
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // 설치 가능 상태로 변경
      setIsInstallable(true);
      // 설치 배너 표시
      setShowInstallBanner(true);
    };

    // 앱이 이미 설치되었는지 확인
    const handleAppInstalled = () => {
      // 설치 배너 숨기기
      setShowInstallBanner(false);
      setIsInstallable(false);
      // 로컬 스토리지에 설치 상태 저장
      localStorage.setItem("pwaInstalled", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 이미 설치되었는지 확인
    const isAlreadyInstalled = localStorage.getItem("pwaInstalled") === "true";
    if (isAlreadyInstalled) {
      setIsInstallable(false);
    } else {
      // 설치 여부 확인 (iOS Safari 등 standalone 모드 확인)
      const isInStandaloneMode =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
      if (isInStandaloneMode) {
        localStorage.setItem("pwaInstalled", "true");
        setIsInstallable(false);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // 설치 프롬프트 표시
    await installPrompt.prompt();

    // 사용자 선택 결과 확인
    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("사용자가 앱 설치를 수락했습니다");
    } else {
      console.log("사용자가 앱 설치를 거부했습니다");
    }

    // 프롬프트 초기화
    setInstallPrompt(null);
  };

  const handleCloseBanner = () => {
    setShowInstallBanner(false);
    // 24시간 동안 배너 숨기기
    localStorage.setItem("pwaInstallBannerClosed", Date.now().toString());
  };

  // 설치 가능한 상태가 아니면 아무것도 렌더링하지 않음
  if (!isInstallable) return null;

  return (
    <>
      {/* 고정 설치 버튼 */}
      <InstallButton variant="contained" color="primary" startIcon={<GetApp />} onClick={handleInstallClick}>
        앱 설치하기
      </InstallButton>

      {/* 설치 안내 배너 */}
      <Snackbar
        open={showInstallBanner}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={10 * 1000}
        onClose={handleCloseBanner}
      >
        <Alert
          severity="info"
          action={
            <>
              <Button color="primary" size="small" onClick={handleInstallClick}>
                설치
              </Button>
              <Button color="inherit" size="small" onClick={handleCloseBanner}>
                <Close fontSize="small" />
              </Button>
            </>
          }
        >
          📱 연애재판 앱 설치하기
        </Alert>
      </Snackbar>
    </>
  );
};

export default InstallPWA;

const InstallButton = styled(Button)`
  position: fixed;
  bottom: 60px;
  right: 8px;
  z-index: 1000;
  border-radius: 28px;
  padding: 8px 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;
