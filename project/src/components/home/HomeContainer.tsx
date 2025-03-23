"use client";

import { Box, Button, Card, Container, Grid, Typography, styled } from "@mui/material";
import { GavelRounded, SearchRounded, ThumbsUpDownRounded, ChatRounded, ShareRounded } from "@mui/icons-material";
import { mixinFlex } from "@/styles/mixins";
import Link from "next/link";
import InstallPWA from "@/components/common/InstallPWA";

const HomeContainer = () => {
  const features = [
    {
      icon: <GavelRounded />,
      title: "AI 판결",
      description: "인공지능이 연애 논쟁을 객관적으로 판단합니다."
    },
    {
      icon: <SearchRounded />,
      title: "유사 사례 검색",
      description: "비슷한 갈등 상황의 판결 결과를 확인할 수 있습니다."
    },
    {
      icon: <ThumbsUpDownRounded />,
      title: "사용자 투표",
      description: "다른 사용자들의 의견을 확인하고 투표할 수 있습니다."
    },
    {
      icon: <ChatRounded />,
      title: "AI 코멘트",
      description: "판결에 대한 추가 설명과 조언을 제공합니다."
    },
    {
      icon: <ShareRounded />,
      title: "SNS 공유",
      description: "판결 결과를 친구들과 공유할 수 있습니다."
    }
  ];

  return (
    <Container maxWidth="md">
      <HeroSection>
        <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold">
          연애 갈등, 이제는 <HighlightText>AI 판사</HighlightText>에게 맡기세요
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="textSecondary">
          법률 기반의 객관적인 판단으로 커플 간 논쟁을 해결합니다
        </Typography>
        <HeroButtons>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            href="/case/new"
          >
            갈등 상황 입력하기
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            component={Link} 
            href="/cases"
          >
            사례 모음 보기
          </Button>
        </HeroButtons>

      </HeroSection>

      <FeaturesSection>
        <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold" mb={4}>
          주요 기능
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <IconWrapper>
                  {feature.icon}
                </IconWrapper>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </FeaturesSection>

      <CTASection>
        <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold">
          지금 바로 시작하세요
        </Typography>
        <Typography variant="body1" gutterBottom align="center" color="textSecondary" mb={3}>
          연인과의 갈등을 객관적으로 해결하고 더 건강한 관계를 만들어보세요
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          component={Link} 
          href="/case/new"
        >
          갈등 상황 입력하기
        </Button>
      </CTASection>

      <InstallPWA />
    </Container>
  );
};

export default HomeContainer;

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