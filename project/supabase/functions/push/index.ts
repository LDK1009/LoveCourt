// 이 파일에서 ts및 eslint오류 무시
/* eslint-disable */
// @ts-nocheck

// Supabase 클라이언트 라이브러리와 Google 인증 라이브러리 가져오기
import { createClient } from 'npm:@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library@9'
// Firebase 서비스 계정 정보 가져오기
import serviceAccount from '../service-account.json' with { type: 'json' }

interface Comment {
  id : number;
  case_id:number;
  nickname:string;
  comment:string;
  created_at:string;
}

// Supabase 웹훅에서 전송되는 페이로드 구조 정의
interface WebhookPayload {
  type: 'INSERT'    // 데이터베이스 작업 유형 (여기서는 새 레코드 삽입)
  table: string     // 변경된 테이블 이름
  record: Comment  // 삽입된 알림 레코드
  schema: 'public'  // 데이터베이스 스키마
}

// Supabase 클라이언트 초기화 (환경 변수에서 URL과 서비스 롤 키 가져옴)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Deno 서버 함수 정의 - 웹훅 요청 처리
Deno.serve(async (req) => {
  // 요청 본문에서 웹훅 페이로드 파싱
  const payload: WebhookPayload = await req.json()

  // Supabase에서 사용자의 FCM 토큰 조회
  const { data } = await supabase
    .from('cases')
    .select('fcm_token')
    .eq('id', payload.record.case_id)  // 알림 대상 사용자 ID로 필터링
    .single()  // 단일 결과 반환

  // FCM 토큰 추출
  const fcmToken = data!.fcm_token as string

  // Firebase 메시징 API 접근을 위한 액세스 토큰 획득
  const accessToken = await getAccessToken({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  })

  // Firebase Cloud Messaging API 호출하여 푸시 알림 전송
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,  // 인증 토큰 설정
      },
      body: JSON.stringify({
        message: {
          token: fcmToken,  // 사용자 기기의 FCM 토큰
          notification: {
            title: `연애재판 | 배심원 평결이 도착했어요!`,  // 알림 제목
            body: payload.record.comment,  // 알림 내용
          },
        },
      }),
    }
  )

  // API 응답 처리
  const resData = await res.json()
  // 오류 응답 처리 (HTTP 상태 코드가 200-299 범위 외인 경우)
  if (res.status < 200 || 299 < res.status) {
    throw resData
  }

  // 성공 응답 반환
  return new Response(JSON.stringify(resData), {
    headers: { 'Content-Type': 'application/json' },
  })
})

// Firebase 메시징 API 접근을 위한 액세스 토큰 생성 함수
const getAccessToken = ({
  clientEmail,
  privateKey,
}: {
  clientEmail: string  // 서비스 계정 이메일
  privateKey: string   // 서비스 계정 비공개 키
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Google JWT 클라이언트 생성
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],  // Firebase 메시징 API 접근 범위
    })
    // 인증 토큰 요청
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens!.access_token!)  // 액세스 토큰 반환
    })
  })
}