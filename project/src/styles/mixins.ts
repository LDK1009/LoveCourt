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

export const mixinBoxShadow = (depth: number) => css`
  ${depth === 1 &&
  css`
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
  `}
  ${depth === 2 &&
  css`
    box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.1);
  `}
  ${depth === 3 &&
  css`
    box-shadow: 0 12px 12px 0 rgba(0, 0, 0, 0.1);
  `}
`;
