"use client";

import { useState, useEffect } from "react";
import { Button, Snackbar, Alert, styled } from "@mui/material";
import { GetApp, Close } from "@mui/icons-material";

/**
 * PWA 설치 프롬프트 이벤트 인터페이스
 * 브라우저 표준이 아니므로 직접 타입 정의가 필요함
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * PWA 설치 버튼 컴포넌트
 * 사용자가 PWA를 설치할 수 있도록 UI를 제공함
 */
const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    /**
     * beforeinstallprompt 이벤트 핸들러
     * PWA 설치 조건이 충족되면 브라우저가 이 이벤트를 발생시킴
     */
    const handleBeforeInstallPrompt = (e: Event) => {
      // 기본 동작 방지 (브라우저 기본 설치 UI 표시 방지)
      e.preventDefault();
      
      // 이벤트 객체 저장 (나중에 사용자가 설치 버튼 클릭 시 사용)
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // 설치 가능 상태로 변경 (버튼 표시 활성화)
      setIsInstallable(true);
      
      // 설치 안내 배너 표시
      setShowInstallBanner(true);
    };

    /**
     * appinstalled 이벤트 핸들러
     * PWA가 성공적으로 설치되면 발생하는 이벤트 처리
     */
    const handleAppInstalled = () => {
      // 설치 배너 숨기기
      setShowInstallBanner(false);
      setIsInstallable(false);
      
      // 로컬 스토리지에 설치 상태 저장 (다음 방문 시 확인용)
      localStorage.setItem("pwaInstalled", "true");
    };

    // 이벤트 리스너 등록
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    /**
     * 앱 설치 상태 확인 로직
     * 1. 로컬 스토리지 확인
     * 2. standalone 모드 확인 (이미 설치된 PWA로 실행 중인지)
     */
    const isAlreadyInstalled = localStorage.getItem("pwaInstalled") === "true";
    if (isAlreadyInstalled) {
      // 이미 설치된 경우 버튼 표시 안함
      setIsInstallable(false);
    } else {
      // standalone 모드 확인 (홈 화면에서 실행 중인지)
      const isInStandaloneMode =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
      
      // matchMedia: 모든 브라우저에서 standalone 모드 확인
      // navigator.standalone: iOS Safari 전용 속성 (타입 단언 필요)
      
      if (isInStandaloneMode) {
        // 이미 standalone 모드로 실행 중이면 설치된 것으로 간주
        localStorage.setItem("pwaInstalled", "true");
        setIsInstallable(false);
      }
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 정리 (메모리 누수 방지)
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  /**
   * 설치 버튼 클릭 핸들러
   * 저장된 설치 프롬프트를 활성화하여 브라우저 설치 UI 표시
   */
  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // 설치 프롬프트 표시 (브라우저 네이티브 UI)
    await installPrompt.prompt();

    // 사용자 선택 결과 확인 (수락 또는 거부)
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === "accepted") {
      console.log("사용자가 앱 설치를 수락했습니다");
      // 설치 수락 시 추가 로직 가능 (예: 분석 이벤트 전송)
    } else {
      console.log("사용자가 앱 설치를 거부했습니다");
      // 설치 거부 시 추가 로직 가능 (예: 나중에 다시 물어보기 설정)
    }

    // 프롬프트 초기화 (한 번만 사용 가능하므로 초기화 필요)
    setInstallPrompt(null);
  };

  /**
   * 배너 닫기 핸들러
   * 사용자가 배너를 닫았을 때 처리
   */
  const handleCloseBanner = () => {
    // 배너 숨기기
    setShowInstallBanner(false);
    
    // 24시간 동안 배너 숨기기 위해 타임스탬프 저장
    // 이 값은 다음 방문 시 확인하여 일정 시간 동안 배너 표시 안 함
    localStorage.setItem("pwaInstallBannerClosed", Date.now().toString());
  };

  // 설치 가능한 상태가 아니면 아무것도 렌더링하지 않음 (UI 깔끔하게 유지)
  if (!isInstallable) return null;

  // 컴포넌트 렌더링
  return (
    <>
      {/* 고정 설치 버튼 (화면 우측 하단에 고정) */}
      <InstallButton variant="contained" color="primary" startIcon={<GetApp />} onClick={handleInstallClick}>
        앱 설치하기
      </InstallButton>

      {/* 설치 안내 배너 (상단에 표시되는 알림) */}
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
              {/* 설치 버튼 */}
              <Button color="primary" size="small" onClick={handleInstallClick}>
                설치
              </Button>
              {/* 닫기 버튼 */}
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

/**
 * 스타일링된 설치 버튼
 * Material-UI의 styled API를 사용하여 버튼 스타일 정의
 */
const InstallButton = styled(Button)`
  position: fixed;
  bottom: 60px;
  right: 8px;
  z-index: 1000;
  border-radius: 28px;
  padding: 8px 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;
