"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  styled,
  Avatar,
  useTheme,
  Grid2,
} from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import {
  GavelRounded,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
  ShareOutlined,
  BookmarkBorderOutlined,
  BookmarkOutlined,
  ThumbUpAlt,
  ThumbDownAlt,
  AccessTimeOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  getCaseById,
  voteOnCase,
  bookmarkCase,
  getVerdictByCaseId,
  getCaseVoteStats,
  checkBookmark,
  getPrevNextCase,
} from "@/service/cases";
import { useAuthStore } from "@/store";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { Case } from "@/types/Case";
import { Verdict } from "@/types/Verdict";
import type { VoteStats } from "@/types/Vote";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import api from "@/lib/apiClient";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

dayjs.locale("ko");

interface CaseDetailContainerProps {
  caseId: number;
}

const CaseDetailContainer = ({ caseId }: CaseDetailContainerProps) => {
  //////////////////////////////////////// Hooks ////////////////////////////////////////
  // 테마
  const theme = useTheme();
  // 라우터
  const router = useRouter();
  // 유저 정보
  const { user } = useAuthStore();

  //////////////////////////////////////// State ////////////////////////////////////////
  // 사례 데이터
  const [caseData, setCaseData] = useState<Case | null>(null);
  // 판결 데이터
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  // 투표 데이터
  const [voteStats, setVoteStats] = useState<VoteStats>({
    person_a: 0,
    person_b: 0,
    both: 0,
    neither: 0,
    total: 0,
  });
  // 이전 케이스 데이터
  const [prevCase, setPrevCase] = useState<Case | null>();
  // 다음 케이스 데이터
  const [nextCase, setNextCase] = useState<Case | null>();
  // 유저 투표
  const [userVote, setUserVote] = useState<string | null>(null);
  // 북마크 상태
  const [isBookmarked, setIsBookmarked] = useState(false);
  // 로딩 상태
  const [loading, setLoading] = useState(true);

  //////////////////////////////////////// UseEffect ////////////////////////////////////////
  // 데이터 불러오기
  useEffect(() => {
    setLoading(true);

    const fetchCaseData = async () => {
      // 사례 데이터 불러오기
      const { data: caseData } = await getCaseById(caseId);
      if (caseData) {
        setCaseData(caseData);
        setLoading(false);
      }

      // 판결 데이터 불러오기
      const { data: verdictData } = await getVerdictByCaseId(caseId);
      if (verdictData) {
        setVerdict(verdictData);
      }

      // 투표 현황 불러오기
      const { data: voteStatsData } = await getCaseVoteStats(caseId);
      if (voteStatsData) {
        setVoteStats(voteStatsData);
      }

      // 이전/다음 케이스 데이터 불러오기
      const { data, error } = await getPrevNextCase(caseId);
      if (error) {
        enqueueSnackbar("이전/다음 케이스 데이터 불러오기 실패", { variant: "error" });
        return;
      }
      if (data) {
        setPrevCase(data.prev);
        setNextCase(data.next);
      }

      // 북마크 확인 - 로그인된 경우에만 확인
      if (user.isSignIn) {
        const { data: bookmarkData } = await checkBookmark(caseId);
        setIsBookmarked(!!bookmarkData); // 북마크 데이터가 있으면 true, 없으면 false
      } else {
        setIsBookmarked(false); // 로그인되지 않은 경우 항상 false
      }
    };

    fetchCaseData();
  }, [caseId, user.isSignIn, user.uid]);

  //////////////////////////////////////// Functions ////////////////////////////////////////
  // 투표 처리
  const handleVote = async (vote: "person_a" | "person_b" | "both" | "neither") => {
    const voteResponse = await voteOnCase(caseId, vote);

    if (voteResponse.error) {
      router.push("/auth/sign-in");
      return;
    }

    // 투표 상태 업데이트
    setVoteStats((prev) => {
      const newStats = { ...prev };

      // 이전 투표가 있으면 제거
      if (userVote && userVote in newStats) {
        newStats[userVote as keyof typeof newStats]--;
      } else {
        newStats.total++;
      }

      // 새 투표 추가
      newStats[vote]++;

      return newStats;
    });

    setUserVote(vote);
  };

  // 북마크 처리
  const handleBookmark = async () => {
    await bookmarkCase(caseId);
    setIsBookmarked(!isBookmarked);
  };

  // 공유 처리
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: caseData?.title || "연애재판 사례",
        text: caseData?.description || "연애재판에서 AI 판결을 확인해보세요.",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      enqueueSnackbar("링크가 클립보드에 복사되었습니다.", { variant: "success" });
    }
  };

  // 판결 생성 요청
  const handleGenerateVerdict = async () => {
    setLoading(true);
    await api.post("/verdicts/generate", { case_id: caseId });

    enqueueSnackbar("AI가 판결을 생성 중입니다. 잠시 후 새로고침해 주세요.", { variant: "info" });
  };

  // 로딩 상태
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          사례 정보를 불러오는 중입니다...
        </Typography>
      </Container>
    );
  }

  // 사례 정보 없음
  if (!caseData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          사례를 찾을 수 없습니다.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" onClick={() => router.push("/cases")}>
            사례 목록으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 헤더 */}
      <CaseHeader>
        <Typography variant="h4" component="h1" gutterBottom>
          {caseData.title}
        </Typography>

        <CaseMeta>
          {/* 작성일 */}
          <TimeWrapper>
            <AccessTimeOutlined fontSize="small" />
            <Typography variant="body2">{dayjs(caseData.created_at).format("YYYY년 MM월 DD일")}</Typography>
          </TimeWrapper>

          {/* 조회수 */}
          <ViewWrapper>
            <VisibilityOutlined fontSize="small" />
            <Typography variant="body2">조회 {caseData.view_count}</Typography>
          </ViewWrapper>
        </CaseMeta>

        {/* 태그 */}
        <TagWrapper>
          {caseData.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </TagWrapper>
      </CaseHeader>

      {/* 사례 내용 */}
      <CaseContent>
        <Typography variant="body1" paragraph>
          {caseData.description}
        </Typography>

        {/* 당사자 정보 */}
        <ParticipantsCard>
          <Typography variant="h6" gutterBottom>
            당사자 정보
          </Typography>

          {/* 당사자 그리드 */}
          <ParticipantsGrid>
            <ParticipantBox>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
                {caseData.person_a.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold">
                {caseData.person_a}
              </Typography>
            </ParticipantBox>

            <Typography variant="h6" color="text.secondary">
              VS
            </Typography>

            <ParticipantBox>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 56, height: 56 }}>
                {caseData.person_b.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold">
                {caseData.person_b}
              </Typography>
            </ParticipantBox>
          </ParticipantsGrid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                연애 관계: {caseData.relationship}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                연애 기간: {caseData.duration}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                카테고리: {caseData.category}
              </Typography>
            </Grid>
          </Grid>
        </ParticipantsCard>
      </CaseContent>

      {/* 판결 결과 */}
      <VerdictSection>
        <VerdictHeader>
          <GavelRounded color="primary" />
          <Typography variant="h5" component="h2">
            AI 판결 결과
          </Typography>
        </VerdictHeader>

        {verdict ? (
          <VerdictResult>
            <Grid2 container spacing={1} alignItems="center">
              <GavelRounded color="primary" />
              <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                {verdict.verdict === "person_a" && `${caseData.person_b} 유죄`}
                {verdict.verdict === "person_b" && `${caseData.person_a} 유죄`}
                {verdict.verdict === "both" && `${caseData.person_a} 유죄 | ${caseData.person_b} 유죄`}
                {verdict.verdict === "neither" && `${caseData.person_a} 무죄 | ${caseData.person_b} 무죄`}
              </Typography>
            </Grid2>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              판결 근거
            </Typography>
            <VerdictText variant="body1" paragraph>
              {/* {verdict.reasoning?.replace(/\\n/g, "\n")} */}
              {verdict.reasoning}
            </VerdictText>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              법률적 근거
            </Typography>
            <VerdictText variant="body1" paragraph>
              {verdict.legal_basis?.replace(/\\n/g, "\n")}
            </VerdictText>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              AI 코멘트
            </Typography>
            <VerdictText variant="body1">{verdict.ai_comment?.replace(/\\n/g, "\n")}</VerdictText>
          </VerdictResult>
        ) : (
          <PendingVerdict>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              AI가 판결을 분석 중입니다
            </Typography>
            <LinearProgress sx={{ mt: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              잠시만 기다려주세요. 판결 결과가 곧 제공됩니다.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleGenerateVerdict}
              disabled={loading}
            >
              판결 생성 요청하기
            </Button>
          </PendingVerdict>
        )}
      </VerdictSection>

      <VoteSection>
        <Typography variant="h5" component="h2" gutterBottom>
          여러분의 의견은?
        </Typography>

        <Typography variant="body1">이 갈등 상황에서 누구의 입장이 더 타당하다고 생각하시나요?</Typography>

        <VoteButtons>
          <VoteButton
            variant={userVote === "person_a" ? "contained" : "outlined"}
            color={userVote === "person_a" ? "primary" : "inherit"}
            onClick={() => handleVote("person_a")}
            startIcon={userVote === "person_a" ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
          >
            {caseData.person_a}의 입장
          </VoteButton>

          <VoteButton
            variant={userVote === "person_b" ? "contained" : "outlined"}
            color={userVote === "person_b" ? "secondary" : "inherit"}
            onClick={() => handleVote("person_b")}
            startIcon={userVote === "person_b" ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
          >
            {caseData.person_b}의 입장
          </VoteButton>

          <VoteButton
            variant={userVote === "both" ? "contained" : "outlined"}
            color={userVote === "both" ? "success" : "inherit"}
            onClick={() => handleVote("both")}
            startIcon={userVote === "both" ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
          >
            둘 다 일리 있음
          </VoteButton>

          <VoteButton
            variant={userVote === "neither" ? "contained" : "outlined"}
            color={userVote === "neither" ? "error" : "inherit"}
            onClick={() => handleVote("neither")}
            startIcon={userVote === "neither" ? <ThumbDownAlt /> : <ThumbDownAltOutlined />}
          >
            둘 다 재고 필요
          </VoteButton>
        </VoteButtons>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          투표 현황 (총 {voteStats.total}표)
        </Typography>

        <VoteStats>
          <VoteStatItem>
            <VoteStatLabel variant="body2">{caseData.person_a}의 입장</VoteStatLabel>
            <VoteStatBar>
              <VoteStatFill
                style={{
                  width: `${voteStats.total > 0 ? (voteStats.person_a / voteStats.total) * 100 : 0}%`,
                  backgroundColor: theme.palette.primary.main,
                }}
              />
            </VoteStatBar>
            <VoteStatValue>
              {voteStats.person_a}표 (
              {voteStats.total > 0 ? Math.round((voteStats.person_a / voteStats.total) * 100) : 0}%)
            </VoteStatValue>
          </VoteStatItem>

          <VoteStatItem>
            <VoteStatLabel variant="body2">{caseData.person_b}의 입장</VoteStatLabel>
            <VoteStatBar>
              <VoteStatFill
                style={{
                  width: `${voteStats.total > 0 ? (voteStats.person_b / voteStats.total) * 100 : 0}%`,
                  backgroundColor: theme.palette.secondary.main,
                }}
              />
            </VoteStatBar>
            <VoteStatValue>
              {voteStats.person_b}표 (
              {voteStats.total > 0 ? Math.round((voteStats.person_b / voteStats.total) * 100) : 0}%)
            </VoteStatValue>
          </VoteStatItem>

          <VoteStatItem>
            <VoteStatLabel variant="body2">둘 다 일리 있음</VoteStatLabel>
            <VoteStatBar>
              <VoteStatFill
                style={{
                  width: `${voteStats.total > 0 ? (voteStats.both / voteStats.total) * 100 : 0}%`,
                  backgroundColor: theme.palette.success.main,
                }}
              />
            </VoteStatBar>
            <VoteStatValue>
              {voteStats.both}표 ({voteStats.total > 0 ? Math.round((voteStats.both / voteStats.total) * 100) : 0}%)
            </VoteStatValue>
          </VoteStatItem>

          <VoteStatItem>
            <VoteStatLabel variant="body2">둘 다 재고 필요</VoteStatLabel>
            <VoteStatBar>
              <VoteStatFill
                style={{
                  width: `${voteStats.total > 0 ? (voteStats.neither / voteStats.total) * 100 : 0}%`,
                  backgroundColor: theme.palette.error.main,
                }}
              />
            </VoteStatBar>
            <VoteStatValue>
              {voteStats.neither}표 ({voteStats.total > 0 ? Math.round((voteStats.neither / voteStats.total) * 100) : 0}
              %)
            </VoteStatValue>
          </VoteStatItem>
        </VoteStats>
      </VoteSection>

      <ActionButtons>
        <ActionButton
          variant="outlined"
          startIcon={isBookmarked ? <BookmarkOutlined /> : <BookmarkBorderOutlined />}
          onClick={handleBookmark}
        >
          {user.isSignIn ? (isBookmarked ? "북마크됨" : "북마크") : "북마크"}
        </ActionButton>
        <ActionButton variant="outlined" startIcon={<ShareOutlined />} onClick={handleShare}>
          공유하기
        </ActionButton>
      </ActionButtons>

      {/* 이전/다음 게시물 네비게이션 */}
      <NavigationContainer>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => prevCase && router.push(`/case/${prevCase.id}`)}
          disabled={!prevCase}
          sx={{ flex: 1, justifyContent: "flex-start" }}
        >
          {prevCase ? `${prevCase.title}` : "이전 게시물 없음"}
        </Button>

        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => nextCase && router.push(`/case/${nextCase.id}`)}
          disabled={!nextCase}
          sx={{ flex: 1, justifyContent: "flex-end" }}
        >
          {nextCase ? `${nextCase.title}` : "다음 게시물 없음"}
        </Button>
      </NavigationContainer>
    </Container>
  );
};

export default CaseDetailContainer;

const CaseHeader = styled(Box)`
  margin-bottom: 24px;
`;

const CaseMeta = styled(Box)`
  ${mixinFlex("row")};
  gap: 16px;
`;

const TimeWrapper = styled(Box)`
  ${mixinFlex("row")};
  gap: 4px;
  align-items: center;
  justify-content: start;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const ViewWrapper = styled(TimeWrapper)`
  justify-content: end;
`;

const TagWrapper = styled(Box)`
  margin-top: 12px;
`;

const CaseContent = styled(Box)`
  margin-bottom: 24px;
  white-space: pre-line;
`;

const ParticipantsCard = styled(Card)`
  padding: 16px;
  margin-top: 24px;
`;

const ParticipantsGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
  margin: 16px 0;
`;

const ParticipantBox = styled(Box)`
  ${mixinFlex("column")};
  gap: 8px;
  align-items: center;
`;

const VerdictSection = styled(Box)`
  margin-bottom: 24px;
`;

const VerdictHeader = styled(Box)`
  ${mixinFlex("row")};
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
`;

const VerdictResult = styled(Paper)`
  padding: 24px;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const VerdictText = styled(Typography)`
  white-space: pre-line;
`;

const PendingVerdict = styled(Paper)`
  padding: 24px;
  text-align: center;
`;

const VoteSection = styled(Box)`
  margin-bottom: 24px;
`;

const VoteButtons = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 24px 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const VoteButton = styled(Button)`
  padding: 12px;
`;

const VoteStats = styled(Box)`
  margin-top: 24px;
`;

const VoteStatItem = styled(Box)`
  margin-bottom: 12px;
`;

const VoteStatLabel = styled(Typography)`
  margin-bottom: 4px;
  font-weight: 500;
`;

const VoteStatBar = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.palette.gray[200]};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
`;

const VoteStatFill = styled(Box)`
  height: 100%;
  transition: width 0.3s ease;
`;

const VoteStatValue = styled(Typography)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const ActionButtons = styled(Box)`
  ${mixinFlex("row")};
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
`;

const ActionButton = styled(Button)`
  min-width: 120px;
`;

// 이전/다음 게시물 네비게이션 컨테이너 스타일
const NavigationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));
