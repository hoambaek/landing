"use client";

import { useState } from "react";
import Image from "next/image";
import UnderlineField from "./UnderlineField";
import SubmitButton from "./SubmitButton";
import { submitBrandBook } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";

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
    try {
      const res = await submitBrandBook({ email: email.trim() });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("idle");
        setError(res.error ?? "전송에 실패했습니다.");
      }
    } catch {
      setStatus("idle");
      setError("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <div className="s-letter__brandmark">
        <Image src="/images/logo/logo_trans.png" alt="" width={1000} height={829} className="s-letter__brandmark-symbol" />
        <Image src="/images/logo/logo_text_trans.png" alt="MUSE DE MARÉE" width={1000} height={152} className="s-letter__brandmark-word" />
      </div>
      <h1 className="s-letter__title">브랜드 소개서</h1>
      <p className="s-letter__sub">바다가 쓴 시간.</p>

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">곧 메일로 보내드립니다.</p>
          <p className="s-letter__note">PDF · 한국어 / ENGLISH</p>
        </div>
      ) : (
        <>
          <div className="s-letter__body">
            <p>한국 심해에서 숙성한 샴페인, 그 시작과 기록.</p>
            <p>브랜드의 철학, 측정의 방식, 큐베 라인업과 파트너십.</p>
            <p>한 권의 소개서로 전합니다.</p>
          </div>

          <form className="s-letter__form" onSubmit={onSubmit} noValidate>
            <UnderlineField label="EMAIL" placeholder="이메일 주소" name="email" type="email" value={email} onChange={setEmail} required />

            <SubmitButton label="소개서 받기" sending={status === "sending"} />

            <p className="s-letter__note">
              {error || "이메일을 남겨주시면 브랜드 소개서(PDF)를 보내드립니다. 한국어 · 영문 제공."}
            </p>
          </form>
        </>
      )}
    </>
  );
}
