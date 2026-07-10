"use client";

import { useState } from "react";
import Image from "next/image";
import UnderlineField from "./UnderlineField";
import SelectField from "./SelectField";
import SubmitButton from "./SubmitButton";
import BenefitList from "./BenefitList";
import { submitPartner } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

const CATEGORY_KEYS = ["dining", "event", "cellar", "other"] as const;

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
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!category) {
      setError(dict.errCategory);
      return;
    }
    if (!venue.trim() || !name.trim() || !isValidEmail(email)) {
      setError(dict.errValidation);
      return;
    }
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

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">{dict.successLine}</p>
          <p className="s-letter__note">{dict.successNote}</p>
        </div>
      ) : (
        <>
          {/* 번호는 아래 유형 카드(01~04)가 쓰므로 혜택 줄에는 붙이지 않는다 */}
          <BenefitList items={dict.benefits} />

          <div className="s-cat">
            <span className="s-cat__label">{dict.catLabel}</span>
            <p className="s-cat__hint">{dict.catHint}</p>
            <div className="s-cat__grid">
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
              <UnderlineField label="VENUE" placeholder={common.placeholder.venue} name="venue" value={venue} onChange={setVenue} required />
              <UnderlineField label="NAME" placeholder={common.placeholder.contact} name="name" value={name} onChange={setName} required />
            </div>
            <UnderlineField label="EMAIL" placeholder={common.placeholder.email} name="email" type="email" value={email} onChange={setEmail} required />
            <SelectField label="REFERRAL" placeholder={common.placeholder.referral} name="referral" options={common.referralOptions} value={referral} onChange={setReferral} />

            <SubmitButton label={dict.submit} sendingLabel={common.sending} sending={status === "sending"} />

            <p className="s-letter__note">
              {error || dict.note}
            </p>
          </form>
        </>
      )}
    </>
  );
}
