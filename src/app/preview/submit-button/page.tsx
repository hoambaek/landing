"use client";

import { useState } from "react";
import SubmitButton from "@/components/forms/SubmitButton";

/**
 * 제출 버튼 "전송 중" 상태 미리보기 — 실제 메일 발송 없이 디자인을 다듬기 위한 페이지.
 * /preview/submit-button
 */
export default function SubmitButtonPreview() {
  const [sending, setSending] = useState(true);
  const [size, setSize] = useState(96);

  const SIZES = [64, 80, 96, 112, 128, 160];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#E8E5E1",
        padding: "64px 32px",
        fontFamily: "var(--font-body)",
        color: "#312E2A",
        display: "flex",
        flexDirection: "column",
        gap: 40,
        alignItems: "flex-start",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "#9B9388" }}>
          PREVIEW · SUBMIT BUTTON
        </p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 300, fontSize: 32, marginTop: 8 }}>
          전송 중 버튼
        </h1>
      </div>

      {/* 컨트롤 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setSending((s) => !s)}
          style={ctrlBtn(sending)}
        >
          {sending ? "● 전송 중 (클릭: idle)" : "○ idle (클릭: 전송 중)"}
        </button>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.15em", color: "#9B9388" }}>
          SPINNER SIZE
        </span>
        {SIZES.map((s) => (
          <button key={s} type="button" onClick={() => setSize(s)} style={ctrlBtn(size === s)}>
            {s}px
          </button>
        ))}
      </div>

      {/* 라이브 버튼 */}
      <section style={{ width: "100%" }}>
        <Label>현재 상태 (size {size}px)</Label>
        <SubmitButton label="소개서 받기" sending={sending} spinnerSize={size} />
      </section>

      {/* idle / sending 동시 비교 */}
      <section style={{ width: "100%", display: "flex", gap: 48, flexWrap: "wrap" }}>
        <div>
          <Label>idle</Label>
          <SubmitButton label="소개서 받기" sending={false} />
        </div>
        <div>
          <Label>전송 중 (size {size}px)</Label>
          <SubmitButton label="소개서 받기" sending={true} spinnerSize={size} />
        </div>
      </section>

      {/* 3개 폼 라벨 변형 */}
      <section style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
        <Label>폼별 라벨 (전송 중)</Label>
        <SubmitButton label="소개서 받기" sending={true} spinnerSize={size} />
        <SubmitButton label="초대 신청하기" sending={true} spinnerSize={size} />
        <SubmitButton label="문의 보내기" sending={true} spinnerSize={size} />
      </section>
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.15em",
        color: "#9B9388",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

function ctrlBtn(active: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.08em",
    padding: "8px 12px",
    border: `1px solid ${active ? "#312E2A" : "rgba(49,46,42,0.25)"}`,
    background: active ? "#312E2A" : "transparent",
    color: active ? "#F2EFE9" : "#312E2A",
    cursor: "pointer",
  };
}
