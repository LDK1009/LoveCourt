"use client";

import { mixinFlex } from "@/styles/mixins";
import { styled, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { signIn } from "@/service/auth";
import { CottageOutlined } from "@mui/icons-material";
import { CommonButton } from "@/styles/CommonComponents";
import { enqueueSnackbar } from "notistack";

const SignInContainer = () => {
  async function handleSignIn() {
    const { error } = await signIn();

    if (error) {
      enqueueSnackbar("로그인 오류 발생", { variant: "error" });
    }
  }

  return (
    <Container>
      <TextWrap>
        <HeadingText variant="h5" fontWeight={"bold"}>
          환영합니다!
        </HeadingText>
        <BodyText variant="body2" align="center">
          카카오 계정으로 간편하게 로그인하고
          <br />
          다양한 서비스를 이용해보세요
        </BodyText>
      </TextWrap>

      <Img src={"/img/logo-512.png"} alt="" width={200} height={200} />
      <ButtonWrap>
        <HomeButton href="/" variant="contained" startIcon={<CottageOutlined />}>
          홈페이지 바로가기
        </HomeButton>
        <KakaoButton
          onClick={handleSignIn}
          variant="contained"
          startIcon={<Image src="/svg/kakao-icon.svg" alt="Logo" width={20} height={20} />}
        >
          카카오로 로그인
        </KakaoButton>
      </ButtonWrap>
    </Container>
  );
};

export default SignInContainer;

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

const KakaoButton = styled(CommonButton)`
  background-color: #fee500;
  color: ${({ theme }) => theme.palette.gray[900]};
`;
