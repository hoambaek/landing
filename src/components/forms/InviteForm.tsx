"use client";

import { useState } from "react";
import UnderlineField from "./UnderlineField";
import { submitInvite } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";

export default function InviteForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !isValidEmail(email)) {
      setError("성함과 올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    setStatus("sending");
    try {
      const res = await submitInvite({ name: name.trim(), email: email.trim() });
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
      <span className="s-letter__eyebrow">OCEAN CELLAR PRIVÉ</span>
      <h1 className="s-letter__title">초대 신청</h1>
      <p className="s-letter__sub">가장 먼저, 당신을 초대합니다.</p>

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">신청이 전해졌습니다.</p>
          <p className="s-letter__note">초대장은 다음 인양 소식과 함께 전해집니다.</p>
        </div>
      ) : (
        <>
          <div className="s-letter__body">
            <p>바다에서 끌어올리는 첫 병을, 가장 먼저 만나는 자리.</p>
            <p>인양의 일정과 현장, 그 병이 심해에서 보낸 시간의 기록까지.</p>
            <p>자리는 끌어올린 수량만큼만 열립니다.</p>
          </div>

          <form className="s-letter__form" onSubmit={onSubmit} noValidate>
            <UnderlineField label="NAME" placeholder="성함" name="name" value={name} onChange={setName} required />
            <UnderlineField label="EMAIL" placeholder="이메일 주소" name="email" type="email" value={email} onChange={setEmail} required />

            <button type="submit" className="s-letter__submit" disabled={status === "sending"}>
              <span className="s-letter__submit-label">{status === "sending" ? "전송 중" : "초대 신청하기"}</span>
              <span className="s-letter__submit-arrow">›</span>
            </button>

            <p className="s-letter__note">
              {error || "신청서를 남겨주시면, 멤버십 모집이 열릴 때 가장 먼저 이메일로 안내해 드립니다."}
            </p>
          </form>
        </>
      )}
    </>
  );
}
