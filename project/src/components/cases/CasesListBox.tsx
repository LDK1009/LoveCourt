"use client"; // Next.js 클라이언트 컴포넌트 선언

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
} from "@mui/material"; // Material UI 컴포넌트 가져오기
import { mixinFlex } from "@/styles/mixins"; // 스타일 믹스인 가져오기
import { LocalFireDepartmentRounded, SortOutlined } from "@mui/icons-material"; // 아이콘 가져오기
import { getCases, getHotCase } from "@/service/cases"; // 케이스 관련 API 함수 가져오기
import { Case as CaseType } from "@/types/Case"; // 케이스 타입 가져오기
import { useRouter, useSearchParams } from "next/navigation"; // Next.js 라우팅 훅 가져오기
import InstallPWA from "../common/InstallPWA"; // PWA 설치 컴포넌트 가져오기
import Case from "./Case"; // 케이스 컴포넌트 가져오기
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper 컴포넌트 가져오기
import { Pagination as SwiperPagination, Autoplay } from "swiper/modules"; // Swiper 모듈 가져오기
import "swiper/css"; // Swiper 기본 스타일
import "swiper/css/pagination"; // Swiper 페이지네이션 스타일

// 카테고리 목록 정의
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
  const router = useRouter(); // 라우터 훅
  const searchParams = useSearchParams(); // URL 검색 파라미터 훅
  const searchTimer = useRef<NodeJS.Timeout | null>(null); // 검색 디바운스 타이머 참조

  // 상태 관리
  const [cases, setCases] = useState<CaseType[]>([]); // 케이스 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [totalCount, setTotalCount] = useState(0); // 전체 케이스 수
  const [page, setPage] = useState(1); // 현재 페이지
  const [category, setCategory] = useState(""); // 선택된 카테고리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [sortBy, setSortBy] = useState("latest"); // 정렬 기준
  const [hotCase, setHotCase] = useState<CaseType[] | []>([]); // 인기 케이스 목록

  const limit = 10; // 페이지당 표시할 케이스 수

  // 인기 케이스 가져오기
  useEffect(() => {
    const fetchHotCase = async () => {
      const { data, error } = await getHotCase(); // API 호출

      if (error) {
        return; // 오류 발생 시 처리 중단
      } else {
        setHotCase(data || []); // 데이터가 없으면 빈 배열 사용
      }
    };

    fetchHotCase(); // 함수 호출
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // URL 파라미터에서 초기값 설정 및 케이스 가져오기
  useEffect(() => {
    // URL 파라미터에서 초기값 설정
    const pageParam = searchParams.get("page");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");

    // URL 파라미터가 있으면 상태 업데이트
    if (pageParam) setPage(parseInt(pageParam));
    if (categoryParam) setCategory(categoryParam);
    if (searchParam) setSearchTerm(searchParam);
    if (sortParam) setSortBy(sortParam);

    fetchCases(); // 케이스 목록 가져오기
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // URL 파라미터 변경 시 실행

  // 케이스 목록 가져오기
  const fetchCases = async () => {
    try {
      setLoading(true); // 로딩 상태 시작
      const { data, count } = await getCases(page, limit, category); // API 호출

      // 검색어 필터링 (클라이언트 사이드)
      let filteredData = data;
      if (searchTerm) {
        filteredData = data?.filter(
          (item: CaseType) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) || // 제목 검색
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) || // 설명 검색
            item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) // 태그 검색
        );
      }

      // 정렬
      filteredData?.sort((a: CaseType, b: CaseType) => {
        if (sortBy === "latest") {
          // 최신순 정렬
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === "popular") {
          // 인기순 정렬
          return b.view_count - a.view_count;
        }
        return 0;
      });

      setCases(filteredData || []); // 케이스 목록 업데이트
      setTotalCount(count || 0); // 전체 케이스 수 업데이트
    } catch (error) {
      console.error("사례 목록 로딩 중 오류:", error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // 페이지 상태 업데이트
    updateUrlParams({ page: value.toString() }); // URL 파라미터 업데이트
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value); // 카테고리 상태 업데이트
    setPage(1); // 카테고리 변경 시 첫 페이지로 이동
    updateUrlParams({ category: event.target.value, page: "1" }); // URL 파라미터 업데이트
  };

  // 검색어 변경 핸들러 (디바운스 적용)
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm); // 검색어 상태 업데이트

    // 디바운스 처리를 위한 타이머 설정
    if (searchTimer.current) {
      clearTimeout(searchTimer.current); // 이전 타이머 취소
    }

    // 새 타이머 설정 (500ms 후 실행)
    searchTimer.current = setTimeout(() => {
      updateUrlParams({ search: newSearchTerm, page: "1" }); // URL 파라미터 업데이트
    }, 500); // 500ms 디바운스
  };

  // 정렬 기준 변경 핸들러
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value); // 정렬 기준 상태 업데이트
    updateUrlParams({ sort: event.target.value }); // URL 파라미터 업데이트
  };

  // URL 파라미터 업데이트 함수
  const updateUrlParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString()); // 현재 URL 파라미터 복사

    // 파라미터 업데이트
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value); // 값이 있으면 설정
      } else {
        newParams.delete(key); // 값이 없으면 삭제
      }
    });

    router.push(`/cases?${newParams.toString()}`); // 새 URL로 이동
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  // 케이스가 없을 때 표시할 컴포넌트
  if (cases.length === 0) {
    return (
      <EmptyContainer>
        <Typography variant="h6" align="center">
          등록된 사례가 없습니다.
        </Typography>
      </EmptyContainer>
    );
  }

  // 메인 컴포넌트 렌더링
  return (
    <Suspense>
      <Container maxWidth="md" sx={{ py: 2 }}>
        {/* HOT 게시물 섹션 */}
        <Stack spacing={2} mb={4}>
          {/* HOT 아이콘 + 텍스트 */}
          <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
            <LocalFireDepartmentRounded color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" color="primary" gutterBottom align="center" fontWeight="bold">
              인기 사례
            </Typography>
          </Stack>

          {/* HOT 케이스 스와이퍼 */}
          <HotCaseListSwiper
            spaceBetween={30} // 슬라이드 간 간격
            slidesPerView={1} // 한 번에 보여줄 슬라이드 수
            pagination={{ clickable: true }} // 클릭 가능한 페이지네이션
            modules={[SwiperPagination, Autoplay]} // 사용할 모듈
            autoplay={{ delay: 3000, disableOnInteraction: false }} // 자동 재생 설정
            loop={true} // 무한 루프 설정 추가
          >
            {/* HOT 케이스 목록 */}
            {hotCase.length > 0 &&
              hotCase.map((caseItem, idx) => (
                <SwiperItem key={idx}>
                  <Case caseItem={caseItem} hot={true} />
                </SwiperItem>
              ))}
          </HotCaseListSwiper>
        </Stack>

        {/* 필터 섹션 */}
        <FilterSection>
          {/* 검색 박스 */}
          <SearchBox>
            <TextField
              fullWidth
              placeholder="제목, 내용, 태그로 검색"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBox>

          {/* 필터 컨트롤 (카테고리, 정렬) */}
          <FilterControls>
            {/* 카테고리 선택 */}
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

            {/* 정렬 기준 선택 */}
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

        {/* 케이스 목록 */}
        <CasesContainer>
          {cases.map((caseItem) => (
            <Case key={caseItem.id} caseItem={caseItem} hot={false} />
          ))}
        </CasesContainer>

        {/* 페이지네이션 (전체 케이스 수가 페이지당 표시 수보다 많을 때만 표시) */}
        {totalCount > limit && (
          <PaginationContainer>
            <Pagination count={Math.ceil(totalCount / limit)} page={page} onChange={handlePageChange} color="primary" />
          </PaginationContainer>
        )}
      </Container>
      {/* PWA 설치 배너 */}
      <InstallPWA />
    </Suspense>
  );
};

export default CasesListBox;

// 스타일 컴포넌트 정의
const FilterSection = styled(Box)`
  margin-bottom: 24px;
`;


// HOT 케이스 스와이퍼 스타일
const HotCaseListSwiper = styled(Swiper)`
  height: 250px;
  padding: 16px;

  /* 페이지네이션 컬러 변경 */
  .swiper-pagination-bullet {
    background-color: ${({ theme }) => theme.palette.grey[400]};
    opacity: 0.5;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.palette.primary.main};
    opacity: 1;
  }

  /* 페이지네이션 크기 조정 (선택 사항) */
  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
  }
`;

const SwiperItem = styled(SwiperSlide)`
  width: 100%;
  height: 100%;
  ${mixinFlex("column")};
`;

// 검색 박스 스타일
const SearchBox = styled(Box)`
  margin-bottom: 16px;
`;

// 필터 컨트롤 스타일
const FilterControls = styled(Box)`
  ${mixinFlex("row")}; // 가로 방향 플렉스 레이아웃
  gap: 16px; // 요소 간 간격
  flex-wrap: wrap; // 화면 크기에 따라 줄바꿈
`;

// 케이스 컨테이너 스타일
const CasesContainer = styled(Stack)`
  width: 100%;
  row-gap: 16px; // 케이스 카드 간 세로 간격
  margin-top: 16px;
`;

// 로딩 컨테이너 스타일
const LoadingContainer = styled(Box)`
  ${mixinFlex("row")}; // 가로 방향 플렉스 레이아웃
  justify-content: center; // 가운데 정렬
  padding: 48px 0;
`;

// 빈 결과 컨테이너 스타일
const EmptyContainer = styled(Box)`
  padding: 48px 0;
`;

// 페이지네이션 컨테이너 스타일
const PaginationContainer = styled(Box)`
  ${mixinFlex("row")}; // 가로 방향 플렉스 레이아웃
  justify-content: center; // 가운데 정렬
  margin-top: 32px;
`;
