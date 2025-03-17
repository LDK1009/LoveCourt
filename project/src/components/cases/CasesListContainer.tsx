"use client";

import CasesListBox from "./CasesListBox";

import { Suspense } from "react";

const CasesListContainer = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CasesListBox />
    </Suspense>
  );
};

export default CasesListContainer;
