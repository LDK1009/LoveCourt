"use client";

import { SnackbarProvider } from "notistack";

const ClientSnackbarProvider = () => {
  return (
    <>
      <SnackbarProvider
        maxSnack={3} // 최대 누적 스택
        autoHideDuration={1000} // 지속시간
        // anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // 스낵바 위치 지정
        // preventDuplicate={true} // 중복 메시지 표시 여부
        // hideIconVariant = {false} // 아이콘 숨김 여부
        // transitionDuration={{enter:300, exit:3000}} // 애니메이션 시간 변경 (ms)
      />
    </>
  );
};

export default ClientSnackbarProvider;
