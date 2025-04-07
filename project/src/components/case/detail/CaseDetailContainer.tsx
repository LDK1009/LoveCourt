"use client";

import { useEffect, useState } from "react";
import { Box, Button, Container, LinearProgress, Typography, styled, Stack, Divider, useTheme } from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import { ShareOutlined, BookmarkBorderOutlined, BookmarkOutlined } from "@mui/icons-material";
import { getCaseById, bookmarkCase, getCaseVoteStats, checkBookmark, getPrevNextCase } from "@/service/cases";
import { useAuthStore } from "@/store";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { Case } from "@/types/Case";
import type { VoteStats } from "@/types/Vote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Header from "./Header";
import VerdictSection from "./VerdictSection";
import PersonalSection from "./PersonalSection";
import VoteSection from "./VoteSection";

interface PropsType {
  caseId: number;
}

const CaseDetailContainer = ({ caseId }: PropsType) => {
  //////////////////////////////////////// Hooks ////////////////////////////////////////
  const theme = useTheme();
  // 라우터
  const router = useRouter();
  // 유저 정보
  const { user } = useAuthStore();

  //////////////////////////////////////// State ////////////////////////////////////////
  // 사례 데이터
  const [caseData, setCaseData] = useState<Case | null>(null);

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
  // 투표 상태 변경 핸들러
  const handleVoteChange = (newStats: VoteStats, newUserVote: string) => {
    setVoteStats(newStats);
    setUserVote(newUserVote);
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
        title: `연애재판 | ${caseData?.title}`.trim(),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      enqueueSnackbar("링크가 클립보드에 복사되었습니다.", { variant: "success" });
    }
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
    <CaseContainer>
      <Header caseData={caseData} />

      {/* 판결 섹션 */}
      <VerdictSection caseId={caseId} caseData={caseData} />

      {/* 당사자 정보 섹션 */}
      <PersonalSection caseData={caseData} />

      {/* 투표 섹션 */}
      <VoteSection
        caseId={caseId}
        caseData={caseData}
        initialVoteStats={voteStats}
        initialUserVote={userVote}
        onVoteChange={handleVoteChange}
      />

      <Divider sx={{ borderColor: theme.palette.primary.main }} />

      {/* 북마크 공유 버튼 */}
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
    </CaseContainer>
  );
};

export default CaseDetailContainer;

const CaseContainer = styled(Stack)`
  padding: 16px;
  row-gap: 32px;
`;

const ActionButtons = styled(Box)`
  ${mixinFlex("row")};
  gap: 16px;
  justify-content: center;
`;

const ActionButton = styled(Button)`
  min-width: 120px;
  flex: 1;
`;

// 이전/다음 게시물 네비게이션 컨테이너 스타일
const NavigationContainer = styled(Stack)`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
