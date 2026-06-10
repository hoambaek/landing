"use client";

import { useState } from "react";
import UnderlineField from "./UnderlineField";
import { submitBrandBook, isValidEmail } from "@/lib/forms";

export default function BrandBookForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    setStatus("sending");
    const res = await submitBrandBook({ email: email.trim() });
    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("idle");
      setError(res.error ?? "전송에 실패했습니다.");
    }
  };

  return (
    <>
      <span className="s-letter__eyebrow">BRAND BOOK</span>
      <h1 className="s-letter__title">브랜드 소개서</h1>
      <p className="s-letter__sub">바다가 쓴 시간의 기록</p>
      <p className="s-letter__body">
        브랜드 철학과 기록 시스템, 큐베 라인업,
        <br />
        파트너십 안내를 담았습니다. 이메일로 보내드립니다.
      </p>

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">곧 메일로 보내드립니다.</p>
          <div className="s-letter__tags">
            <span>PDF</span>
            <span className="s-letter__tag-dot" aria-hidden="true" />
            <span>한국어 / ENGLISH</span>
          </div>
        </div>
      ) : (
        <form className="s-letter__form" onSubmit={onSubmit} noValidate>
          <UnderlineField label="EMAIL" placeholder="이메일 주소" name="email" type="email" value={email} onChange={setEmail} required />

          <button type="submit" className="s-letter__submit" disabled={status === "sending"}>
            <span className="s-letter__submit-row">
              <span className="s-letter__submit-label">{status === "sending" ? "전송 중" : "소개서 받기"}</span>
              <span className="s-letter__submit-arrow">›</span>
            </span>
            <span className="s-letter__submit-rule" />
          </button>

          {error ? (
            <p className="s-letter__note">{error}</p>
          ) : (
            <div className="s-letter__tags" style={{ marginTop: 40 }}>
              <span>PDF</span>
              <span className="s-letter__tag-dot" aria-hidden="true" />
              <span>한국어 / ENGLISH</span>
            </div>
          )}
        </form>
      )}
    </>
  );
}
