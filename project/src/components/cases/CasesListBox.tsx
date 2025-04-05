"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  styled,
  SelectChangeEvent,
  CircularProgress,
  Stack,
} from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import { SortOutlined } from "@mui/icons-material";
import { getCases } from "@/service/cases";
import { Case as CaseType } from "@/types/Case";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter, useSearchParams } from "next/navigation";
import InstallPWA from "../common/InstallPWA";
import Case from "./Case";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const categories = [
  { value: "", label: "전체 카테고리" },
  { value: "데이트", label: "데이트" },
  { value: "금전", label: "금전 문제" },
  { value: "생활습관", label: "생활습관" },
  { value: "가치관", label: "가치관" },
  { value: "미래계획", label: "미래계획" },
  { value: "의사소통", label: "의사소통" },
  { value: "기타", label: "기타" },
];

const CasesListBox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  const [cases, setCases] = useState<CaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const limit = 10;

  useEffect(() => {
    // URL 파라미터에서 초기값 설정
    const pageParam = searchParams.get("page");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");

    if (pageParam) setPage(parseInt(pageParam));
    if (categoryParam) setCategory(categoryParam);
    if (searchParam) setSearchTerm(searchParam);
    if (sortParam) setSortBy(sortParam);

    fetchCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const { data, count } = await getCases(page, limit, category);

      // 검색어 필터링 (클라이언트 사이드)
      let filteredData = data;
      if (searchTerm) {
        filteredData = data?.filter(
          (item: CaseType) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // 정렬
      filteredData?.sort((a: CaseType, b: CaseType) => {
        if (sortBy === "latest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === "popular") {
          return b.view_count - a.view_count;
        }
        return 0;
      });

      setCases(filteredData || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("사례 목록 로딩 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    updateUrlParams({ page: value.toString() });
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    setPage(1); // 카테고리 변경 시 첫 페이지로
    updateUrlParams({ category: event.target.value, page: "1" });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    // 디바운스 처리를 위한 타이머 설정
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      updateUrlParams({ search: newSearchTerm, page: "1" });
    }, 500); // 500ms 디바운스
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    updateUrlParams({ sort: event.target.value });
  };

  const updateUrlParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.push(`/cases?${newParams.toString()}`);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (cases.length === 0) {
    return (
      <EmptyContainer>
        <Typography variant="h6" align="center">
          등록된 사례가 없습니다.
        </Typography>
      </EmptyContainer>
    );
  }

  return (
    <Suspense>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          사례 모음
        </Typography>

        <Typography variant="body1" color="textSecondary" paragraph>
          다양한 연애 갈등 사례와 AI 판결 결과를 확인해보세요.
        </Typography>

        <FilterSection>
          <SearchBox>
            <TextField
              fullWidth
              placeholder="제목, 내용, 태그로 검색"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBox>

          <FilterControls>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>카테고리</InputLabel>
              <Select value={category} label="카테고리" onChange={handleCategoryChange}>
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>정렬</InputLabel>
              <Select
                value={sortBy}
                label="정렬"
                onChange={handleSortChange}
                startAdornment={<SortOutlined sx={{ mr: 1 }} />}
              >
                <MenuItem value="latest">최신순</MenuItem>
                <MenuItem value="popular">인기순</MenuItem>
              </Select>
            </FormControl>
          </FilterControls>
        </FilterSection>

        <CasesContainer>
          {cases.map((caseItem) => (
            <Case key={caseItem.id} caseItem={caseItem} hot={false} />
          ))}
        </CasesContainer>

        {totalCount > limit && (
          <PaginationContainer>
            <Pagination count={Math.ceil(totalCount / limit)} page={page} onChange={handlePageChange} color="primary" />
          </PaginationContainer>
        )}
      </Container>
      <InstallPWA />
    </Suspense>
  );
};

export default CasesListBox;

const FilterSection = styled(Box)`
  margin-bottom: 24px;
`;

const SearchBox = styled(Box)`
  margin-bottom: 16px;
`;

const FilterControls = styled(Box)`
  ${mixinFlex("row")};
  gap: 16px;
  flex-wrap: wrap;
`;

const CasesContainer = styled(Stack)`
  width: 100%;
  row-gap: 16px;
  margin-top: 16px;
`;

const LoadingContainer = styled(Box)`
  ${mixinFlex("row")};
  justify-content: center;
  padding: 48px 0;
`;

const EmptyContainer = styled(Box)`
  padding: 48px 0;
`;

const PaginationContainer = styled(Box)`
  ${mixinFlex("row")};
  justify-content: center;
  margin-top: 32px;
`;
