"use client";

/**
 * /b 입장 페이지 — NFC 태그가 가장 먼저 여는 화면.
 * 로고 인트로(디졸브) → 풀필름 히어로 → Bottle Identity(N°·에디션) →
 * Provenance(세 가지 증거) → Claim Ownership(이름·이메일 → "N° {serial}을 소장하기").
 * 등록 성공 시 등록 완료 화면(BottleInscription)으로 전환, CTA로 기록 페이지(/record) 진입.
 * 표기 규칙: 병 번호 N°/총량. 커머스 문구 금지. 다크·앰버·시네마틱(기록 페이지와 동일 톤).
 */

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./entry.module.css";
import { entryCopy, PRODUCT_META, RECORD_EXTRA, BOTTLE_LOCALES, type BottleLocale } from "../_lib/copy";
import { persistBottleLocale } from "../_lib/locale";
import { agingMonths, immersionYear } from "../_lib/duration";
import { formatOwnerLatin } from "../_lib/owner-name";
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
  immersion,
  retrieval,
  initialLocale = "ko",
  registered = false,
  registeredTo = null,
  registeredToLatin = null,
}: {
  code: string;
  productId: string;
  serial: number | null;
  total: number;
  /* 제품 식별의 나머지 두 조각(입수 연차 · 숙성 기간)이 여기서 파생된다 —
     큐베명만으로는 1년물·2년물이, 연차가 없으면 이듬해 입수분이 같은 이름이 된다.
     제품 마스터를 해마다 늘리지 않고 배치(inventory_batches)에서 얻는다. */
  immersion: string | null;
  retrieval: string | null;
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
  /* 숙성 기간이 문장 안에 박힌 카피가 있다(등록 완료 화면의 "사계절의 기록") —
     어느 묶음을 세울지 배치 기간이 정한다. copy.ts의 2년물 오버레이 참고. */
  const months = agingMonths(immersion, retrieval);
  const copy = entryCopy(locale, months);
  /* 라틴 로케일은 이름 자체가 로마자라 자국어 칸을 따로 두지 않는다 */
  const isLatinLocale = locale === "en" || locale === "fr";
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;
  /* ja·zh 지면의 CJK 세리프를 각 언어 서체로 돌린다. 규칙마다 modifier를 달지 않고
     루트에서 --e-serif-cjk 토큰 하나를 갈아끼운다(entry.module.css).
     하위의 BottleInscription도 이 루트 안에 있어 함께 따라온다. */
  const scriptClass = locale === "ja" ? styles.pageJa : locale === "zh" ? styles.pageZh : "";

  const [introOut, setIntroOut] = useState(false);
  const [name, setName] = useState("");
  /* 인증서 서명체는 로마자로만 쓸 수 있다(브랜드 Signature 활자가 라틴 전용).
     자국어 이름과 따로 받아, 인증서에는 "이름 성" 순서로 새긴다. */
  const [latinGiven, setLatinGiven] = useState("");
  const [latinFamily, setLatinFamily] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  /* 이미 등록된 병으로 들어오면 각인 화면부터 — 등록 직후 본 화면과 같은 얼굴이다. */
  const [inscribed, setInscribed] = useState(registered);
  const [inscribedName, setInscribedName] = useState(registeredTo ?? "");
  const [inscribedLatin, setInscribedLatin] = useState<string | null>(registeredToLatin);
  /* 등록 시트 — 필름이 끝나면 히어로 위로 올라온다.
     위로 남은 필름 조각을 누르면 다시 내려가고(다시 보기), 끝나면 또 올라온다 */
  const [sheetUp, setSheetUp] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /* 영상 기준 등판 예약 — 다시 보기 때 재예약하므로 이전 것을 지워야 한다 */
  const sheetTimerRef = useRef<number | null>(null);
  const scheduleSheetUp = (ms: number) => {
    if (sheetTimerRef.current !== null) window.clearTimeout(sheetTimerRef.current);
    sheetTimerRef.current = window.setTimeout(() => setSheetUp(true), ms);
  };

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

  /* 등록 시트 등판 — 필름이 끝나는 시점에 올린다.
     지금은 실영상이 없어(ENTRY_VIDEO_SRC=null) 인트로 디졸브(1.7s)가 걷히고
     화면이 한 박자 가라앉은 뒤(합계 3.2s)를 "끝"으로 삼는다. 영상이 생기면
     video의 onLoadedMetadata가 실제 길이로 이 타이머를 대체한다(아래 JSX).
     reduced-motion은 기다림 자체가 연출이므로 즉시 올린다. */
  useEffect(() => {
    if (inscribed || sheetUp) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* reduce여도 0ms 타이머로 미룬다 — 이펙트 본문의 동기 setState는 연쇄 렌더가 된다 */
    if (!reduce && ENTRY_VIDEO_SRC) return; // 영상이 있으면 영상 길이가 결정한다
    const t = setTimeout(() => setSheetUp(true), reduce ? 0 : 3200);
    return () => clearTimeout(t);
  }, [inscribed, sheetUp]);

  /* 영상 예약 타이머는 언마운트 때만 정리한다 — sheetUp 변화에 정리하면 예약이 죽는다 */
  useEffect(() => {
    return () => {
      if (sheetTimerRef.current !== null) window.clearTimeout(sheetTimerRef.current);
    };
  }, []);

  /* 필름 다시 보기 — 시트 위로 남은 필름 조각을 눌렀을 때.
     영상이 있으면 처음부터 다시 틀고 그 길이만큼, 없으면 no-video 이펙트가
     (sheetUp이 false로 돌아가며) 3.2초 타이머를 다시 건다. */
  const replayFilm = () => {
    if (!sheetUp) return;
    setSheetUp(false);
    const v = videoRef.current;
    if (v) {
      try {
        v.currentTime = 0;
        void v.play();
      } catch {
        /* 자동재생 거부 등 — 시트 등판 예약은 그대로 간다 */
      }
      if (Number.isFinite(v.duration) && v.duration > 0) {
        scheduleSheetUp(v.duration * 1000);
      }
    }
  };
  const ownBody =
    serial !== null ? copy.ownBody.replace("{serial}", String(serial)) : copy.ownBodyNoSerial;
  /* 개체는 대명사가 아니라 번호로 부른다 — 번호가 없으면 부르지 않는다 */
  const ownTitle =
    serial !== null ? copy.ownTitle.replace("{serial}", String(serial)) : copy.ownTitleNoSerial;
  /* 버튼도 번호를 부른다("N° 2를 소장하다"). 한국어 목적격 조사는 숫자 끝자리의
     한자어 읽기로 갈린다 — 이(2)·사(4)·오(5)·구(9)는 모음으로 끝나 "를", 나머지는 "을".
     {acc}는 ko 문자열에만 있고 다른 로케일에서는 치환할 자리가 없어 그대로 통과한다. */
  const submitLabel =
    serial !== null
      ? copy.submit
          .replace("{serial}", String(serial))
          .replace("{acc}", [2, 4, 5, 9].includes(serial % 10) ? "를" : "을")
      : copy.submitNoSerial;

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
        /* 인증서와 같은 순서(이름 성)·같은 표기 규칙(첫 글자만 대문자)으로 합쳐 넘긴다 —
           등록 직후 본 이름과 인증서의 이름이 다르면 다른 문서로 읽힌다 */
        setInscribedLatin(formatOwnerLatin(given, family));
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
      <main className={`${styles.page} ${scriptClass} b-paper`}>
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
            /* 이 화면에는 숙성 기간을 담은 표가 없다 — 제품 식별 세 조각이 여기서 다 끝나야 한다.
               기간 표기는 record·certificate·owner가 쓰는 것과 같은 로케일 문자열을 쓴다.
               배치가 없는 병은 세우지 않는다 — 없는 연도를 지어내지 않는다. */
            productSub={
              immersion
                ? `${immersionYear(immersion)} · ${RECORD_EXTRA[locale].ownMonths.replace("{n}", String(months))}`
                : null
            }
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
    <main className={`${styles.page} ${scriptClass}`}>
      {/* ── 로고 인트로 (디졸브) ── */}
      <div className={`${styles.intro} ${introOut ? styles.introOut : ""}`} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo/logo_intro_W.png" alt="" className={styles.introLogo} />
      </div>

      <div className={styles.frame} ref={frameRef}>
        {/* ── S1 풀필름 히어로 ──
            시트가 올라온 뒤 위로 남은 필름 조각을 누르면 시트가 내려가 필름을
            다시 볼 수 있다. 언어 선택기·재생 버튼 등 버튼 클릭은 건드리지 않는다. */}
        <section
          className={`${styles.film} ${sheetUp ? styles.filmDimmed : ""}`}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            replayFilm();
          }}
        >
          {ENTRY_VIDEO_SRC && (
            <video
              ref={videoRef}
              className={styles.filmVideo}
              src={ENTRY_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              /* 첫 재생이 끝나는 시점에 등록 시트를 올린다. loop 중이라 ended가
                 오지 않으므로 길이를 읽어 예약한다 — 영상은 시트 뒤에서 계속 돈다 */
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                if (Number.isFinite(v.duration) && v.duration > 0) {
                  scheduleSheetUp(v.duration * 1000);
                }
              }}
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

          {/* 기다리지 않을 사람의 길 — 누르면 시트가 바로 올라온다 */}
          <button
            type="button"
            className={styles.filmCenter}
            onClick={() => setSheetUp(true)}
            aria-label={copy.filmCaption}
          >
            <span className={styles.playBtn}>
              <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
                <path d="M2 1.5 L16.5 10 L2 18.5 Z" fill="rgba(241,239,235,0.82)" />
              </svg>
            </span>
            <span className={styles.filmCaption}>{copy.filmCaption}</span>
            <span className={styles.filmMeta}>{copy.filmMeta}</span>
          </button>

          <span className={styles.filmTail} aria-hidden />
          {/* 영상이 종이로 잠기는 하단 페이드 — 다음 섹션이 아니라 영상 위에 얹는다 */}
          <span className={styles.filmFade} aria-hidden />
        </section>

        {/* ── 등록 시트 — 필름 위로 올라오는 종이 ──
            병 정보·세 가지 증거 섹션은 걷어냈다(2026-07-27 대표 지시: 히어로만
            남기고 바로 등록). 그 내용은 등록 뒤 기록 페이지가 다 보여준다. */}
        <div
          className={`${styles.sheet} ${sheetUp ? styles.sheetUp : ""}`}
          aria-hidden={!sheetUp}
        >
        <section className={styles.claim}>
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

            {/* 버튼은 시트 바닥에 고정한다 — 작은 화면에서 접히는 선 아래로 밀리면
                등록으로 가는 길이 안 보인다. 위 내용은 이 독 아래로 흘러 지나간다. */}
            <div className={styles.submitDock}>
              <button
                type="submit"
                className={`${styles.submit} ${submitting ? styles.submitBusy : ""}`}
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? copy.submitting : submitLabel}
              </button>
            </div>
          </form>
          )}
        </section>
        </div>
      </div>
    </main>
  );
}
