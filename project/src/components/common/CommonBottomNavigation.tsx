"use client";

import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Paper, styled } from "@mui/material";
import { ArticleOutlined, CottageOutlined, PersonOutlineOutlined, AddCircleOutline } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CommonBottomNavigation() {
  const pathname = usePathname();

  return (
    <Container elevation={3}>
      <StyledBottomNavigation value={pathname}>
        <BottomNavigationAction component={Link} href="/" label="홈" value="/" icon={<CottageOutlined />} />
        <BottomNavigationAction
          component={Link}
          href="/cases"
          label="사례 모음"
          value="/cases"
          icon={<ArticleOutlined />}
        />
        <BottomNavigationAction
          component={Link}
          href="/case/new"
          label="새 사례"
          value="/case/new"
          icon={<AddCircleOutline />}
        />
        <BottomNavigationAction
          component={Link}
          href="/my-page"
          label="마이페이지"
          value="/my-page"
          icon={<PersonOutlineOutlined />}
        />
      </StyledBottomNavigation>
    </Container>
  );
}

const Container = styled(Paper)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  width: 100%;
`;

const StyledBottomNavigation = styled(BottomNavigation)`
  height: 56px;
`;
