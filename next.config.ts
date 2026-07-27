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
  /* public/ 아래 이미지에 캐시를 준다 (2026-07-27).
   *
   * Next는 public/ 파일을 기본적으로 `max-age=0, must-revalidate`로 내보낸다.
   * 파일명에 해시가 없어 언제 바뀔지 모른다는 보수적 판단인데, 대가가 크다 —
   * 브라우저가 한 번도 캐시하지 못해서 같은 로고를 열 때마다 네트워크를 다시 탄다.
   * 발송 메일이 이 경로의 로고를 절대 URL로 부르는데(메일은 /_next/image를 못 쓴다),
   * 그래서 메일을 열 때마다 상단 로고가 늦게 떴다. 실측 60~680ms, 매번.
   * 전송 자체는 10~20ms고 나머지는 왕복 지연이었다. 즉 파일 크기가 아니라 캐시 문제다.
   *
   * immutable은 쓰지 않는다 — 해시가 없어서 로고를 갈아끼울 방법이 사라진다.
   * 7일 신선 + 30일 stale-while-revalidate면 재방문·재열람은 전부 캐시에서 나가고,
   * 교체가 필요하면 파일명을 바꾸는 것으로 즉시 무효화된다.
   */
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
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
