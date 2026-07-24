"use client";

/**
 * /b 입장 페이지 — NFC 태그가 가장 먼저 여는 화면.
 * 로고 인트로(디졸브) → 풀필름 히어로 → Bottle Identity(N°·에디션) →
 * Provenance(세 가지 증거) → Claim Ownership(이름·이메일 → "이름을 새기다").
 * 등록 성공 시 각인 공개(BottleInscription)로 전환, CTA로 기록 페이지(/record) 진입.
 * 표기 규칙: 병 번호 N°/총량. 커머스 문구 금지. 다크·앰버·시네마틱(기록 페이지와 동일 톤).
 */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./entry.module.css";
import { ENTRY_COPY, PRODUCT_META, BOTTLE_LOCALES, type BottleLocale } from "../_lib/copy";
import { submitBottleRegistration } from "@/lib/forms";
import BottleInscription from "./BottleInscription";

/** 실제 풀필름 소스가 확보되면 지정 (예: "/videos/entry-loop.mp4"). null이면 포스터 상태로 렌더. */
const ENTRY_VIDEO_SRC: string | null = null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BottleEntry({
  code,
  productId,
  serial,
  total,
}: {
  code: string;
  productId: string;
  serial: number | null;
  total: number;
}) {
  const router = useRouter();
  const meta = PRODUCT_META[productId] ?? PRODUCT_META.atomes_crochus_1y;

  const [locale, setLocale] = useState<BottleLocale>("ko");
  const [langOpen, setLangOpen] = useState(false);
  const copy = ENTRY_COPY[locale];
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;

  const [introOut, setIntroOut] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [displaySerial, setDisplaySerial] = useState(0);
  const [inscribed, setInscribed] = useState(false);
  const [inscribedName, setInscribedName] = useState("");

  const frameRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLElement>(null);
  const countedRef = useRef(false);

  /* 로고 인트로 디졸브 — 마운트 후 정착. reduced-motion이면 즉시(0ms) 해제, CSS로도 숨김 */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setIntroOut(true), reduce ? 0 : 1700);
    return () => clearTimeout(t);
  }, []);

  /* 섹션 스크롤 리빌 + 대형 N° 카운트업 (0→serial, ease-out cubic 1.6s) */
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startCount = () => {
      if (countedRef.current || serial === null) return;
      countedRef.current = true;
      if (reduce) {
        setDisplaySerial(serial);
        return;
      }
      const dur = 1600;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplaySerial(Math.round(serial * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const sections = Array.from(frame.querySelectorAll(`.${styles.reveal}`));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.revealIn);
            if (e.target === identityRef.current) startCount();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [serial]);

  const identityBody = (serial !== null ? copy.identityBody : copy.identityBodyNoSerial)
    .replace("{total}", String(total))
    .replace("{serial}", String(serial));
  const ownBody =
    serial !== null ? copy.ownBody.replace("{serial}", String(serial)) : copy.ownBodyNoSerial;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const n = name.trim();
    const em = email.trim();
    if (!n) {
      setError(copy.errName);
      return;
    }
    if (!EMAIL_RE.test(em)) {
      setError(copy.errEmail);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await submitBottleRegistration({
        nfcCode: code,
        productId,
        serial,
        name: n,
        email: em,
        locale,
      });
      if (res.ok) {
        setInscribedName(n);
        setInscribed(true);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } else {
        setError(res.error ?? copy.errGeneric);
        setSubmitting(false);
      }
    } catch {
      setError(copy.errGeneric);
      setSubmitting(false);
    }
  }

  if (inscribed) {
    return (
      <main className={styles.page}>
        <div className={styles.frame}>
          <BottleInscription
            copy={copy}
            name={inscribedName}
            serial={serial}
            total={total}
            image={meta.image}
            onContinue={() => router.push(`/b/${code}/record`)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* ── 로고 인트로 (디졸브) ── */}
      <div className={`${styles.intro} ${introOut ? styles.introOut : ""}`} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo/logo_intro_W.png" alt="" className={styles.introLogo} />
      </div>

      <div className={styles.frame} ref={frameRef}>
        {/* ── S1 풀필름 히어로 ── */}
        <section className={styles.film}>
          {ENTRY_VIDEO_SRC && (
            <video
              className={styles.filmVideo}
              src={ENTRY_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          )}

          <div className={styles.langSelect}>
            <button
              type="button"
              className={styles.langChip}
              onClick={() => setLangOpen((v) => !v)}
              aria-expanded={langOpen}
              aria-label="Language"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeLocale.flag} alt="" className={styles.langFlag} />
              <span>{activeLocale.short}</span>
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                <polyline points="1,1 3.5,4 6,1" fill="none" stroke="rgba(241,239,235,0.55)" strokeWidth="1" />
              </svg>
            </button>
            {langOpen && (
              <div className={styles.langPanel} role="listbox">
                {BOTTLE_LOCALES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="option"
                    aria-selected={l.code === locale}
                    className={`${styles.langOpt} ${l.code === locale ? styles.langOptActive : ""}`}
                    onClick={() => {
                      setLocale(l.code);
                      setLangOpen(false);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.flag} alt="" className={styles.langFlag} />
                    <span className={styles.langOptCode}>{l.short}</span>
                    <span className={styles.langOptNative}>{l.native}</span>
                    {l.code === locale && (
                      <svg className={styles.langCheck} width="9" height="7" viewBox="0 0 9 7" aria-hidden>
                        <polyline points="1,3.5 3.5,6 8,1" fill="none" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/logo_trans_W_lg.png" alt="Muse de Marée" className={styles.filmLogo} />

          <div className={styles.filmCenter}>
            <span className={styles.playBtn}>
              <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
                <path d="M2 1.5 L16.5 10 L2 18.5 Z" fill="rgba(241,239,235,0.82)" />
              </svg>
            </span>
            <span className={styles.filmCaption}>{copy.filmCaption}</span>
            <span className={styles.filmMeta}>{copy.filmMeta}</span>
          </div>

          <span className={styles.filmTail} aria-hidden />
        </section>

        {/* ── 01 Bottle Identity ── */}
        <section className={`${styles.identity} ${styles.reveal}`} ref={identityRef}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden />
            <span>{copy.identityEyebrow}</span>
          </div>
          <h1 className={styles.productName}>{meta.name}</h1>
          <div className={styles.identityTagline}>{copy.identityTagline}</div>
          <span className={styles.identityRule} aria-hidden />
          {serial !== null && (
            <div className={styles.edition}>
              <span className={styles.edNo}>N°</span>
              <span className={styles.edNum}>{displaySerial}</span>
              <span className={styles.edTotal}>/ {total}</span>
            </div>
          )}
          <p className={styles.identityBody}>{identityBody}</p>
        </section>

        {/* ── 02 Provenance ── */}
        <section className={`${styles.prov} ${styles.reveal}`}>
          <div className={styles.provEyebrow}>{copy.provEyebrow}</div>
          <h2 className={styles.provTitle}>{copy.provTitle}</h2>
          <p className={styles.provBody}>{copy.provBody}</p>
          <div className={styles.facts}>
            <div className={styles.fact}>
              <span className={styles.factLabel}>{copy.fact1Label}</span>
              <span className={styles.factValueMono}>{copy.fact1Value}</span>
              <span className={styles.factSub}>{copy.fact1Sub}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.factLabel}>{copy.fact2Label}</span>
              <span className={styles.factValue}>{copy.fact2Value}</span>
              <span className={styles.factSub}>{copy.fact2Sub}</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.factLabel}>{copy.fact3Label}</span>
              <span className={styles.factValue}>{copy.fact3Value}</span>
              <span className={styles.factSub}>{copy.fact3Sub}</span>
            </div>
          </div>
          <div className={styles.provHint}>
            <span>{copy.provHint}</span>
            <span className={styles.provHintArrow} aria-hidden>→</span>
          </div>
        </section>

        {/* ── 03 Claim Ownership ── */}
        <section className={`${styles.claim} ${styles.reveal}`}>
          <div className={styles.claimEyebrow}>{copy.ownEyebrow}</div>
          <h2 className={styles.claimTitle}>{copy.ownTitle}</h2>
          <p className={styles.claimBody}>{ownBody}</p>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{copy.nameLabel}</span>
              <input
                type="text"
                className={styles.input}
                placeholder={copy.namePlaceholder}
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                autoComplete="name"
                enterKeyHint="next"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{copy.emailLabel}</span>
              <input
                type="email"
                className={styles.input}
                placeholder={copy.emailPlaceholder}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                autoComplete="email"
                inputMode="email"
                enterKeyHint="go"
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <p className={styles.privacyNote}>{copy.privacyNote}</p>

            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? copy.submitting : copy.submit}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
