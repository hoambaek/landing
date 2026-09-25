"use client";

import { useState } from "react";
import Image from "next/image";
import UnderlineField from "./UnderlineField";
import SelectField from "./SelectField";
import SubmitButton from "./SubmitButton";
import BenefitList from "./BenefitList";
import LetterSuccess from "./LetterSuccess";
import { submitInvite } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type FieldErrors = { name?: string; email?: string };

export default function InviteForm({
  dict,
  common,
  locale,
}: {
  dict: Dictionary["forms"]["invite"];
  common: Dictionary["forms"]["common"];
  locale: Locale;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    /* 오류는 해당 필드 아래 한 줄로 — 전송 실패만 하단 안내 자리에 */
    const next: FieldErrors = {};
    if (!name.trim()) next.name = common.errRequired;
    if (!isValidEmail(email)) next.email = email.trim() ? common.errEmail : common.errRequired;
    setFieldErrors(next);
    if (next.name || next.email) return;
    setStatus("sending");
    try {
      const res = await submitInvite({ name: name.trim(), email: email.trim(), referralSource: referral.trim() });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("idle");
        setError(common.errFailed);
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
            src="/text/letter/invite-title.png"
            alt={dict.title}
            width={632}
            height={136}
            unoptimized
            className="s-letter__title-img"
          />
        ) : (
          dict.title
        )}
      </h1>
      <p className="s-letter__sub">{dict.sub}</p>

      <BenefitList items={dict.benefits} numbered footnote={dict.scarcity} />

      {status === "done" ? (
        <LetterSuccess line={dict.successLine} note={dict.successNote} backLabel={common.backHome} locale={locale} />
      ) : (
        <form className="s-letter__form" onSubmit={onSubmit} noValidate>
          <UnderlineField
            label={common.label.name}
            placeholder={common.placeholder.name}
            name="name"
            value={name}
            onChange={(v) => {
              setName(v);
              if (fieldErrors.name) setFieldErrors((f) => ({ ...f, name: undefined }));
            }}
            error={fieldErrors.name}
            required
          />
          <UnderlineField
            label={common.label.email}
            placeholder={common.placeholder.email}
            name="email"
            type="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
            }}
            error={fieldErrors.email}
            required
          />
          <SelectField label={common.label.referral} placeholder={common.placeholder.referral} name="referral" options={common.referralOptions} value={referral} onChange={setReferral} />

          <SubmitButton label={dict.submit} sendingLabel={common.sending} sending={status === "sending"} />

          <p className={`s-letter__note${error ? " is-error" : ""}`} role={error ? "alert" : undefined}>
            {error || dict.note}
          </p>
        </form>
      )}
    </>
  );
}
