"use client";

import { useState } from "react";
import Image from "next/image";
import UnderlineField from "./UnderlineField";
import SubmitButton from "./SubmitButton";
import BenefitList from "./BenefitList";
import LetterSuccess from "./LetterSuccess";
import { submitBrandBook } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type FieldErrors = { name?: string; affiliation?: string; email?: string };

export default function BrandBookForm({
  dict,
  common,
  locale,
}: {
  dict: Dictionary["forms"]["brandBook"];
  common: Dictionary["forms"]["common"];
  locale: Locale;
}) {
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");

  /* 입력을 고치면 그 필드의 오류 줄은 바로 걷는다 */
  const clearError = (key: keyof FieldErrors) => {
    if (fieldErrors[key]) setFieldErrors((f) => ({ ...f, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    /* 오류는 해당 필드 아래 한 줄로 — 전송 실패만 하단 안내 자리에 */
    const next: FieldErrors = {};
    if (!name.trim()) next.name = common.errRequired;
    if (!affiliation.trim()) next.affiliation = common.errRequired;
    if (!isValidEmail(email)) next.email = email.trim() ? common.errEmail : common.errRequired;
    setFieldErrors(next);
    if (next.name || next.affiliation || next.email) return;
    setStatus("sending");
    try {
      const res = await submitBrandBook({
        name: name.trim(),
        affiliation: affiliation.trim(),
        email: email.trim(),
        /* 신청자에게 언어를 묻지 않는다 — 지금 읽고 있는 지면의 언어가 답이다 */
        locale,
      });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("idle");
        setError(res.error ?? common.errFailed);
      }
    } catch {
      setStatus("idle");
      setError(common.errNetwork);
    }
  };

  return (
    <>
      <span className="s-letter__eyebrow">{dict.eyebrow}</span>
      <h1 className="s-letter__title">
        {locale === "ko" ? (
          <Image
            src="/text/letter/brandbook-title.png"
            alt={dict.title}
            width={923}
            height={132}
            unoptimized
            className="s-letter__title-img"
          />
        ) : (
          dict.title
        )}
      </h1>
      <p className="s-letter__sub">{dict.sub}</p>

      <BenefitList items={dict.benefits} numbered />

      {status === "done" ? (
        <LetterSuccess line={dict.successLine} note={dict.successNote} backLabel={common.backHome} locale={locale} />
      ) : (
        <form className="s-letter__form" onSubmit={onSubmit} noValidate>
          <div className="s-letter__form-row">
            <UnderlineField
              label={common.label.name}
              placeholder={common.placeholder.name}
              name="name"
              value={name}
              onChange={(v) => {
                setName(v);
                clearError("name");
              }}
              error={fieldErrors.name}
              required
            />
            <UnderlineField
              label={common.label.affiliation}
              placeholder={common.placeholder.affiliation}
              name="affiliation"
              value={affiliation}
              onChange={(v) => {
                setAffiliation(v);
                clearError("affiliation");
              }}
              error={fieldErrors.affiliation}
              required
            />
          </div>
          <UnderlineField
            label={common.label.email}
            placeholder={common.placeholder.email}
            name="email"
            type="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              clearError("email");
            }}
            error={fieldErrors.email}
            required
          />

          <SubmitButton label={dict.submit} sendingLabel={common.sending} sending={status === "sending"} />

          <p className={`s-letter__note${error ? " is-error" : ""}`} role={error ? "alert" : undefined}>
            {error || dict.note}
          </p>
        </form>
      )}
    </>
  );
}
