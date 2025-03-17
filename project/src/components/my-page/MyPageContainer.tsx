"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Tab,
  Tabs,
  Typography,
  styled,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import { BookmarkOutlined, DeleteOutline, EditOutlined, GavelRounded, PersonOutline } from "@mui/icons-material";
import { useAuthStore } from "@/store";
import { getUserCases, getUserBookmarks, deleteCase, removeBookmark } from "@/service/cases";
import { Case } from "@/types/Case";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const MyPageContainer = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [myCases, setMyCases] = useState<Case[]>([]);
  const [bookmarks, setBookmarks] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  // 유저 데이터 가져오기
  useEffect(() => {
    if (!user.isSignIn) {
      router.push("/auth/sign-in");
      return;
    }

    fetchUserData();
  }, [user.isSignIn, router]);

  // 유저 데이터 가져오기
  const fetchUserData = async () => {
    setLoading(true);

    // 내 사례 가져오기
    const { data: casesData } = await getUserCases();
    if (casesData) {
      setMyCases(casesData);
    }

    // 북마크 가져오기
    const { data: bookmarksData } = await getUserBookmarks();
    if (bookmarksData) {
      console.log("bookmarksData", bookmarksData);
      setBookmarks(bookmarksData.flat());
    }
    setLoading(false);
  };

  // 탭 변경
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 케이스 삭제
  const handleDeleteCase = async (caseId: number) => {
    if (confirm("정말로 이 사례를 삭제하시겠습니까?")) {
      await deleteCase(caseId);
      setMyCases((prev) => prev.filter((item) => item.id !== caseId));
    }
  };

  // 북마크 제거
  const handleRemoveBookmark = async (caseId: number) => {
    await removeBookmark(caseId);
    setBookmarks((prev) => prev.filter((item) => item.id !== caseId));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ProfileSection>
        <Avatar sx={{ width: 80, height: 80 }}>
          <PersonOutline fontSize="large" />
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h5" gutterBottom>
            {user.email ? user.email.split("@")[0] : "사용자"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
        </Box>
      </ProfileSection>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="마이페이지 탭">
          <Tab label="내 사례" />
          <Tab label="북마크" />
        </Tabs>
      </Box>

      {loading ? (
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            데이터를 불러오는 중입니다...
          </Typography>
        </LoadingContainer>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            {myCases.length === 0 ? (
              <EmptyState>
                <Typography variant="h6" gutterBottom>
                  등록한 사례가 없습니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  새로운 사례를 등록해보세요.
                </Typography>
                <Button variant="contained" href="/case/new">
                  새 사례 등록하기
                </Button>
              </EmptyState>
            ) : (
              <List>
                {myCases.map((caseItem) => (
                  <ListItem
                    key={caseItem.id}
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" aria-label="edit" href={`/case/edit/${caseItem.id}`}>
                          <EditOutlined />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCase(caseItem.id)}>
                          <DeleteOutline />
                        </IconButton>
                      </Box>
                    }
                    disablePadding
                    sx={{ mb: 2 }}
                  >
                    <StyledListItemButton href={`/case/${caseItem.id}`}>
                      <ListItemAvatar>
                        <Avatar>
                          <GavelRounded />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={caseItem.title}
                        secondary={
                          <>
                            <Typography variant="body2" component="span" color="textSecondary">
                              {dayjs(caseItem.created_at).format("YYYY년 MM월 DD일")}
                            </Typography>
                            <StatusChip
                              label={caseItem.status === "completed" ? "판결 완료" : "판결 중"}
                              size="small"
                              color={caseItem.status === "completed" ? "success" : "warning"}
                              sx={{ ml: 1 }}
                            />
                          </>
                        }
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {bookmarks.length === 0 ? (
              <EmptyState>
                <Typography variant="h6" gutterBottom>
                  북마크한 사례가 없습니다.
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  관심 있는 사례를 북마크해보세요.
                </Typography>
                <Button variant="contained" href="/cases">
                  사례 둘러보기
                </Button>
              </EmptyState>
            ) : (
              <List>
                {bookmarks.map((caseItem) => (
                  <ListItem
                    key={caseItem.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="remove bookmark"
                        onClick={() => handleRemoveBookmark(caseItem.id)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    }
                    disablePadding
                    sx={{ mb: 2 }}
                  >
                    <StyledListItemButton href={`/case/${caseItem.id}`}>
                      <ListItemAvatar>
                        <Avatar>
                          <BookmarkOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={caseItem.title}
                        secondary={dayjs(caseItem.created_at).format("YYYY년 MM월 DD일")}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default MyPageContainer;

const ProfileSection = styled(Box)`
  ${mixinFlex("row")};
  align-items: center;
`;

const EmptyState = styled(Box)`
  ${mixinFlex("column")};
  align-items: center;
  text-align: center;
  padding: 48px 0;
`;

const StyledListItemButton = styled(Link)`
  display: flex;
  padding: 8px 16px;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

const StatusChip = styled(Chip)`
  font-weight: 500;
`;

const LoadingContainer = styled(Box)`
  ${mixinFlex("column")};
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  width: 100%;
`;
