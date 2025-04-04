"use client";

import { Case } from "@/types/Case";
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
  styled,
  Box,
} from "@mui/material";
import { AccessTimeOutlined, VisibilityOutlined } from "@mui/icons-material";
import Link from "next/link";
import dayjs from "dayjs";
import { mixinFlex } from "@/styles/mixins";

interface CaseCardProps {
  caseItem: Case;
}

const CaseCard = ({ caseItem }: CaseCardProps) => {
  return (
    <StyledCaseCard>
      <CardActionArea component={Link} href={`/case/${caseItem.id}`}>
        <CardContent>
          <CaseTitle variant="h6">{caseItem.title}</CaseTitle>

          <CaseMeta>
            <MetaItem>
              <AccessTimeOutlined fontSize="small" />
              <Typography variant="body2">{dayjs(caseItem.created_at).fromNow()}</Typography>
            </MetaItem>
            <MetaItem>
              <VisibilityOutlined fontSize="small" />
              <Typography variant="body2">{caseItem.view_count}</Typography>
            </MetaItem>
          </CaseMeta>

          <CaseDescription variant="body2" color="textSecondary">
            {caseItem.description.length > 100
              ? `${caseItem.description.substring(0, 100)}...`
              : caseItem.description}
          </CaseDescription>

          <CaseTags>
            {caseItem.category && (
              <Chip label={caseItem.category} size="small" color="primary" variant="outlined" />
            )}
            {caseItem.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
            {caseItem.tags.length > 3 && (
              <Typography variant="caption" color="textSecondary">
                +{caseItem.tags.length - 3}
              </Typography>
            )}
          </CaseTags>

          <CaseStatus>
            <StatusChip label="판결 완료" size="small" color="secondary" />
          </CaseStatus>
        </CardContent>
      </CardActionArea>
    </StyledCaseCard>
  );
};

export default CaseCard;

// 스타일 컴포넌트
const StyledCaseCard = styled(Card)`
  margin-bottom: 16px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const CaseTitle = styled(Typography)`
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1.4;
`;

const CaseMeta = styled(Stack)`
  ${mixinFlex("row")};
  margin-bottom: 12px;
  gap: 16px;
`;

const MetaItem = styled(Stack)`
  ${mixinFlex("row")};
  gap: 4px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const CaseDescription = styled(Typography)`
  margin-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CaseTags = styled(Stack)`
  ${mixinFlex("row")};
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const CaseStatus = styled(Box)`
  ${mixinFlex("row")};
  justify-content: flex-end;
`;

const StatusChip = styled(Chip)`
  font-weight: 500;
`; 