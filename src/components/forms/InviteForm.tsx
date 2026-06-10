"use client";

import { useState } from "react";
import UnderlineField from "./UnderlineField";
import { submitInvite, isValidEmail } from "@/lib/forms";

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
    const res = await submitInvite({ name: name.trim(), email: email.trim() });
    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("idle");
      setError(res.error ?? "전송에 실패했습니다.");
    }
  };

  return (
    <>
      <span className="s-letter__eyebrow">OCEAN CELLAR PRIVÉ</span>
      <h1 className="s-letter__title">초대 신청</h1>
      <p className="s-letter__sub">인양을 가장 먼저 지켜보는 사람들</p>
      <p className="s-letter__body">
        멤버는 인양 일정을 먼저 받고, 현장을 참관하며,
        <br />
        내 병의 기록을 평생 열람합니다.
        <br />
        자리는 인양된 수량만큼만 열립니다.
      </p>

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">신청이 전해졌습니다.</p>
          <p className="s-letter__note">초대장은 다음 인양 소식과 함께 전해집니다.</p>
        </div>
      ) : (
        <form className="s-letter__form" onSubmit={onSubmit} noValidate>
          <UnderlineField label="NAME" placeholder="성함" name="name" value={name} onChange={setName} required />
          <UnderlineField label="EMAIL" placeholder="이메일 주소" name="email" type="email" value={email} onChange={setEmail} required />

          <button type="submit" className="s-letter__submit" disabled={status === "sending"}>
            <span className="s-letter__submit-row">
              <span className="s-letter__submit-label">{status === "sending" ? "전송 중" : "초대 신청하기"}</span>
              <span className="s-letter__submit-arrow">›</span>
            </span>
            <span className="s-letter__submit-rule" />
          </button>

          <p className="s-letter__note">
            {error || "초대장은 다음 인양 소식과 함께 전해집니다."}
          </p>
        </form>
      )}
    </>
  );
}
