import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Muse de Marée | 바다의 시간을 담은 샴페인";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** globals.css @theme 토큰과 동기화된 하드 카피 (edge runtime은 CSS 변수 미지원) */
const BRAND = {
  voidBg: "#0A0908",
  navyMid: "#141110",
  navy: "#0D0B09",
  sand: "#E8E5E1",
  amber: "#CCAD7B",
} as const;

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${BRAND.voidBg} 0%, ${BRAND.navyMid} 50%, ${BRAND.navy} 100%)`,
          color: BRAND.sand,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.35em",
            color: BRAND.amber,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          MUSE DE MARÉE
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: "0.05em",
            marginBottom: 16,
          }}
        >
          바다의 시간을 담은 샴페인
        </div>
        <div
          style={{
            width: 40,
            height: 1,
            background: BRAND.amber,
            marginBottom: 20,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            fontSize: 16,
            fontWeight: 300,
            opacity: 0.5,
            letterSpacing: "0.08em",
          }}
        >
          한국 남해 · 수심 50미터 · 해저 숙성
        </div>
      </div>
    ),
    { ...size }
  );
}
