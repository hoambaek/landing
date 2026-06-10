"use client";

import { useState } from "react";
import UnderlineField from "./UnderlineField";
import { submitPartner, isValidEmail } from "@/lib/forms";

export default function PartnerForm() {
  const [venue, setVenue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!venue.trim() || !name.trim() || !isValidEmail(email)) {
      setError("업장명, 담당자, 올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    setStatus("sending");
    const res = await submitPartner({
      venue: venue.trim(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("idle");
      setError(res.error ?? "전송에 실패했습니다.");
    }
  };

  return (
    <>
      <span className="s-letter__eyebrow">PARTNERSHIP</span>
      <h1 className="s-letter__title">파트너 문의</h1>
      <p className="s-letter__sub">바다가 기록한 시간을, 당신의 식탁이 잇는다</p>
      <p className="s-letter__body">
        첫 인양에는 소믈리에와 셰프가 동행했습니다.
        <br />
        테이블을 위한 기록 카드와 함께, 공간에 맞는 제안을 보냅니다.
      </p>
      <div className="s-letter__tags">
        <span>파인다이닝</span>
        <span className="s-letter__tag-dot" aria-hidden="true" />
        <span>럭셔리 호텔 바</span>
        <span className="s-letter__tag-dot" aria-hidden="true" />
        <span>프라이빗 셀러</span>
      </div>

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">문의가 접수되었습니다.</p>
          <p className="s-letter__note">영업일 기준 2일 내, 담당자가 직접 답합니다.</p>
        </div>
      ) : (
        <form className="s-letter__form" onSubmit={onSubmit} noValidate>
          <div className="s-letter__form-row">
            <UnderlineField label="VENUE" placeholder="업장명" name="venue" value={venue} onChange={setVenue} required />
            <UnderlineField label="NAME" placeholder="담당자" name="name" value={name} onChange={setName} required />
          </div>
          <UnderlineField label="EMAIL" placeholder="이메일 주소" name="email" type="email" value={email} onChange={setEmail} required />
          <UnderlineField label="MESSAGE" placeholder="공간과 필요한 제안을 알려주세요" name="message" multiline value={message} onChange={setMessage} />

          <button type="submit" className="s-letter__submit" disabled={status === "sending"}>
            <span className="s-letter__submit-row">
              <span className="s-letter__submit-label">{status === "sending" ? "전송 중" : "문의 보내기"}</span>
              <span className="s-letter__submit-arrow">›</span>
            </span>
            <span className="s-letter__submit-rule" />
          </button>

          <p className="s-letter__note">
            {error || "영업일 기준 2일 내, 담당자가 직접 답합니다."}
          </p>
        </form>
      )}
    </>
  );
}
