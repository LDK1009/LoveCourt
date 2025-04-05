"use client";

import type { Case as CaseType } from "@/types/Case";
import { Chip, Stack, Typography, styled, Button } from "@mui/material";
import { LocalFireDepartmentRounded, VisibilityOutlined } from "@mui/icons-material";
import Link from "next/link";
import { mixinFlex } from "@/styles/mixins";

interface CaseProps {
  caseItem: CaseType;
  hot?: boolean;
}

const Case = ({ caseItem, hot = false }: CaseProps) => {
  return (
    <CaseContainer boxShadow={1}>
      {hot && (
        <HotIconWrapper>
          <LocalFireDepartmentRounded color="primary" />
        </HotIconWrapper>
      )}
      <Button component={Link} href={`/case/${caseItem.id}`} sx={{ padding: 0}}>
        <CaseContent>
          <CaseText>
            {/* 케이스 제목 */}
            <CaseTitle variant="h6" color={hot ? "primary" : "text.primary"}>
              {caseItem.title}
            </CaseTitle>

            {/* 케이스 설명 */}
            <CaseDescription variant="body2" color="textSecondary">
              {caseItem.description}
            </CaseDescription>
          </CaseText>

          {/* 조회수 */}
          <CaseMeta>
            {/* 케이스 태그 */}
            <CaseTags>
              {caseItem.category && <Chip label={caseItem.category} size="small" color="primary" variant="outlined" />}
              {caseItem.tags.slice(0, 3).map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" color="primary" />
              ))}
              {caseItem.tags.length > 3 && (
                <Typography variant="caption" color="textSecondary">
                  +{caseItem.tags.length - 3}
                </Typography>
              )}
            </CaseTags>
            <MetaItem>
              <VisibilityOutlined fontSize="small" />
              <Typography variant="body2">{caseItem.view_count}</Typography>
            </MetaItem>
          </CaseMeta>
        </CaseContent>
      </Button>
    </CaseContainer>
  );
};

export default Case;

const CaseContainer = styled(Stack)`
  position: relative;
  row-gap: 16px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 16px;
`;

const HotIconWrapper = styled(Stack)`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(25%, -25%);
`;

const CaseContent = styled(Stack)`
  width: 100%;
  row-gap: 8px;
  padding: 16px;
`;

const CaseText = styled(Stack)`
  width: 100%;
`;

const CaseTitle = styled(Typography)``;

const CaseMeta = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
`;

const MetaItem = styled(Stack)`
  flex-direction: row;
  column-gap: 4px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const CaseDescription = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const CaseTags = styled(Stack)`
  ${mixinFlex("row")};
  justify-content: start;
  flex-wrap: wrap;
  column-gap: 8px;
`;
