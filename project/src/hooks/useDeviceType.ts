/**
 * [설명]
 * 디바이스 타입을 확인합니다.
 * 디바이스 타입은 PC | Tablet | Mobile 로 분류됩니다.
 *
 * [사용방법]
 * const { isDesktop, isTablet, isMobile } = useDeviceType();
 */

import useMedia from "use-media";

export function useDeviceType() {
  // 미디어 쿼리
  const isDesktop = useMedia({ minWidth: "1024px" });
  const isTablet = useMedia({ minWidth: "768px", maxWidth: "1023px" });
  const isMobile = useMedia({ maxWidth: "767px" });

  return { isDesktop, isTablet, isMobile };
}
