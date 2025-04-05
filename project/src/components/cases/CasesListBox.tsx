"use client"; // Next.js 클라이언트 컴포넌트 선언

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Container,
  MenuItem,
  Pagination,
  TextField,
  Typography,
  styled,
  CircularProgress,
  Stack,
  IconButton,
  Menu,
} from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import { LocalFireDepartmentRounded, SortOutlined } from "@mui/icons-material";
import { getCases, getHotCase } from "@/service/cases";
import { Case as CaseType } from "@/types/Case";
import { useRouter, useSearchParams } from "next/navigation";
import InstallPWA from "../common/InstallPWA";
import Case from "./Case";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination as SwiperPagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 하위 컴포넌트: HOT 케이스 섹션
const HotCaseSection = ({ hotCases }: { hotCases: CaseType[] }) => {
  if (hotCases.length === 0) return null;

  return (
    <Stack spacing={2} mb={4}>
      {/* HOT 아이콘 + 텍스트 */}
      <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
        <LocalFireDepartmentRounded color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" color="primary" gutterBottom align="center" fontWeight="bold">
          HOT
        </Typography>
      </Stack>

      {/* HOT 케이스 스와이퍼 */}
      <HotCaseListSwiper
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[SwiperPagination, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
      >
        {hotCases.map((caseItem, idx) => (
          <SwiperItem key={idx}>
            <Case caseItem={caseItem} hot={true} />
          </SwiperItem>
        ))}
      </HotCaseListSwiper>
    </Stack>
  );
};

// 하위 컴포넌트: 필터 섹션
const FilterBar = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortSelect,
}: {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: string;
  onSortSelect: (value: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (value: string) => {
    onSortSelect(value);
    handleMenuClose();
  };

  return (
    <FilterSection>
      <SearchBox>
        <TextField
          fullWidth
          placeholder="제목을 검색해주세요."
          value={searchTerm}
          onChange={onSearchChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "primary.main",
              },
              "&:hover fieldset": {
                borderColor: "primary.dark",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </SearchBox>

      <SortButton onClick={handleMenuOpen} color="primary">
        <SortOutlined />
      </SortButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleSort("latest")} selected={sortBy === "latest"}>
          최신순
        </MenuItem>
        <MenuItem onClick={() => handleSort("popular")} selected={sortBy === "popular"}>
          인기순
        </MenuItem>
      </Menu>
    </FilterSection>
  );
};

// 하위 컴포넌트: 케이스 목록
const CasesList = ({ cases }: { cases: CaseType[] }) => {
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
    <CasesContainer>
      {cases.map((caseItem) => (
        <Case key={caseItem.id} caseItem={caseItem} hot={false} />
      ))}
    </CasesContainer>
  );
};

// 메인 컴포넌트
const CasesListBox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // 상태 관리
  const [cases, setCases] = useState<CaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [hotCase, setHotCase] = useState<CaseType[]>([]);

  const limit = 10;

  // URL 파라미터 업데이트 함수 (메모이제이션)
  const updateUrlParams = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      router.push(`/cases?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  // 인기 케이스 가져오기
  useEffect(() => {
    const fetchHotCase = async () => {
      const { data, error } = await getHotCase();
      if (!error && data) {
        setHotCase(data);
      }
    };

    fetchHotCase();
  }, []);

  // URL 파라미터에서 초기값 설정 및 케이스 가져오기
  useEffect(() => {
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

  // 케이스 목록 가져오기 (메모이제이션)
  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const { data, count } = await getCases(page, limit, category);

      // 검색어 필터링
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
  }, [page, limit, category, searchTerm, sortBy]);

  // 이벤트 핸들러 (메모이제이션)
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      updateUrlParams({ page: value.toString() });
    },
    [updateUrlParams]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = event.target.value;
      setSearchTerm(newSearchTerm);

      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }

      searchTimer.current = setTimeout(() => {
        updateUrlParams({ search: newSearchTerm, page: "1" });
      }, 500);
    },
    [updateUrlParams]
  );

  const handleSortSelect = useCallback(
    (value: string) => {
      setSortBy(value);
      updateUrlParams({ sort: value });
    },
    [updateUrlParams]
  );

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  // 메인 컴포넌트 렌더링
  return (
    <Suspense>
      <Container maxWidth="md" sx={{ py: 2 }}>
        {/* HOT 케이스 섹션 */}
        <HotCaseSection hotCases={hotCase} />

        {/* 필터 섹션 */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortSelect={handleSortSelect}
        />

        {/* 케이스 목록 */}
        <CasesList cases={cases} />

        {/* 페이지네이션 */}
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

// 스타일 컴포넌트 정의
const FilterSection = styled(Stack)`
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
  margin-bottom: 16px;
`;

const HotCaseListSwiper = styled(Swiper)`
  height: 250px;
  padding: 16px;

  .swiper-pagination-bullet {
    background-color: ${({ theme }) => theme.palette.grey[400]};
    opacity: 0.5;
    width: 10px;
    height: 10px;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.palette.primary.main};
    opacity: 1;
  }
`;

const SwiperItem = styled(SwiperSlide)`
  width: 100%;
  height: 100%;
  ${mixinFlex("column")};
`;

const SearchBox = styled(Box)`
  flex: 1;
`;

const SortButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: white;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.dark};
  }
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
