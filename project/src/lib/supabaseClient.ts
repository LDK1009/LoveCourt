/**
 * [설명]
 * Supabase 클라이언트 모듈(다른 파일에서 supabase 모듈을 임포트하여 사용합니다.)
 * .env 파일의 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수를 사용합니다.
 * 
 * [참고]
 * .env 파일이 작성되지 않았다면 아래 링크를 참고해주세요.
 * https://sooncoding.tistory.com/265
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
