"use client";

/**
 * /b 소유 정보 관리 (Paper "03A — 소유 정보 관리") + 소유자 인증(phase-3).
 * 미인증: 마스킹된 소유자 표시 + "본인 인증"(등록 이메일 OTP).
 * 인증(세션 유효): 이름 전체 표시 + 이름·이메일 수정.
 * 변경은 서버 액션에서 세션을 재확인한 뒤에만 실행된다.
 */

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./owner.module.css";
import {
  PRODUCT_META,
  RECORD_EXTRA,
  BOTTLE_LOCALES,
  OWNER_CONTACT_EMAIL,
  type BottleLocale,
} from "../_lib/copy";
import { persistBottleLocale } from "../_lib/locale";
import type { BottleRecordData, BottleOwner } from "../_lib/data";
import {
  requestOwnerOtp,
  verifyOwnerOtp,
  signOutOwner,
  updateOwnerName,
} from "../_lib/owner-actions";

type Panel = "none" | "otp" | "edit" | "lang";

export default function BottleOwnerManage({
  code,
  data,
  ownerMasked,
  authed,
  ownerFull,
  locale = "ko",
}: {
  code: string;
  data: BottleRecordData;
  ownerMasked: BottleOwner | null;
  authed: boolean;
  ownerFull: { name: string; email: string } | null;
  locale?: BottleLocale;
}) {
  const router = useRouter();
  /* 언어 선택기는 두지 않는다. /b 공통 쿠키(b_lang)를 서버가 읽어 넘겨주고,
     전환은 입장·기록·인증서에서 한다. 여기서 또 고르게 하면 선택 지점만 늘어난다. */
  const extra = RECORD_EXTRA[locale];
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;
  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const serial = data.bottle.serial;

  /* 숙성 개월 수 — 기록 페이지와 같은 계산(입수·인양 연도 차 × 12) */
  const durationMonths = useMemo(() => {
    const i = data.aging.immersion;
    const r = data.aging.retrieval;
    const years = i && r ? Math.max(1, Number(r.slice(0, 4)) - Number(i.slice(0, 4))) : 1;
    return years * 12;
  }, [data.aging.immersion, data.aging.retrieval]);

  /* 이름은 공개값이므로 인증 여부와 무관하게 같다. 이메일만 인증 후 전체가 열린다. */
  const displayName = ownerFull?.name ?? ownerMasked?.name ?? extra.certOwnerFallback;
  const displayEmail = authed && ownerFull ? ownerFull.email : ownerMasked?.emailMasked ?? "";

  const [panel, setPanel] = useState<Panel>("none");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // OTP
  const [otpStage, setOtpStage] = useState<"request" | "code">("request");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // edit — 이름만. 이메일은 인증 근거라 편집 대상이 아니다.
  const [editName, setEditName] = useState(ownerFull?.name ?? "");

  function openAuth() {
    setErr(null);
    setOtpStage("request");
    setPanel("otp");
  }

  async function onRequestCode() {
    if (busy) return;
    setBusy(true);
    setErr(null);
    const res = await requestOwnerOtp(code);
    setBusy(false);
    if (res.ok) {
      setOtpEmail(res.emailMasked ?? "");
      setOtpStage("code");
    } else {
      setErr(res.error ?? extra.ownErrGeneric);
    }
  }

  async function onVerifyCode(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    const res = await verifyOwnerOtp(code, otpCode);
    setBusy(false);
    if (res.ok) {
      setPanel("none");
      setOtpCode("");
      router.refresh();
    } else {
      setErr(res.error ?? extra.ownErrCode);
    }
  }

  async function onSignOut() {
    await signOutOwner(code);
    router.refresh();
  }

  function openEdit() {
    if (!authed) return openAuth();
    setEditName(ownerFull?.name ?? "");
    setErr(null);
    setPanel("edit");
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    const res = await updateOwnerName(code, editName);
    setBusy(false);
    if (res.ok) {
      setPanel("none");
      router.refresh();
    } else {
      setErr(res.error ?? extra.ownErrSave);
    }
  }

  /* 쿠키에 쓰고 서버를 다시 태운다 — 이 화면의 언어는 서버 prop이라 refresh 없이는 안 바뀐다 */
  function chooseLocale(next: BottleLocale) {
    setPanel("none");
    if (next === locale) return;
    persistBottleLocale(next);
    router.refresh();
  }

  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        {/* ── 헤더 ── */}
        <header className={styles.header}>
          <Link href={`/b/${code}/record`} className={styles.back} aria-label="Back">‹</Link>
          <div className={styles.headerLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans_W_lg.png" alt="" className={styles.headerSymbol} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_text_trans_W.png" alt="Muse de Marée" className={styles.headerWordmark} />
          </div>
          <span className={styles.headerSpacer} aria-hidden />
        </header>

        {/* ── 등록된 소유자 ──
            이 페이지의 이름은 "인증서에 새길 이름"이다. 그래서 폼 출력값이 아니라
            각인으로 보이게 한다 — 인장 획 → 라벨 → 세리프 이름(인증서 .ownerName과 같은 언어). */}
        <section className={styles.identity}>
          <span className={styles.identityRule} aria-hidden />
          <span className={styles.identityHead}>{extra.ownHead}</span>
          <p className={styles.identityName}>{displayName}</p>
          {displayEmail && <p className={styles.identityEmail}>{displayEmail}</p>}
          {/* 두 상태는 뜻이 다르다. 자물쇠는 "본인임을 증명했다"는 뜻이라 인증됐을 때만 붙인다.
              미인증의 "소유 등록 완료"는 사실 진술이라 조용한 칩으로 둔다. */}
          <span className={`${styles.identityStatus} ${authed ? styles.identityStatusOn : ""}`}>
            {authed && (
              <svg className={styles.statusLock} width="8" height="10" viewBox="0 0 8 10" aria-hidden>
                <path d="M2.4 4.4 V3 a1.6 1.6 0 0 1 3.2 0 V4.4" fill="none" stroke="currentColor" strokeWidth="0.9" />
                <rect x="1" y="4.4" width="6" height="4.7" rx="0.9" fill="currentColor" />
              </svg>
            )}
            <span>{authed ? extra.ownAuthed : extra.ownVerified}</span>
          </span>
          {authed ? (
            <button type="button" className={styles.textAction} onClick={onSignOut}>{extra.ownSignOut}</button>
          ) : (
            <button type="button" className={styles.authCta} onClick={openAuth}>{extra.ownAuthOpen}</button>
          )}

          {panel === "otp" && (
            <div className={styles.authPanel}>
              {otpStage === "request" ? (
                <>
                  <p className={styles.authLead}>{extra.ownOtpLead}</p>
                  <button type="button" className={styles.panelBtn} onClick={onRequestCode} disabled={busy}>
                    {busy ? extra.ownOtpSending : extra.ownOtpSend}
                  </button>
                </>
              ) : (
                <form onSubmit={onVerifyCode}>
                  <p className={styles.authLead}>{extra.ownOtpSent.replace("{email}", otpEmail)}</p>
                  <input
                    className={styles.panelInput}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder={extra.ownOtpPlaceholder}
                    value={otpCode}
                    onChange={(ev) => setOtpCode(ev.target.value.replace(/\D/g, ""))}
                    autoFocus
                  />
                  <button type="submit" className={styles.panelBtn} disabled={busy}>
                    {busy ? extra.ownOtpVerifying : extra.ownOtpVerify}
                  </button>
                  <button type="button" className={styles.textAction} onClick={onRequestCode} disabled={busy}>
                    {extra.ownOtpResend}
                  </button>
                </form>
              )}
              {err && <p className={styles.panelErr}>{err}</p>}
            </div>
          )}
        </section>

        {/* ── 소유한 병 ──
            소장품을 보는 자리다. 병 사진 없이 번호 상자만 두면 설정 행처럼 읽힌다.
            사진(실체) → 에디션(몇 번째인가) → 이름 → 바다 기록 순으로 위계를 세운다. */}
        <section className={styles.linked}>
          <h2 className={styles.groupHead}>{extra.ownBottleHead}</h2>
          <Link href={`/b/${code}/certificate`} className={styles.linkedCard}>
            <span className={styles.linkedPlate}>
              <Image
                src={meta.imagePortrait ?? meta.image}
                alt=""
                width={200}
                height={336}
                className={styles.linkedBottle}
              />
            </span>
            <span className={styles.linkedInfo}>
              <span className={styles.linkedEdition}>
                <span className={styles.linkedEdNo}>N°</span>
                <span className={styles.linkedEdNum}>{serial ?? "—"}</span>
                <span className={styles.linkedEdTotal}>/ {meta.quantity}</span>
              </span>
              <span className={styles.linkedName}>{meta.name}</span>
              {/* 품종·스타일은 제품마다 있을 수도 없을 수도 있다(first_edition은 둘 다 없음) */}
              {(meta.cepage || meta.style) && (
                <span className={styles.linkedTrait}>
                  {[meta.cepage, meta.style].filter(Boolean).join(" · ")}
                </span>
              )}
              <span className={styles.linkedRule} aria-hidden />
              {/* 값은 전부 실제 기록에서 파생 — 하드코딩 "12개월"은 걷어냈다 */}
              <span className={styles.linkedFacts}>
                <span className={styles.linkedFact}>
                  <span className={styles.linkedFactLabel}>{extra.seaLabels.depth}</span>
                  <span className={styles.linkedFactValue}>{data.aging.depth}m</span>
                </span>
                <span className={styles.linkedFact}>
                  <span className={styles.linkedFactLabel}>{extra.seaLabels.duration}</span>
                  <span className={styles.linkedFactValue}>{extra.ownMonths.replace("{n}", String(durationMonths))}</span>
                </span>
              </span>
            </span>
            {/* 셰브론은 뺐다. 카드 자체가 큼직한 탭 대상이라 행 화살표는 군더더기이고,
                그 28px이 품종 줄을 두 줄로 쪼개고 있었다. */}
          </Link>
        </section>

        {/* ── 소유자 정보 ── */}
        <section className={styles.group}>
          <h2 className={styles.groupHead}>{extra.ownAccountHead}</h2>
          <button
            type="button"
            className={`${styles.settingRow} ${panel === "edit" ? styles.settingRowOpen : ""}`}
            onClick={openEdit}
            aria-expanded={panel === "edit"}
          >
            <span className={styles.settingText}>
              <span className={styles.settingTitle}>{extra.ownEditName}</span>
              <span className={styles.settingSub}>{extra.ownEditNameSub}</span>
            </span>
            <span className={styles.settingArrow} aria-hidden>
              <svg width="5" height="9" viewBox="0 0 5 9">
                <polyline
                  points="0.9,0.9 4.1,4.5 0.9,8.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {panel === "edit" && (
            <form className={`${styles.panel} ${styles.rowPanel}`} onSubmit={onSaveEdit}>
              <label className={styles.panelField}>
                <span className={styles.panelLabel}>{extra.ownFieldName}</span>
                <input className={`${styles.panelInput} ${styles.panelInputLead}`} value={editName} onChange={(ev) => setEditName(ev.target.value)} autoComplete="name" />
              </label>
              {/* 이메일은 읽기 전용. 여기서 바꾸면 OTP를 받는 사람이 달라져
                  동의도 기록도 없는 소유권 이전이 된다. */}
              <div className={`${styles.panelField} ${styles.panelReadonly}`}>
                <span className={`${styles.panelLabel} ${styles.panelLabelMuted}`}>{extra.ownFieldEmail}</span>
                <span className={styles.panelStatic}>{displayEmail}</span>
                {/* 줄바꿈을 브라우저에 맡기면 "문의해 / 주세요"로 쪼개진다 */}
                <span className={styles.panelNote}>
                  {extra.ownEmailLocked}
                  <br />
                  {extra.ownEmailLockedTo.replace("{email}", OWNER_CONTACT_EMAIL)}
                </span>
              </div>
              {err && <p className={styles.panelErr}>{err}</p>}
              <div className={styles.panelRow}>
                <button type="button" className={styles.panelCancel} onClick={() => setPanel("none")}>{extra.ownCancel}</button>
                <button type="submit" className={styles.panelBtn} disabled={busy}>{busy ? extra.ownSaving : extra.ownSave}</button>
              </div>
            </form>
          )}

          <button
            type="button"
            className={`${styles.settingRow} ${panel === "lang" ? styles.settingRowOpen : ""}`}
            onClick={() => setPanel(panel === "lang" ? "none" : "lang")}
            aria-expanded={panel === "lang"}
          >
            <span className={styles.settingText}>
              <span className={styles.settingTitle}>{extra.ownLanguage}</span>
              <span className={styles.settingSub}>{activeLocale.native}</span>
            </span>
            <span className={styles.settingArrow} aria-hidden>
              <svg width="5" height="9" viewBox="0 0 5 9">
                <polyline
                  points="0.9,0.9 4.1,4.5 0.9,8.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {panel === "lang" && (
            <div className={`${styles.rowPanel} ${styles.langList}`} role="listbox">
              {BOTTLE_LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={l.code === locale}
                  className={`${styles.langOpt} ${l.code === locale ? styles.langOptActive : ""}`}
                  onClick={() => chooseLocale(l.code)}
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

          {/* "소식 알림" 행은 걷어냈다. 설정 토글처럼 보이는데 실제로는 record 페이지로
              보내기만 했고, 구독 상태를 조회할 방법이 없어 켜졌는지 꺼졌는지 보여줄 수도 없었다.
              동작하는 구독 폼은 record 하단에 있다. */}
        </section>

        {/* 푸터를 걷어냈다. 백링크가 헤더 ‹와 목적지(/record)까지 완전히 같은 중복이었고,
            페이지가 63px만 스크롤돼 하단 탈출구가 필요 없다. "소유 기록 · N° 89"는
            바로 위 병 카드에 이미 있는 정보였다. */}
      </div>
    </main>
  );
}
