import { css } from '@emotion/react';

// 믹스인 정의
// Q&A. 믹스인(Mixin)이란 재사용 가능한 스타일 조각을 정의하여 여러 컴포넌트에서 공유하는 방식을 의미합니다.
// 전체 검색(ctrl + shift + F)에 mixinFlex를 검색해 믹스인 활용 예시를 찾아보세요.
export const mixinFlex = (direction : "row" | "column") => css`
  display: flex;
  flex-direction: ${direction};
  align-items: center;
  justify-content: center;
  width: 100%;
`;