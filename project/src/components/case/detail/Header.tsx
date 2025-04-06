import { Typography } from "@mui/material";

import { Chip, Stack } from "@mui/material";

import { styled } from "@mui/material";
import { Case as CaseType } from "@/types/Case";
import dayjs from "dayjs";
import { AccessTimeOutlined, HdrWeakRounded } from "@mui/icons-material";

const Header = ({ caseData }: { caseData: CaseType }) => {
  return (
    <CaseHeader>
      {/* 제목 */}
      <Typography variant="h4" component="h1" gutterBottom>
        {caseData.title}
      </Typography>

      {/* 메타 정보 */}
      <CaseMeta>
        {/* 작성일 */}
        <TimeWrapper>
          <AccessTimeOutlined fontSize="small" />
          <Typography variant="caption">{dayjs(caseData.created_at).format("YYYY년 MM월 DD일")}</Typography>
        </TimeWrapper>

        {/* 조회수 */}
        <ViewCountWrapper>
          <HdrWeakRounded fontSize="small" />
          <Typography variant="caption">{caseData.view_count}</Typography>
        </ViewCountWrapper>
      </CaseMeta>

      {/* 태그 */}
      <TagWrapper>
        {caseData.category && <Chip key={caseData.category} label={caseData.category} size="small" />}
        {caseData.tags.map((tag, index) => (
          <Chip key={index} label={tag} size="small" />
        ))}
      </TagWrapper>

      {/* 내용 */}
      <ContentWrapper>
        <Typography variant="body1">
          {caseData.description}
        </Typography>
      </ContentWrapper>
    </CaseHeader>
  );
};

export default Header;

const CaseHeader = styled(Stack)``;

const CaseMeta = styled(Stack)`
  flex-direction: row;
  color: ${({ theme }) => theme.palette.primary.light};
  justify-content: space-between;
`;

const TagWrapper = styled(Stack)`
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;

  & span {
    font-size: 12px;
    background-color: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.primary.main};
    padding: 4px 8px;
    border: 1px solid ${({ theme }) => theme.palette.primary.light};
    border-radius: 16px;
  }
`;

const TimeWrapper = styled(Stack)`
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: start;
`;

const ViewCountWrapper = styled(Stack)`
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: start;
`;

const ContentWrapper = styled(Stack)`
  margin-top: 16px;
`;
