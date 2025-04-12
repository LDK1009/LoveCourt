import { Box, Button, Grid2, Stack, Typography, styled, useTheme } from "@mui/material";
import { Gavel, GavelOutlined } from "@mui/icons-material";
import { Case } from "@/types/Case";
import type { VoteStats } from "@/types/Vote";
import { voteOnCase } from "@/service/cases";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";

interface VoteSectionProps {
  caseId: number;
  caseData: Case;
  initialVoteStats: VoteStats;
  initialUserVote?: string | null;
  onVoteChange?: (newStats: VoteStats, newUserVote: string) => void;
}

const VoteSection = ({
  caseId,
  caseData,
  initialVoteStats,
  initialUserVote = null,
  onVoteChange,
}: VoteSectionProps) => {
  const theme = useTheme();
  const router = useRouter();

  // 내부 상태 관리
  const [voteStats, setVoteStats] = useState<VoteStats>(initialVoteStats);
  const [userVote, setUserVote] = useState<string | null>(initialUserVote);

  // 초기 투표 통계가 변경되면 내부 상태 업데이트
  useEffect(() => {
    setVoteStats(initialVoteStats);
  }, [initialVoteStats]);

  useEffect(() => {
    setUserVote(initialUserVote);
  }, [initialUserVote]);

  // 투표 처리 함수
  const handleVote = async (vote: "person_a" | "person_b" | "both" | "neither") => {
    const voteResponse = await voteOnCase(caseId, vote);

    if (voteResponse.error) {
      enqueueSnackbar("로그인 후 투표해주세요.", { variant: "error" });
      router.push("/auth/sign-in");
      return;
    }

    // 투표 상태 업데이트
    const newStats = { ...voteStats };

    // 이전 투표가 있으면 제거
    if (userVote && userVote in newStats) {
      newStats[userVote as keyof typeof newStats]--;
    } else {
      newStats.total++;
    }

    // 새 투표 추가
    newStats[vote]++;

    // 내부 상태 업데이트
    setVoteStats(newStats);
    setUserVote(vote);

    // 부모 컴포넌트에 변경 알림 (필요한 경우)
    if (onVoteChange) {
      onVoteChange(newStats, vote);
    }
  };

  // 투표 통계 데이터 배열
  const voteStatsData = [
    {
      key: "person_a",
      label: `${caseData.person_a} 유죄`,
      value: voteStats.person_a,
      color: theme.palette.primary.main,
    },
    {
      key: "person_b",
      label: `${caseData.person_b} 유죄`,
      value: voteStats.person_b,
      color: theme.palette.secondary.main,
    },
    {
      key: "both",
      label: "둘 다 유죄",
      value: voteStats.both,
      color: theme.palette.success.main,
    },
  ];

  // 투표 버튼 데이터 배열
  const voteButtonsData = [
    {
      key: "person_a",
      label: `${caseData.person_a} 유죄`,
      color: "primary" as const,
      icon: userVote === "person_a" ? <Gavel /> : <GavelOutlined />,
    },
    {
      key: "person_b",
      label: `${caseData.person_b} 유죄`,
      color: "secondary" as const,
      icon: userVote === "person_b" ? <Gavel /> : <GavelOutlined />,
    },
    {
      key: "both",
      label: "둘 다 유죄",
      color: "success" as const,
      icon: userVote === "both" ? <Gavel /> : <GavelOutlined />,
    },
  ];

  return (
    <VoteSectionContainer>
      <Typography variant="h6" fontWeight="bold">
        투표
      </Typography>

      {/* 투표 현황 */}
      <Typography variant="caption" color="text.secondary" align="right">
        투표 현황 (총 {voteStats.total}표)
      </Typography>

      {/* 투표 현황 */}
      <VoteStatsWrapper>
        {voteStatsData.map((stat) => (
          <VoteStatItem key={stat.key}>
            <VoteStatLabel variant="body2">{stat.label}</VoteStatLabel>
            <VoteStatBar>
              <VoteStatFill
                style={{
                  width: `${voteStats.total > 0 ? (stat.value / voteStats.total) * 100 : 0}%`,
                  backgroundColor: stat.color,
                }}
              />
            </VoteStatBar>
            <VoteStatValue>
              {stat.value}표 ({voteStats.total > 0 ? Math.round((stat.value / voteStats.total) * 100) : 0}%)
            </VoteStatValue>
          </VoteStatItem>
        ))}
      </VoteStatsWrapper>

      {/* 투표 버튼 */}
      <VoteButtons container spacing={1}>
        {voteButtonsData.map((button, idx) => (
          <VoteButtonGridItem key={button.key} size={idx === 2 ? 12 : 6}>
            <VoteButton
              variant={userVote === button.key ? "contained" : "outlined"}
              color={userVote === button.key ? button.color : "inherit"}
              onClick={() => handleVote(button.key as "person_a" | "person_b" | "both")}
              startIcon={button.icon}
            >
              {button.label}
            </VoteButton>
          </VoteButtonGridItem>
        ))}
      </VoteButtons>
    </VoteSectionContainer>
  );
};

export default VoteSection;

const VoteSectionContainer = styled(Stack)``;

const VoteButtons = styled(Grid2)`
  margin-top: 24px;
`;

const VoteButtonGridItem = styled(Grid2)``;

const VoteButton = styled(Button)`
  width: 100%;
  padding: 12px;
`;

const VoteStatsWrapper = styled(Stack)`
  row-gap: 12px;
`;

const VoteStatItem = styled(Box)``;

const VoteStatLabel = styled(Typography)`
  margin-bottom: 4px;
  font-weight: bold;
`;

const VoteStatBar = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.palette.grey[300]};
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
