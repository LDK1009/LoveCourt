import { CommonGrayTypography } from "@/styles/CommonComponents";
import { mixinFlex } from "@/styles/mixins";
import { styled, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

interface PropsType {
  datas: MenusType[];
}

type MenusType = {
  category: string;
  menus: MenuType[];
};

type MenuType = {
  title: string;
  icon: ReactNode;
  onClick: () => void;
};

const MenuList = ({ datas }: PropsType) => {
  return (
    <Container>
      {datas.map((el, idx) => {
        return (
          <CategoryContainer key={idx}>
            <CategoryText variant="body1" fontWeight={"bold"}>
              {el.category}
            </CategoryText>
            <MenuItemContainer>
              {el.menus.map((el, idx) => {
                return (
                  <MenuItemWrap key={idx} onClick={el.onClick}>
                    <IconTitleWrap>
                      {el.icon}
                      <MenuTitle variant="body2">{el.title}</MenuTitle>
                    </IconTitleWrap>
                    <ArrowForwardIosOutlinedIcon />
                  </MenuItemWrap>
                );
              })}
            </MenuItemContainer>
          </CategoryContainer>
        );
      })}
    </Container>
  );
};

export default MenuList;

const Container = styled("div")`
  width: 100%;
  ${mixinFlex("column")};
  align-items: start;
  row-gap: 24px;
`;
const CategoryContainer = styled("div")`
  ${mixinFlex("column")};
  align-items: start;
  width: 100%;
  row-gap: 4px;
`;
const CategoryText = styled(CommonGrayTypography)``;

const MenuItemContainer = styled("div")`
  width: 100%;
  ${mixinFlex("column")};
  row-gap: 4px;
`;

const MenuItemWrap = styled("div")`
  ${mixinFlex("row")};
  justify-content: space-between;
  & svg {
    color: ${({ theme }) => theme.palette.primary.main};
    width: 16px;
    height: 16px;
  }
`;

const IconTitleWrap = styled("div")`
  ${mixinFlex("row")};
  width: 100%;
  column-gap: 8px;
  justify-content: start;
  height: 30px;
  & svg {
    width: 24px !important;
    height: 24px !important;
  }
`;

const MenuTitle = styled(Typography)`
  line-height: 100%;
`;
