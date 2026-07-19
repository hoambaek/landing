import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    root: __dirname,
  },
  // 브랜드 소개서 PDF는 public 밖(비공개)에 두되, 승인·발송 API 함수 번들에 포함시킨다.
  outputFileTracingIncludes: {
    "/api/admin/brandbook/send": ["./private-assets/**"],
  },
  // 옛 URL 정리 (구글 서치 콘솔 404 해소, 2026-07-19)
  async redirects() {
    return [
      // 블로그가 blog.musedemaree.com 서브도메인으로 이전됨 — 루트의 옛 글 URL을 영구 이전
      {
        source: "/post/:slug",
        destination: "https://blog.musedemaree.com/post/:slug",
        permanent: true,
      },
      // 옛 단독 문의 페이지 → 현재 파트너 페이지
      { source: "/partnership", destination: "/partner", permanent: true },
    ];
  },
};

export default nextConfig;
