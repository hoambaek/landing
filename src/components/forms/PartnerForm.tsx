"use client";

import { useState } from "react";
import Image from "next/image";
import UnderlineField from "./UnderlineField";
import SelectField from "./SelectField";
import SubmitButton from "./SubmitButton";
import BenefitList from "./BenefitList";
import LetterSuccess from "./LetterSuccess";
import { submitPartner } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

const CATEGORY_KEYS = ["dining", "event", "cellar", "other"] as const;

type FieldErrors = { venue?: string; name?: string; email?: string };

export default function PartnerForm({
  dict,
  common,
  locale,
}: {
  dict: Dictionary["forms"]["partner"];
  common: Dictionary["forms"]["common"];
  locale: Locale;
}) {
  const [category, setCategory] = useState<(typeof CATEGORY_KEYS)[number]>("dining");
  const [venue, setVenue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
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
    if (!category) {
      setError(dict.errCategory);
      return;
    }
    /* 오류는 해당 필드 아래 한 줄로 — 전송 실패만 하단 안내 자리에 */
    const next: FieldErrors = {};
    if (!venue.trim()) next.venue = common.errRequired;
    if (!name.trim()) next.name = common.errRequired;
    if (!isValidEmail(email)) next.email = email.trim() ? common.errEmail : common.errRequired;
    setFieldErrors(next);
    if (next.venue || next.name || next.email) return;
    setStatus("sending");
    const catLabel = dict.categories[category].label;
    try {
      const res = await submitPartner({
        category: catLabel,
        venue: venue.trim(),
        name: name.trim(),
        email: email.trim(),
        message: "",
        referralSource: referral.trim(),
      });
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
            src="/text/letter/partner-title.png"
            alt={dict.title}
            width={777}
            height={131}
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
        <>
          <div className="s-cat">
            <span className="s-cat__label" id="partner-cat-label">{dict.catLabel}</span>
            <div className="s-cat__grid" role="group" aria-labelledby="partner-cat-label">
              {CATEGORY_KEYS.map((key, i) => (
                <button
                  type="button"
                  key={key}
                  className={`s-cat__card${category === key ? " is-active" : ""}`}
                  aria-pressed={category === key}
                  onClick={() => setCategory(key)}
                >
                  <span className="s-cat__radio" aria-hidden />
                  <span className="s-cat__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="s-cat__name">{dict.categories[key].label}</span>
                  <span className="s-cat__desc">{dict.categories[key].desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="s-letter__form" onSubmit={onSubmit} noValidate>
            <div className="s-letter__form-row">
              <UnderlineField
                label={common.label.venue}
                placeholder={common.placeholder.venue}
                name="venue"
                value={venue}
                onChange={(v) => {
                  setVenue(v);
                  clearError("venue");
                }}
                error={fieldErrors.venue}
                required
              />
              <UnderlineField
                label={common.label.name}
                placeholder={common.placeholder.contact}
                name="name"
                value={name}
                onChange={(v) => {
                  setName(v);
                  clearError("name");
                }}
                error={fieldErrors.name}
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
            <SelectField label={common.label.referral} placeholder={common.placeholder.referral} name="referral" options={common.referralOptions} value={referral} onChange={setReferral} />

            <SubmitButton label={dict.submit} sendingLabel={common.sending} sending={status === "sending"} />

            <p className={`s-letter__note${error ? " is-error" : ""}`} role={error ? "alert" : undefined}>
              {error || dict.note}
            </p>
          </form>
        </>
      )}
    </>
  );
}
