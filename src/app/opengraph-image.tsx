import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Muse de Marée — 바다의 시간을 담은 샴페인";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #0A0908 0%, #141110 50%, #0D0B09 100%)",
          color: "#E8E5E1",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.35em",
            color: "#CCAD7B",
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
            background: "#CCAD7B",
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
