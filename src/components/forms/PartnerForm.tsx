"use client";

import { useState } from "react";
import UnderlineField from "./UnderlineField";
import { submitPartner } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";

const CATEGORIES = [
  { key: "dining", label: "다이닝 · 바 리스트", desc: "와인 리스트 · 바이더글래스 등재" },
  { key: "event", label: "프라이빗 이벤트 · 페어링", desc: "소믈리에 · 셰프 동행 디너" },
  { key: "cellar", label: "셀러 · 컬렉션", desc: "프라이빗 셀러 · 멤버십 보틀" },
  { key: "other", label: "그 외 제안", desc: "리테일 · 기프팅 · 협업" },
] as const;

export default function PartnerForm() {
  const [category, setCategory] = useState("dining");
  const [venue, setVenue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!category) {
      setError("파트너십 유형을 선택해 주세요.");
      return;
    }
    if (!venue.trim() || !name.trim() || !isValidEmail(email)) {
      setError("업장명, 담당자, 올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    setStatus("sending");
    const catLabel = CATEGORIES.find((c) => c.key === category)?.label ?? "";
    try {
      const res = await submitPartner({
        category: catLabel,
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
    } catch {
      setStatus("idle");
      setError("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <span className="s-letter__eyebrow">PARTNERSHIP</span>
      <h1 className="s-letter__title">파트너 문의</h1>
      <p className="s-letter__sub">바다의 시간을 테이블 위에 놓는 일.</p>

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">문의가 접수되었습니다.</p>
          <p className="s-letter__note">영업일 기준 2일 내, 담당자가 직접 답합니다.</p>
        </div>
      ) : (
        <>
          <div className="s-letter__body">
            <p>모든 병에는, 심해에서 보낸 시간의 기록이 함께 담깁니다.</p>
            <p>좌표와 수심, 숙성의 날들이 손님에게 건넬 이야기가 됩니다.</p>
            <p>파인다이닝과 호텔 바, 프라이빗 셀러. 공간의 격에 맞는 제안을 준비합니다.</p>
          </div>

          <div className="s-cat">
            <span className="s-cat__label">PARTNERSHIP TYPE</span>
            <p className="s-cat__hint">운영하시는 공간에 맞는 파트너십 유형을 선택해 주세요.</p>
            <div className="s-cat__grid">
              {CATEGORIES.map((c, i) => (
                <button
                  type="button"
                  key={c.key}
                  className={`s-cat__card${category === c.key ? " is-active" : ""}`}
                  aria-pressed={category === c.key}
                  onClick={() => setCategory(c.key)}
                >
                  <span className="s-cat__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="s-cat__name">{c.label}</span>
                  <span className="s-cat__desc">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="s-letter__form" onSubmit={onSubmit} noValidate>
            <div className="s-letter__form-row">
              <UnderlineField label="VENUE" placeholder="업장명" name="venue" value={venue} onChange={setVenue} required />
              <UnderlineField label="NAME" placeholder="담당자" name="name" value={name} onChange={setName} required />
            </div>
            <UnderlineField label="EMAIL" placeholder="이메일 주소" name="email" type="email" value={email} onChange={setEmail} required />
            <UnderlineField label="MESSAGE (선택)" placeholder="공간과 필요한 제안을 알려주세요" name="message" multiline value={message} onChange={setMessage} />

            <button type="submit" className="s-letter__submit" disabled={status === "sending"}>
              <span className="s-letter__submit-label">{status === "sending" ? "전송 중" : "문의 보내기"}</span>
              <span className="s-letter__submit-arrow">›</span>
            </button>

            <p className="s-letter__note">
              {error || "보내주신 내용을 검토한 뒤, 영업일 기준 2일 이내 담당자가 제안서로 회신드립니다."}
            </p>
          </form>
        </>
      )}
    </>
  );
}
