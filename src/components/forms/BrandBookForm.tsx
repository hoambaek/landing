"use client";

import { useState } from "react";
import Image from "next/image";
import UnderlineField from "./UnderlineField";
import SubmitButton from "./SubmitButton";
import BenefitList from "./BenefitList";
import { submitBrandBook } from "@/lib/forms";
import { isValidEmail } from "@/lib/validation";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

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
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !affiliation.trim() || !isValidEmail(email)) {
      setError(dict.errValidation);
      return;
    }
    setStatus("sending");
    try {
      const res = await submitBrandBook({
        name: name.trim(),
        affiliation: affiliation.trim(),
        email: email.trim(),
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
      <div className="s-letter__brandmark">
        <Image src="/images/logo/logo_trans.png" alt="" width={1000} height={829} className="s-letter__brandmark-symbol" />
        <Image src="/images/logo/logo_text_trans.png" alt="MUSE DE MARÉE" width={1000} height={152} className="s-letter__brandmark-word" />
      </div>
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

      {status === "done" ? (
        <div className="s-letter__success">
          <span className="s-letter__success-rule" />
          <p className="s-letter__success-line">{dict.successLine}</p>
          <p className="s-letter__note">{dict.successNote}</p>
        </div>
      ) : (
        <>
          <BenefitList items={dict.benefits} numbered />

          <form className="s-letter__form" onSubmit={onSubmit} noValidate>
            <div className="s-letter__form-row">
              <UnderlineField label="NAME" placeholder={common.placeholder.name} name="name" value={name} onChange={setName} required />
              <UnderlineField label="AFFILIATION" placeholder={common.placeholder.affiliation} name="affiliation" value={affiliation} onChange={setAffiliation} required />
            </div>
            <UnderlineField label="EMAIL" placeholder={common.placeholder.email} name="email" type="email" value={email} onChange={setEmail} required />

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
