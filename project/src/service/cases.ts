import api from "@/lib/apiClient";
import { supabase } from "@/lib/supabaseClient";
import { CaseInput } from "@/types/Case";
import { VoteStats } from "@/types/Vote";
import { getFcmToken, requestNotificationPermission } from "@/utils/pushNotification";
import { closeSnackbar, enqueueSnackbar } from "notistack";

////////// 핫 케이스 조회
export async function getHotCase() {
  const response = await supabase
    .from("cases")
    .select("*, view_counts(count)")
    .order("view_counts(count)", { ascending: false })
    .limit(3);

  // 데이터 형식 변환: view_counts: {count: 0} -> view_count: 0
  const formattedData = response.data?.map((item) => {
    const { view_counts, ...rest } = item;
    return {
      ...rest,
      view_count: view_counts?.count || 0,
    };
  });

  return { data: formattedData, error: response.error };
}

////////// 새로운 케이스 생성
export async function createCase(caseData: CaseInput) {
  // 로그인 여부 확인
  const response = await supabase.auth.getUser();

  // 알림 권한 요청
  const { error: notificationPermissionError } = await requestNotificationPermission();

  if (notificationPermissionError) {
    enqueueSnackbar(notificationPermissionError, { variant: "error" });
  }

  // 판결 시작
  const verdictRequestSnackbarKey = enqueueSnackbar("판결 요청 중...", {
    variant: "info",
    persist: true, // 사용자가 닫을 때까지 스낵바 유지
    autoHideDuration: null, // 자동으로 닫히지 않도록 설정
  });

  // FCM 토큰 발급
  const { data: fcmToken, error: fcmTokenError } = await getFcmToken();

  if (fcmTokenError) {
    enqueueSnackbar(fcmTokenError, { variant: "error" });
  }

  // 케이스 데이터 추출
  const { intensity, character, ...restCaseData } = caseData;

  // 케이스 생성
  const caseResponse = await supabase
    .from("cases")
    .insert({
      ...restCaseData,
      user_id: response.data.user?.id,
      status: "pending",
      view_count: 0,
      fcm_token: fcmToken,
    })
    .select();

  if (caseResponse.error) {
    enqueueSnackbar("판결 요청 실패", { variant: "error" });
    return;
  } else {
    closeSnackbar(verdictRequestSnackbarKey);
    enqueueSnackbar("판결 요청 성공", { variant: "success" });
    // 조회수 초기화
    await supabase
      .from("view_counts")
      .insert({
        id: caseResponse.data[0].id,
        count: 0,
      })
      .select();
  }

  // AI 판결 생성 요청
  const snackbarKey = enqueueSnackbar("판결 중...", {
    variant: "info",
    persist: true, // 사용자가 닫을 때까지 스낵바 유지
    autoHideDuration: null, // 자동으로 닫히지 않도록 설정
  });

  // AI 판결 생성 요청
  const { data: verdictsResponse } = await api.post("/verdicts/generate", {
    case_id: caseResponse.data[0].id,
    intensity: intensity,
    character: character,
  });

  if (verdictsResponse.error) {
    enqueueSnackbar("판결 실패", { variant: "error" });
    return;
  }

  // AI 판결 생성 결과 저장
  const { error: insertVerdictError } = await supabase
    .from("verdicts")
    .insert({ ...JSON.parse(verdictsResponse.data), case_id: caseResponse.data[0].id });

  if (insertVerdictError) {
    closeSnackbar(snackbarKey);
    enqueueSnackbar("판결 실패", { variant: "error" });
    return;
  }

  // 판결 생성 완료 알림
  closeSnackbar(snackbarKey);
  enqueueSnackbar("판결 완료", { variant: "success" });

  return { data: caseResponse.data[0] };
}

////////// 케이스 ID로 조회
export async function getCaseById(id: number) {
  const response = await supabase.from("cases").select("*").eq("id", id).single();

  if (response.error) {
    enqueueSnackbar("케이스 조회 중 오류가 발생했습니다.", { variant: "error" });
    return response;
  }

  // 조회수 조회
  const viewCountResponse = await supabase.from("view_counts").select("count").eq("id", id).single();

  // 조회수가 있으면 조회수 증가
  if (viewCountResponse.error) {
    return viewCountResponse;
  } else {
    // 조회수 증가
    const updateResponse = await supabase
      .from("view_counts")
      .update({ id: id, count: viewCountResponse.data?.count + 1 })
      .eq("id", id);

    if (updateResponse.error) {
      return updateResponse;
    }
  }

  const returnData = { ...response.data, view_count: viewCountResponse.data?.count };

  return { data: returnData, error: response.error };
}

////////// 모든 케이스 조회 (페이지네이션)
export async function getCases(page = 1, limit = 10, category?: string) {
  let query = supabase
    .from("cases")
    .select("*, view_counts(count)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const response = await query;

  // 데이터 형식 변환: view_counts: {count: 0} -> view_count: 0
  const formattedData = response.data?.map((item) => {
    const { view_counts, ...rest } = item;
    return {
      ...rest,
      view_count: view_counts?.count || 0,
    };
  });

  return { data: formattedData, count: response.count, error: response.error };
}

////////// 다음/이전 케이스 조회
export async function getPrevNextCase(caseId: number) {
  // 이전 케이스: 현재 ID보다 작은 ID 중에서 가장 큰 ID를 가진 케이스
  const prevCase = await supabase
    .from("cases")
    .select("*")
    .lt("id", caseId) // id < 현재 id
    .order("id", { ascending: false }) // id 내림차순 정렬
    .limit(1); // 첫 번째 결과만 가져옴

  // 다음 케이스: 현재 ID보다 큰 ID 중에서 가장 작은 ID를 가진 케이스
  const nextCase = await supabase
    .from("cases")
    .select("*")
    .gt("id", caseId) // id > 현재 id
    .order("id", { ascending: true }) // id 오름차순 정렬
    .limit(1); // 첫 번째 결과만 가져옴

  // 응답 데이터
  const responseData = {
    prev: prevCase.data?.[0],
    next: nextCase.data?.[0],
  };

  return { data: responseData, error: prevCase.error || nextCase.error };
}

////////// 투표하기
export async function voteOnCase(caseId: number, vote: "person_a" | "person_b" | "both" | "neither") {
  // 로그인 확인
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error) {
    enqueueSnackbar("투표하려면 로그인이 필요합니다.", { variant: "warning" });
    return userResponse;
  }

  // 이전 투표 확인 및 삭제
  const existingVoteResponse = await supabase
    .from("votes")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", userResponse.data.user.id)
    .single();

  if (existingVoteResponse.data) {
    await supabase.from("votes").delete().eq("id", existingVoteResponse.data.id);
  }

  // 새 투표 추가
  const response = await supabase
    .from("votes")
    .insert({
      case_id: caseId,
      user_id: userResponse.data.user.id,
      vote,
    })
    .select()
    .single();

  if (response.error) {
    enqueueSnackbar("투표 추가 실패", { variant: "error" });
    return response;
  }

  enqueueSnackbar("투표 추가 성공", { variant: "success" });

  return response;
}

////////// 케이스 투표 통계 조회
export async function getCaseVoteStats(caseId: number) {
  const response = await supabase.from("votes").select("vote").eq("case_id", caseId);

  if (response.error) {
    enqueueSnackbar("투표 현황 조회 실패", { variant: "error" });
    return response;
  }

  const stats: VoteStats = {
    person_a: 0,
    person_b: 0,
    both: 0,
    neither: 0,
    total: response.data?.length || 0,
  };

  // 명시적 타입 인터페이스 정의
  interface VoteRecord {
    vote: keyof VoteStats;
  }

  // 각 투표 개수만큼 증가하여 통계 업데이트
  response.data?.forEach((item: VoteRecord) => {
    stats[item.vote]++;
  });

  return { data: stats, error: null };
}

////////// 댓글 조회
export async function getComments(caseId: number) {
  const response = await supabase.from("comments").select("*").eq("case_id", caseId);
  return response;
}

////////// 댓글 추가
export async function addComment(caseId: number, comment: string, nickname: string) {
  const response = await supabase
    .from("comments")
    .insert({ case_id: caseId, comment: comment, nickname: nickname })
    .select();

  return response;
}

////////// 케이스 북마크
export async function bookmarkCase(caseId: number) {
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error) {
    enqueueSnackbar("북마크하려면 로그인이 필요합니다.", { variant: "warning" });
    return userResponse;
  }

  // 이미 북마크했는지 확인
  const existingBookmarkResponse = await supabase
    .from("bookmarks")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", userResponse.data.user.id)
    .single();

  // 이미 북마크 했다면
  if (existingBookmarkResponse.data) {
    // 북마크 해제
    const response = await supabase.from("bookmarks").delete().eq("id", existingBookmarkResponse.data.id);

    if (response.error) {
      enqueueSnackbar("북마크가 해제 실패", { variant: "error" });
      return response;
    } else {
      enqueueSnackbar("북마크가 해제되었습니다.", { variant: "success" });
      return response;
    }
  } else {
    // 북마크 추가
    const response = await supabase.from("bookmarks").insert({
      case_id: caseId,
      user_id: userResponse.data.user.id,
    });

    if (response.error) {
      enqueueSnackbar("북마크 추가 실패", { variant: "error" });
      return response;
    } else {
      enqueueSnackbar("북마크가 추가되었습니다.", { variant: "success" });
      return response;
    }
  }
}

////////// 사용자 북마크 확인
export async function checkBookmark(caseId: number) {
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error) {
    return userResponse;
  }

  // 북마크 확인
  const response = await supabase
    .from("bookmarks")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", userResponse.data.user.id)
    .single();

  if (response.error) {
    return response;
  } else {
    return response;
  }
}

////////// 사용자의 사례 가져오기
export async function getUserCases() {
  const userResponse = await supabase.auth.getUser();
  const response = await supabase.from("cases").select("*").eq("user_id", userResponse.data.user?.id);

  return response;
}

////////// 사용자의 북마크 가져오기
export async function getUserBookmarks() {
  const userResponse = await supabase.auth.getUser();
  const response = await supabase.from("bookmarks").select("cases(*)").eq("user_id", userResponse.data.user?.id);

  if (response.error) {
    return response;
  } else {
    // 북마크 데이터 형식 변환
    const formattedData = response.data?.map((item) => item.cases);
    return { data: formattedData, error: response.error };
  }
}

////////// 사례 삭제하기
export async function deleteCase(caseId: number) {
  const response = await supabase.from("cases").delete().eq("id", caseId);

  if (response.error) {
    enqueueSnackbar("사례 삭제 실패", { variant: "error" });
    return response;
  } else {
    enqueueSnackbar("사례가 삭제되었습니다.", { variant: "success" });
    return response;
  }
}

////////// 북마크 제거하기
export async function removeBookmark(caseId: number) {
  const userResponse = await supabase.auth.getUser();
  const response = await supabase
    .from("bookmarks")
    .delete()
    .eq("case_id", caseId)
    .eq("user_id", userResponse.data.user?.id);

  if (response.error) {
    enqueueSnackbar("북마크 제거 실패", { variant: "error" });
    return response;
  } else {
    enqueueSnackbar("북마크가 제거되었습니다.", { variant: "success" });
    return response;
  }
}

////////// 케이스 ID로 판결 조회
export async function getVerdictByCaseId(caseId: number) {
  const response = await supabase.from("verdicts").select("*").eq("case_id", caseId).single();

  if (response.error && response.error.code !== "PGRST116") {
    throw response.error;
  }

  return response;
}
