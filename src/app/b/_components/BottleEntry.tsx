"use client";

/**
 * /b 입장 페이지 — NFC 태그가 가장 먼저 여는 화면.
 * 로고 인트로(디졸브) → 풀필름 히어로 → Bottle Identity(N°·에디션) →
 * Provenance(세 가지 증거) → Claim Ownership(이름·이메일 → "이름을 새기다").
 * 등록 성공 시 각인 공개(BottleInscription)로 전환, CTA로 기록 페이지(/record) 진입.
 * 표기 규칙: 병 번호 N°/총량. 커머스 문구 금지. 다크·앰버·시네마틱(기록 페이지와 동일 톤).
 */

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./entry.module.css";
import { ENTRY_COPY, PRODUCT_META, BOTTLE_LOCALES, type BottleLocale } from "../_lib/copy";
import { persistBottleLocale } from "../_lib/locale";
import { submitBottleRegistration } from "@/lib/forms";
import BottleInscription from "./BottleInscription";
import { useSafeAreaTint } from "../_lib/use-safe-area-tint";

/** 실제 풀필름 소스가 확보되면 지정 (예: "/videos/entry-loop.mp4"). null이면 포스터 상태로 렌더. */
const ENTRY_VIDEO_SRC: string | null = null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BottleEntry({
  code,
  productId,
  serial,
  total,
  initialLocale = "ko",
  registered = false,
  registeredTo = null,
  registeredToLatin = null,
}: {
  code: string;
  productId: string;
  serial: number | null;
  total: number;
  initialLocale?: BottleLocale;
  /** 이미 소유 등록된 병 — 폼을 잠그고 기록 입구를 연다 */
  registered?: boolean;
  registeredTo?: string | null;
  /* 인증서와 같은 얼굴로 보여주기 위한 로마자 표기 */
  registeredToLatin?: string | null;
}) {
  const router = useRouter();
  const meta = PRODUCT_META[productId] ?? PRODUCT_META.atomes_crochus_1y;

  const [locale, setLocale] = useState<BottleLocale>(initialLocale);
  const [langOpen, setLangOpen] = useState(false);
  const copy = ENTRY_COPY[locale];
  /* 라틴 로케일은 이름 자체가 로마자라 자국어 칸을 따로 두지 않는다 */
  const isLatinLocale = locale === "en" || locale === "fr";
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;

  const [introOut, setIntroOut] = useState(false);
  const [name, setName] = useState("");
  /* 인증서 서명체는 로마자로만 쓸 수 있다(브랜드 Signature 활자가 라틴 전용).
     자국어 이름과 따로 받아, 인증서에는 "이름 성" 순서로 새긴다. */
  const [latinGiven, setLatinGiven] = useState("");
  const [latinFamily, setLatinFamily] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [displaySerial, setDisplaySerial] = useState(0);
  /* 이미 등록된 병으로 들어오면 각인 화면부터 — 등록 직후 본 화면과 같은 얼굴이다.
     "아래에서 계속 보기"로 입장 화면 전체를 이어서 볼 수 있다. */
  const [inscribed, setInscribed] = useState(registered);
  const [inscribedName, setInscribedName] = useState(registeredTo ?? "");
  const [inscribedLatin, setInscribedLatin] = useState<string | null>(registeredToLatin);

  const frameRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLElement>(null);
  const countedRef = useRef(false);

  /* 안전영역은 한 페이지에 한 색이다(상·하단 분리 불가 — use-safe-area-tint.ts 참고).
     각인 화면은 종이 단색, 필름 화면은 위아래 다 검정. */
  useSafeAreaTint(inscribed);

  /* 로고 인트로 디졸브 — 마운트 후 정착. reduced-motion이면 즉시(0ms) 해제, CSS로도 숨김 */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setIntroOut(true), reduce ? 0 : 1700);
    return () => clearTimeout(t);
  }, []);

  /* 섹션 스크롤 리빌 + 대형 N° 카운트업 (0→serial, ease-out cubic 1.6s)
     inscribed를 의존성에 넣는다 — 각인 화면이 떠 있는 동안에는 입장 화면 DOM이
     아예 없어 frameRef가 비어 있다. 화면이 돌아왔을 때 다시 관찰하지 않으면
     섹션들이 opacity 0인 채로 남는다. */
  useEffect(() => {
    if (inscribed) return;
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
  }, [serial, inscribed]);

  const identityBody = (serial !== null ? copy.identityBody : copy.identityBodyNoSerial)
    .replace("{total}", String(total))
    .replace("{serial}", String(serial));
  const ownBody =
    serial !== null ? copy.ownBody.replace("{serial}", String(serial)) : copy.ownBodyNoSerial;
  /* 개체는 대명사가 아니라 번호로 부른다 — 번호가 없으면 부르지 않는다 */
  const ownTitle =
    serial !== null ? copy.ownTitle.replace("{serial}", String(serial)) : copy.ownTitleNoSerial;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    /* 라틴 로케일은 이름 자체가 로마자다 — 자국어 칸을 따로 두지 않고
       given/family를 합쳐 표시 이름으로 쓴다.
       첫 글자 대문자화는 서버가 저장 시점에 한 번 더 한다(여기서는 화면 표시용).
       첫 글자만 올린다 — 전체를 title case로 강제하면 van der Berg 같은 표기를 망친다. */
    const cap = (v: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : v);
    const given = cap(latinGiven.trim());
    const family = cap(latinFamily.trim());
    const n = isLatinLocale ? [given, family].filter(Boolean).join(" ") : name.trim();
    const em = email.trim();
    if (!n) {
      setError(copy.errName);
      return;
    }
    if (!given || !family) {
      setError(copy.errLatinName);
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
        givenNameLatin: given,
        familyNameLatin: family,
        email: em,
        locale,
      });
      if (res.ok) {
        setInscribedName(isLatinLocale ? n : name.trim());
        /* 인증서와 같은 순서(이름 성)로 합쳐 넘긴다 */
        setInscribedLatin([given, family].filter(Boolean).join(" ") || null);
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
      <main className={`${styles.page} b-paper`}>
        <div className={styles.frame}>
          <BottleInscription
            copy={copy}
            name={inscribedName}
            nameLatin={inscribedLatin}
            serial={serial}
            total={total}
            /* 세로 프레임에는 세로 누끼를 쓴다 — entry Identity·인증서와 같은 자산 */
            image={meta.imagePortrait ?? meta.image}
            productName={meta.name}
            onContinue={() => router.push(`/b/${code}/record`)}
            /* 등록된 병으로 들어온 경우에만 — 방금 등록을 마친 사람에게는 주지 않는다 */
            onBrowse={
              registered
                ? () => {
                    setInscribed(false);
                    /* 각인 화면에서 내려온 스크롤 위치가 남아 있으면
                       입장 화면 중간부터 열린다 — 히어로부터 보여준다. */
                    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
                  }
                : undefined
            }
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
                      persistBottleLocale(l.code);
                      setLangOpen(false);
                    }}
                  >
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
          {/* 영상이 종이로 잠기는 하단 페이드 — 다음 섹션이 아니라 영상 위에 얹는다 */}
          <span className={styles.filmFade} aria-hidden />
        </section>

        {/* ── 01 Bottle Identity ── */}
        <section className={`${styles.identity} ${styles.reveal}`} ref={identityRef}>
          {/* 빈 네모는 아무 뜻도 없는 장식이었다. 기록 히어로·인증서 서명과 같은
              자물쇠 글리프를 써서 "암호로 확인된 태그"라는 뜻을 형태에 싣는다. */}
          <div className={styles.eyebrow}>
            <svg className={styles.eyebrowLock} width="8" height="10" viewBox="0 0 8 10" aria-hidden>
              <path d="M2.4 4.4 V3 a1.6 1.6 0 0 1 3.2 0 V4.4" fill="none" stroke="currentColor" strokeWidth="0.9" />
              <rect x="1" y="4.4" width="6" height="4.7" rx="0.9" fill="currentColor" />
            </svg>
            <span>{copy.identityEyebrow}</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.imagePortrait ?? meta.image}
            alt={meta.name}
            className={styles.identityBottle}
          />
          <h1 className={styles.productName}>{meta.name}</h1>
          <div className={styles.identityTagline}>{copy.identityTagline}</div>
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
          {/* "소유 등록 후 열립니다" — 이미 등록된 병에는 틀린 말이라 숨긴다.
              기록으로 가는 입구는 아래 Claim 섹션이 맡는다. */}
          {!registered && (
          <div className={styles.provHint}>
            {/* 화살표 없음 — 링크가 아니라 안내문이다. 셰브론이 붙으면 누를 수 있다고 읽힌다. */}
            <span>{copy.provHint}</span>
          </div>
          )}
        </section>

        {/* ── 03 Claim Ownership ── */}
        <section className={`${styles.claim} ${styles.reveal}`}>
          <div className={styles.claimEyebrow}>{copy.ownEyebrow}</div>
          <h2 className={styles.claimTitle}>{registered ? copy.claimedTitle : ownTitle}</h2>
          {registered ? (
            /* 이미 등록된 병. 폼을 지우고 그 자리에 소유자와 기록 입구를 놓는다 —
               재등록은 서버 액션에서도 막히지만, 애초에 쓸 수 없는 폼을 보여줄 이유가 없다. */
            <>
              <p className={styles.claimBody}>{copy.claimedBody}</p>
              <div className={styles.claimed}>
                <span className={styles.claimedLabel}>OWNED BY</span>
                {/* 인증서·각인 화면과 같은 조판 — 로마자 서명체 위, 한글 정자 아래 */}
                {registeredToLatin ? (
                  <>
                    <span className={styles.claimedScript}>{registeredToLatin}</span>
                    <span className={styles.claimedNative}>{registeredTo}</span>
                  </>
                ) : (
                  <span className={styles.claimedName}>{registeredTo ?? "—"}</span>
                )}
              </div>
              <Link href={`/b/${code}/record`} className={styles.claimedCta}>
                {copy.claimedCta}
              </Link>
            </>
          ) : (
          <p className={styles.claimBody}>{ownBody}</p>
          )}

          {!registered && (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {/* 라틴 로케일은 아래 로마자 칸이 곧 이름이라 자국어 칸을 두지 않는다 */}
            {!isLatinLocale && (
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
            )}

            {/* 인증서에 새겨질 로마자 — 성과 이름을 나눠 받아야 순서를 정할 수 있다 */}
            <div className={styles.fieldRow}>
              <label className={`${styles.field} ${styles.fieldHalf}`}>
                <span className={styles.fieldLabel}>{copy.latinGivenLabel}</span>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={copy.latinGivenPlaceholder}
                  value={latinGiven}
                  onChange={(ev) => setLatinGiven(ev.target.value)}
                  autoComplete="given-name"
                  enterKeyHint="next"
                />
              </label>
              <label className={`${styles.field} ${styles.fieldHalf}`}>
                <span className={styles.fieldLabel}>{copy.latinFamilyLabel}</span>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={copy.latinFamilyPlaceholder}
                  value={latinFamily}
                  onChange={(ev) => setLatinFamily(ev.target.value)}
                  autoComplete="family-name"
                  enterKeyHint="next"
                />
              </label>
            </div>
            <p className={styles.latinNote}>{copy.latinNote}</p>

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

            <button
              type="submit"
              className={`${styles.submit} ${submitting ? styles.submitBusy : ""}`}
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? copy.submitting : copy.submit}
            </button>
          </form>
          )}
        </section>
      </div>
    </main>
  );
}
