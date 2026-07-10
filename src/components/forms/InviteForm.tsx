"use client";

import { useState } from "react";
import Image from "next/image";
import UnderlineField from "./UnderlineField";
import SelectField from "./SelectField";
import SubmitButton from "./SubmitButton";
import BenefitList from "./BenefitList";
import { submitInvite } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

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
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !isValidEmail(email)) {
      setError(dict.errValidation);
      return;
    }
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

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">{dict.successLine}</p>
          <p className="s-letter__note">{dict.successNote}</p>
        </div>
      ) : (
        <>
          <BenefitList items={dict.benefits} numbered footnote={dict.scarcity} />

          <form className="s-letter__form" onSubmit={onSubmit} noValidate>
            <UnderlineField label="NAME" placeholder={common.placeholder.name} name="name" value={name} onChange={setName} required />
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
