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
};

export default nextConfig;
