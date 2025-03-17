"use client";

import { mixinFlex } from "@/styles/mixins";
import { styled, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";
import { CottageOutlined } from "@mui/icons-material";
import { CommonButton } from "@/styles/CommonComponents";
import { getCurrentUser } from "@/service/auth";
import { enqueueSnackbar } from "notistack";
import { useAuthStore } from "@/store";

const SignInSuccessContainer = () => {
  // Store
  const { setUser } = useAuthStore();

  // useEffect
  useEffect(() => {
    async function getUserInfo() {
      const { data, error } = await getCurrentUser();
      if (!error) {
        const userData = { ...data, isSignIn: true };
        setUser(userData);
      } else {
        enqueueSnackbar("유저 정보 가져오기 오류 발생", { variant: "error" });
      }
    }
    getUserInfo();
  }, [setUser]);

  return (
    <Container>
      <TextWrap>
        <HeadingText variant="h5" fontWeight={"bold"}>
          로그인 완료!
        </HeadingText>
        <BodyText variant="body2" align="center">
          연애재판의 다양한 서비스를 이용해보세요
        </BodyText>
      </TextWrap>

      <Img src={"/img/logo-512.png"} alt="" width={200} height={200} />
      <ButtonWrap>
        <HomeButton href="/" variant="contained" startIcon={<CottageOutlined />}>
          홈으로
        </HomeButton>
      </ButtonWrap>
    </Container>
  );
};

export default SignInSuccessContainer;

const Container = styled("div")`
  ${mixinFlex("column")};
  justify-content: space-evenly;
  width: 100%;
  height: 100vh;
  padding: 24px;
`;

const TextWrap = styled("div")`
  ${mixinFlex("column")};
  row-gap: 8px;
`;

const HeadingText = styled(Typography)`
  color: ${({ theme }) => theme.palette.gray[900]};
`;

const BodyText = styled(Typography)`
  color: ${({ theme }) => theme.palette.gray[400]};
`;

const Img = styled(Image)`
  border-radius: 8px;
  /* border: 1px solid black; */
`;

const ButtonWrap = styled("div")`
  ${mixinFlex("column")};
  row-gap: 8px;
  width: 100%;
`;

const HomeButton = styled(CommonButton)``;
