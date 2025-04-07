import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 기본 URL 목록
  const baseUrls = [
    {
      url: "https://www.love-court.site/",
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: "https://www.love-court.site/cases",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.love-court.site/case/new",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.love-court.site/auth/sign-in",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.love-court.site/my-page",
      lastModified: new Date(),
      priority: 0.8,
    },
  ];

  // 데이터베이스에서 모든 케이스 가져오기
  const { data: cases, error } = await supabase
    .from("cases")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("사이트맵 생성 중 오류 발생:", error);
    return baseUrls;
  }

  // 케이스 URL 생성
  const caseUrls = cases.map((caseItem) => ({
    url: `https://www.love-court.site/case/${caseItem.id}`,
    lastModified: new Date(caseItem.updated_at || new Date()),
    priority: 0.7,
  }));

  // 모든 URL 합치기
  return [...baseUrls, ...caseUrls];
}