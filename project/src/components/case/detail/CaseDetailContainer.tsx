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

dayjs.locale("ko");

interface CaseDetailContainerProps {
  caseId: number;
}

const CaseDetailContainer = ({ caseId }: CaseDetailContainerProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [voteStats, setVoteStats] = useState<VoteStats>({
    person_a: 0,
    person_b: 0,
    both: 0,
    neither: 0,
    total: 0,
  });
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

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

      // 북마크 확인
      const { data: bookmarkData } = await checkBookmark(caseId);
      if (bookmarkData) {
        setIsBookmarked(bookmarkData);
      }
    };

    fetchCaseData();
  }, [caseId, user.isSignIn, user.uid]);

  // 투표 처리
  const handleVote = async (vote: "person_a" | "person_b" | "both" | "neither") => {
    await voteOnCase(caseId, vote);

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

  const handleBookmark = async () => {
    await bookmarkCase(caseId);
    setIsBookmarked(!isBookmarked);
  };

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

  const handleGenerateVerdict = async () => {
    setLoading(true);
    await api.post("/verdicts/generate", { case_id: caseId });

    enqueueSnackbar("AI가 판결을 생성 중입니다. 잠시 후 새로고침해 주세요.", { variant: "info" });
  };

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
          <MetaItem>
            <AccessTimeOutlined fontSize="small" />
            <Typography variant="body2">{dayjs(caseData.created_at).format("YYYY년 MM월 DD일")}</Typography>
          </MetaItem>
          <MetaItem>
            <VisibilityOutlined fontSize="small" />
            <Typography variant="body2">조회 {caseData.view_count}</Typography>
          </MetaItem>
        </CaseMeta>

        <Box sx={{ mt: 1 }}>
          {caseData.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
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
            <Typography variant="h6" gutterBottom color="primary">
              {verdict.verdict === "person_a" && `${caseData.person_a}의 입장이 더 타당합니다.`}
              {verdict.verdict === "person_b" && `${caseData.person_b}의 입장이 더 타당합니다.`}
              {verdict.verdict === "both" && "양쪽 모두 일리가 있습니다."}
              {verdict.verdict === "neither" && "양쪽 모두 재고해볼 필요가 있습니다."}
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              판결 근거
            </Typography>
            <Typography variant="body1" paragraph>
              {verdict.reasoning}
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              법률적 근거
            </Typography>
            <Typography variant="body1" paragraph>
              {verdict.legal_basis}
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              AI 코멘트
            </Typography>
            <Typography variant="body1">{verdict.ai_comment}</Typography>
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
          {isBookmarked ? "북마크됨" : "북마크"}
        </ActionButton>
        <ActionButton variant="outlined" startIcon={<ShareOutlined />} onClick={handleShare}>
          공유하기
        </ActionButton>
      </ActionButtons>
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
  margin-bottom: 8px;
`;

const MetaItem = styled(Box)`
  ${mixinFlex("row")};
  gap: 4px;
  align-items: center;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const CaseContent = styled(Box)`
  margin-bottom: 24px;
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
