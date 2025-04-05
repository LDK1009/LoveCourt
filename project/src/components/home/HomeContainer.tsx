"use client";

import { Box, Button, Card, Container, Grid2, Stack, Typography, styled } from "@mui/material";
import {
  GavelRounded,
  SearchRounded,
  ThumbsUpDownRounded,
  ChatRounded,
  ShareRounded,
  PeopleAltRounded,
  ArrowForwardRounded,
  LocalFireDepartmentRounded,
} from "@mui/icons-material";
import { mixinFlex } from "@/styles/mixins";
import Link from "next/link";
import InstallPWA from "@/components/common/InstallPWA";
import { useState, useEffect } from "react";
import CountUp from "react-countup";
import Image from "next/image";
import { getHotCase } from "@/service/cases";
import { Case as CaseType } from "@/types/Case";
import Case from "../cases/Case";

const HomeContainer = () => {
  // 문자 수
  const [visitorCount] = useState(712);
  // 선택된 캐릭터
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  // 핫 케이스
  const [hotCase, setHotCase] = useState<CaseType[] | []>([]);

  const features = [
    {
      icon: <GavelRounded />,
      title: "AI 판결",
      description: "인공지능이 연애 논쟁을 객관적으로 판단합니다.",
    },
    {
      icon: <SearchRounded />,
      title: "유사 사례 검색",
      description: "비슷한 갈등 상황의 판결 결과를 확인할 수 있습니다.",
    },
    {
      icon: <ThumbsUpDownRounded />,
      title: "사용자 투표",
      description: "다른 사용자들의 의견을 확인하고 투표할 수 있습니다.",
    },
    {
      icon: <ChatRounded />,
      title: "AI 코멘트",
      description: "판결에 대한 추가 설명과 조언을 제공합니다.",
    },
    {
      icon: <ShareRounded />,
      title: "SNS 공유",
      description: "판결 결과를 친구들과 공유할 수 있습니다.",
    },
  ];

  const aiCharacters = [
    {
      id: 0,
      name: "정의로운 판사",
      personalities: ["공정", "논리적", "객관적"],
      feature: "법률적 원칙과 관계 심리학에 기반한 전문적 판결",
      image: "/img/판사.png",
      character: "judge",
    },
    {
      id: 1,
      name: "따뜻한 할머니",
      personalities: ["정감있는", "경험많은", "엉뚱한"],
      feature: "손자/손녀를 대하듯 따뜻하고 재미있는 조언",
      image: "/img/할머니.png",
      character: "grandma",
    },
    {
      id: 2,
      name: "사또",
      personalities: ["권위있는", "엄격한", "공정한"],
      feature: "고어체를 사용한 권위있는 판결",
      image: "/img/사또.png",
      character: "governor",
    },
    {
      id: 3,
      name: "래퍼",
      personalities: ["리듬감있는", "창의적", "독특한"],
      feature: "라임과 비트에 맞춘 스타일리시한 판결",
      image: "/img/래퍼.png",
      character: "rapper",
    },
    {
      id: 4,
      name: "선생님",
      personalities: ["따뜻한", "친절한", "교육적"],
      feature: "교육적 관점에서 구조화된 조언과 숙제 제시",
      image: "/img/선생님.png",
      character: "teacher",
    },
    {
      id: 5,
      name: "잼민이",
      personalities: ["엉뚱한", "귀여운", "직설적"],
      feature: "유치하고 엉뚱한 관점의 판결과 조언",
      image: "/img/잼민이.png",
      character: "kid",
    },
  ];

  useEffect(() => {
    const fetchHotCase = async () => {
      const { data, error } = await getHotCase();

      if (error) {
        return;
      } else {
        setHotCase(data || []);
      }
    };

    fetchHotCase();
  }, []);

  return (
    <Container maxWidth="md">
      {/* 히어로 섹션 */}
      <HeroSection>
        <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold" color="textPrimary">
          연애 갈등, <HighlightText>AI 판사</HighlightText>에게 맡기세요!
        </Typography>

        {/* 방문자 수 카운터 추가 */}
        <VisitorStatsSection>
          <Typography variant="subtitle1" component="p" align="center" color="primary">
            함께한 사용자
          </Typography>
          <CounterWrapper>
            <PeopleAltRounded sx={{ fontSize: 32, color: "primary.main", mr: 1 }} />
            <Typography variant="h4" component="span" fontWeight="bold" color="primary">
              <CountUp end={visitorCount} duration={2.0} separator="," delay={0} useEasing={true} />
            </Typography>
            <Typography variant="h6" component="span" color="primary" ml={1}>
              명
            </Typography>
          </CounterWrapper>
          <Button variant="contained" size="small" component={Link} href="/cases" endIcon={<ArrowForwardRounded />}>
            판결 보러가기
          </Button>
        </VisitorStatsSection>

        <HeroButtons>
          <Button variant="contained" size="large" component={Link} href="/case/new">
            갈등 상황 입력하기
          </Button>
          <Button variant="outlined" size="large" component={Link} href="/cases">
            사례 모음 보기
          </Button>
        </HeroButtons>
      </HeroSection>

      {/* HOT 게시물 카드 */}
      <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
        <LocalFireDepartmentRounded color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" color="primary" gutterBottom align="center" fontWeight="bold" mb={1}>
          HOT
        </Typography>
      </Stack>
      <HotCaseList rowGap={3}>
        {hotCase.length > 0 && hotCase.map((caseItem, idx) => <Case key={idx} caseItem={caseItem} hot={true} />)}
      </HotCaseList>

      {/* AI 판사에게 의뢰하기 */}
      <CharactersSection>
        <Typography variant="h4" color="primary" gutterBottom align="center" fontWeight="bold" mb={1}>
          AI 판사에게 의뢰하기
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" mb={3}>
          당신의 연애 갈등을 판단할 AI 판사를 선택해보세요
        </Typography>

        <Stack id="characters-container" gap={3}>
          {aiCharacters.map((character, index) => (
            <CharacterCard
              id={`character-${character.id}`}
              key={character.id}
              onClick={() => setSelectedCharacter(index)}
              selected={selectedCharacter === index}
            >
              {/* 캐릭터 이미지 */}
              <CharacterImageWrapper>
                <Image src={character.image} alt={character.name} fill />
              </CharacterImageWrapper>
              {/* 캐릭터 정보 */}
              <CharacterInfo>
                {/* 캐릭터 이름 */}
                <Typography variant="h6" color="primary" mb={1} fontWeight="bold">
                  {character.name}
                </Typography>
                {/* 캐릭터 태그 */}
                <Stack direction="row" columnGap={0.5}>
                  {character.personalities.map((personality, index) => (
                    <CharacterTag key={index}>{personality}</CharacterTag>
                  ))}
                </Stack>
                {/* 캐릭터 특징 */}
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {character.feature}
                </Typography>
              </CharacterInfo>
            </CharacterCard>
          ))}
        </Stack>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href={`/case/new?judge=${aiCharacters[selectedCharacter].id}`}
          >
            이 판사에게 의뢰하기
          </Button>
        </Box>
      </CharactersSection>

      {/* 주요 기능 섹션 */}
      <FeaturesSection>
        <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold" mb={4}>
          주요 기능
        </Typography>
        <Grid2 container spacing={3}>
          {features.map((feature, index) => (
            <Stack key={index} width="100%">
              <FeatureCard>
                <IconWrapper>{feature.icon}</IconWrapper>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Stack>
          ))}
        </Grid2>
      </FeaturesSection>

      {/* 현재 바로 시작하세요 섹션 */}
      <CTASection>
        <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold">
          지금 바로 시작하세요
        </Typography>
        <Typography variant="body1" gutterBottom align="center" color="textSecondary" mb={3}>
          연인과의 갈등을 객관적으로 해결하고 더 건강한 관계를 만들어보세요
        </Typography>
        <Button variant="contained" size="large" component={Link} href="/case/new">
          갈등 상황 입력하기
        </Button>
      </CTASection>

      {/* 앱 설치 배너 */}
      <InstallPWA />
    </Container>
  );
};

export default HomeContainer;

const HotCaseList = styled(Stack)``;

const HeroSection = styled(Box)`
  ${mixinFlex("column")};
  padding: 48px 0;
`;

const HighlightText = styled("span")`
  color: ${({ theme }) => theme.palette.primary.main};
`;

const HeroButtons = styled(Box)`
  ${mixinFlex("row")};
  gap: 16px;
  margin: 24px 0;
`;

const FeaturesSection = styled(Box)`
  padding: 48px 0;
`;

const FeatureCard = styled(Card)`
  padding: 24px;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled(Box)`
  ${mixinFlex("row")};
  margin-bottom: 16px;

  & > svg {
    font-size: 40px;
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const CTASection = styled(Box)`
  ${mixinFlex("column")};
  padding: 64px 0;
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: 16px;
  margin: 48px 0;
`;

// 새로운 스타일 컴포넌트 추가
const VisitorStatsSection = styled(Box)`
  ${mixinFlex("column")};
  margin: 16px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CounterWrapper = styled(Box)`
  ${mixinFlex("row")};
  align-items: center;
  justify-content: center;
  margin: 8px 0;
`;

// AI 판사 섹션 스타일 컴포넌트
const CharactersSection = styled(Box)`
  padding: 48px 0;
`;

const CharacterCard = styled(Stack)<{ selected?: boolean }>`
  ${mixinFlex("row")};
  justify-content: space-between;
  padding: 16px;
  column-gap: 16px;
  transition: all 0.3s ease;
  border: 2px solid ${({ selected, theme }) => (selected ? theme.palette.primary.main : "transparent")};
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CharacterImageWrapper = styled(Box)`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
`;

const CharacterInfo = styled(Box)`
  flex: 1;
  ${mixinFlex("column")};
`;

const CharacterTag = styled(Box)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 10px;
  display: inline-block;
`;
