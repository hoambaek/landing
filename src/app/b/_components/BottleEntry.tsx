"use client";

/**
 * /b 입장 페이지 — NFC 태그가 가장 먼저 여는 화면.
 * 로고 인트로(디졸브) → 풀스크린 영상 placeholder → 스크롤 → 감사·대형 N° →
 * 이름/이메일 등록(명부) → "입장하기"로 기록 페이지(/record) 진입.
 * 표기 규칙: 병 번호 N°/총량. 커머스 문구 금지. 다크·앰버·시네마틱(기록 페이지와 동일 톤).
 */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./entry.module.css";
import { ENTRY_COPY } from "../_lib/copy";
import { submitBottleRegistration } from "@/lib/forms";
import PlaqueDroplets from "./PlaqueDroplets";

/** 실제 풀스크린 영상 소스가 확보되면 지정 (예: "/videos/entry-loop.mp4"). null이면 포스터 상태로 렌더. */
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
  const copy = ENTRY_COPY.ko;

  const [introOut, setIntroOut] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [displaySerial, setDisplaySerial] = useState(0);
  const registerRef = useRef<HTMLElement>(null);
  const countedRef = useRef(false);

  /* 로고 인트로 디졸브 — 마운트 후 정착, reduced-motion이면 즉시 해제 */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIntroOut(true);
      return;
    }
    const t = setTimeout(() => setIntroOut(true), 1700);
    return () => clearTimeout(t);
  }, []);

  /* 등록 섹션 스크롤 리빌 + 큰 N° 카운트업 (0→serial, ease-out cubic 1.6s) */
  useEffect(() => {
    const el = registerRef.current;
    if (!el) return;
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

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.revealIn);
            startCount();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [serial]);

  const registerSub =
    serial !== null ? copy.registerSub.replace("{serial}", String(serial)) : copy.registerSubNoSerial;

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
        locale: "ko",
      });
      if (res.ok) {
        router.push(`/b/${code}/record`);
      } else {
        setError(res.error ?? copy.errGeneric);
        setSubmitting(false);
      }
    } catch {
      setError(copy.errGeneric);
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      {/* ── 로고 인트로 (디졸브) ── */}
      <div className={`${styles.intro} ${introOut ? styles.introOut : ""}`} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo/logo_intro_W.png" alt="" className={styles.introLogo} />
      </div>

      <div className={styles.frame}>
        {/* ── S1 히어로 (풀스크린 영상 placeholder) ── */}
        <section className={styles.hero}>
          {ENTRY_VIDEO_SRC && (
            <video
              className={styles.heroVideo}
              src={ENTRY_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/logo_trans_W_lg.png" alt="Muse de Marée" className={styles.heroLogo} />

          {!ENTRY_VIDEO_SRC && (
            <div className={styles.heroCenter}>
              <span className={styles.playGlyph}>
                <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
                  <path d="M2 1.5 L16.5 10 L2 18.5 Z" fill="rgba(241,239,235,0.82)" />
                </svg>
              </span>
            </div>
          )}

          <div className={styles.heroTail} aria-hidden />
        </section>

        {/* ── S2 감사 + 등록 ── */}
        <section className={styles.register} ref={registerRef}>
          <div className={styles.eyebrow}>
            <svg className={styles.eyebrowIcon} width="13" height="14" viewBox="0 0 14 15" fill="none" aria-hidden>
              <path d="M7 1 L12.2 2.9 V7.2 C12.2 10.4 10 12.8 7 13.9 C4 12.8 1.8 10.4 1.8 7.2 V2.9 Z" fill="rgba(204,173,123,0.1)" stroke="#CCAD7B" strokeWidth="1" strokeLinejoin="round" />
              <path d="M4.8 7.3 L6.3 8.8 L9.2 5.5" fill="none" stroke="#CCAD7B" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{copy.eyebrow}</span>
          </div>

          <Image
            src="/images/b-entry-thanks-ko-v2.png"
            alt={copy.thanksTitle.replace("\n", " ")}
            width={292}
            height={71}
            className={styles.thanksTitle}
            priority
          />

          {serial !== null && (
            <div className={styles.serialPlate}>
              <PlaqueDroplets />
              <div className={styles.serial}>
                <span className={styles.serialNo}>N°</span>
                <span className={styles.serialNum}>{displaySerial}</span>
                <span className={styles.serialTotal}>/ {total}</span>
              </div>
            </div>
          )}

          {/* 등록 카드(명부) — 타이틀·안내·폼·입장하기를 하나의 패널로 */}
          <div className={styles.registerCard}>
            <Image
              src="/images/b-entry-register-ko-v3.png"
              alt={copy.registerTitle}
              width={306}
              height={28}
              className={styles.registerTitle}
            />
            <p className={styles.registerSub}>{registerSub}</p>

            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{copy.nameLabel}</span>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={copy.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  enterKeyHint="go"
                />
              </label>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? copy.submitting : copy.submit}
              </button>
            </form>
          </div>

          {/* 기록 예고 — 입장 후 열리는 숙성 여정·실측 데이터를 미리 알린다 */}
          <div className={styles.recordPreview}>
            <span className={styles.previewConnector} aria-hidden />
            <p className={styles.previewLead}>{copy.previewLead}</p>
            <ul className={styles.previewItems}>
              <li className={styles.previewItem}>
                <span className={styles.previewGlyph} aria-hidden>
                  <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
                    <line x1="1" y1="7" x2="33" y2="7" stroke="rgba(241,239,235,0.22)" strokeWidth="0.7" strokeDasharray="1 3" />
                    <line x1="1" y1="22" x2="33" y2="22" stroke="rgba(204,173,123,0.28)" strokeWidth="0.7" strokeDasharray="1 3" />
                    <path d="M3 7 L12 7 C17 7 16 22 22 22" stroke="rgba(241,239,235,0.6)" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M22 22 L28 22" stroke="#CCAD7B" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M28 22 C31 20 32 12 32.5 8" stroke="rgba(204,173,123,0.7)" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="22" cy="22" r="1.9" fill="#CCAD7B" />
                    <circle cx="28" cy="22" r="1.9" fill="#CCAD7B" />
                  </svg>
                </span>
                <span className={styles.previewText}>
                  <span className={styles.previewLabel}>{copy.previewJourney}</span>
                  <span className={styles.previewSub}>{copy.previewJourneySub}</span>
                </span>
              </li>
              <li className={styles.previewItem}>
                <span className={styles.previewGlyph} aria-hidden>
                  <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
                    <line x1="1" y1="24" x2="33" y2="24" stroke="rgba(241,239,235,0.14)" strokeWidth="0.7" />
                    <polyline points="2,20 8,16 14,19 20,13 26,17 32,14" fill="none" stroke="rgba(241,239,235,0.3)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="2,15 8,8 14,12 20,4 26,10 32,6" fill="none" stroke="#CCAD7B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="20" cy="4" r="1.7" fill="#CCAD7B" />
                    <circle cx="32" cy="6" r="1.5" fill="#CCAD7B" />
                  </svg>
                </span>
                <span className={styles.previewText}>
                  <span className={styles.previewLabel}>{copy.previewData}</span>
                  <span className={styles.previewSub}>{copy.previewDataSub}</span>
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
