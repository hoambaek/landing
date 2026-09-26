"use client";

/**
 * /b 소유 정보 관리 — Paper "03A 소유 정보 관리" · "03B 본인 인증" · "03C 이름 수정" · "03D 언어 선택".
 *
 * 03A: 필기체 이름 · 가린 이메일 · 소유한 병(병 사진 + 번호 · 큐베명 · 인증서 보기) ·
 *      이름 수정 · 언어 · 이메일(읽기 전용, 변경은 문의). 소유권 이전 경로는 없다.
 * 03B: 등록 이메일로 6자리 코드(5분 유효). 전체 보기와 수정은 본인 인증 뒤에만 열린다.
 * 03C: 입력하는 동안 인증서에 표기될 이름을 위에 미리 보인다.
 * 03D: 설정 위로 올라오는 하단 시트(각 언어 네이티브 표기, 활성 항목은 앰버 점, 국기 없음).
 *
 * 변경은 서버 액션에서 세션을 재확인한 뒤에만 실행된다(owner-actions.ts).
 */

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./owner.module.css";
import ui from "./ui.module.css";
import {
  PRODUCT_META,
  RECORD_EXTRA,
  ENTRY_COPY,
  BOTTLE_LOCALES,
  type BottleLocale,
} from "../_lib/copy";
import { persistBottleLocale } from "../_lib/locale";
import type { BottleRecordData, BottleOwner, OwnedBottle } from "../_lib/data";
import { useSafeAreaTint } from "../_lib/use-safe-area-tint";
import { agingMonths, immersionYear } from "../_lib/duration";
import { formatOwnerLatin } from "../_lib/owner-name";
import { registeredDate } from "../_lib/cert-text";
import { useFitText } from "../_lib/use-fit-text";
import {
  requestOwnerOtp,
  verifyOwnerOtp,
  signOutOwner,
  updateOwnerName,
} from "../_lib/owner-actions";

type View = "main" | "otp" | "edit";

/** 인증 코드 유효 시간 — owner-actions.ts의 expires(5분)와 같아야 한다 */
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_LEN = 6;

/* 섹션 라벨 — 브랜드 라틴(번역하지 않는다) + 지면 언어. 영어 지면은 같은 말이라 한 번만 쓴다 */
function sectionLabel(latin: string, local: string, locale: BottleLocale): string {
  return locale === "en" ? latin : `${latin} · ${local}`;
}

export default function BottleOwnerManage({
  code,
  data,
  ownerMasked,
  authed,
  ownerFull,
  ownedBottles = [],
  locale = "ko",
  startVerify = false,
  prefillCode = null,
}: {
  code: string;
  data: BottleRecordData;
  ownerMasked: BottleOwner | null;
  authed: boolean;
  ownerFull: { name: string; email: string; givenLatin: string | null; familyLatin: string | null } | null;
  /* 같은 이메일로 등록된 병 전부. 인증과 무관하게 채워져 온다 */
  ownedBottles?: OwnedBottle[];
  locale?: BottleLocale;
  /** ?verify=1 또는 메일 링크로 왔다 — 03B부터 연다 */
  startVerify?: boolean;
  /** 확인 링크(메일 「본인 인증하기」)로 왔다 — 받은 코드로 스스로 인증한다 */
  prefillCode?: string | null;
}) {
  const router = useRouter();
  const extra = RECORD_EXTRA[locale];
  const entry = ENTRY_COPY[locale];
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;
  const isLatinLocale = locale === "en" || locale === "fr";
  /* ja·zh 지면의 CJK 서체를 각 언어 서체로 돌린다(owner.module.css 토큰) */
  const scriptClass = locale === "ja" ? styles.pageJa : locale === "zh" ? styles.pageZh : "";
  /* 위아래가 전부 검정인 화면 */
  useSafeAreaTint(false);

  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const serial = data.bottle.serial;

  const durationMonths = useMemo(
    () => agingMonths(data.aging.immersion, data.aging.retrieval),
    [data.aging.immersion, data.aging.retrieval],
  );

  /* 소장품 목록 — 같은 이메일로 등록된 병이 전부 온다(인증 불필요).
     서버가 빈 배열을 주는 경우(등록 기록이 없는 병)에는 지금 이 병만 세운다. */
  const cards = useMemo(() => {
    if (ownedBottles.length) {
      return ownedBottles.map((b) => ({
        code: b.code,
        meta: PRODUCT_META[b.productId] ?? PRODUCT_META.atomes_crochus_1y,
        serial: b.serial,
        depth: b.depth,
        months: agingMonths(b.immersion, b.retrieval),
        /* 같은 큐베가 해마다 들어가므로 목록에서는 연차가 있어야 행끼리 구분된다.
           배치가 없는 병은 null — 없는 연도를 지어내지 않는다. */
        year: b.immersion ? immersionYear(b.immersion) : null,
      }));
    }
    return [
      {
        code,
        meta,
        serial,
        depth: data.aging.depth,
        months: durationMonths,
        year: data.aging.immersion ? immersionYear(data.aging.immersion) : null,
      },
    ];
  }, [ownedBottles, code, meta, serial, data.aging.depth, data.aging.immersion, durationMonths]);

  /* 이름은 공개값이므로 인증 여부와 무관하게 같다. 이메일만 인증 후 전체가 열린다. */
  const displayName = ownerFull?.name ?? ownerMasked?.name ?? extra.certOwnerFallback;
  const displayLatin = ownerMasked?.nameLatin ?? null;
  const displayEmail = authed && ownerFull ? ownerFull.email : ownerMasked?.emailMasked ?? "";
  const showNative = !displayLatin || displayName.trim().toLowerCase() !== displayLatin.toLowerCase();
  const registered = registeredDate(ownerMasked?.registeredAt, locale);

  const [view, setView] = useState<View>(startVerify ? "otp" : "main");
  const [langOpen, setLangOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /* 서버 액션의 오류 문구는 한국어다 — 다른 지면에서는 그 지면의 일반 문구로 바꿔 낸다 */
  const localized = (msg: string | undefined, fallback: string) => (locale === "ko" && msg ? msg : fallback);

  // ── 03B OTP
  /* 메일 링크로 왔으면 코드는 이미 보내진 상태다 — 보낸 곳(마스킹)을 그대로 보여 준다 */
  const [otpEmail, setOtpEmail] = useState<string | null>(prefillCode ? (ownerMasked?.emailMasked ?? "") : null);
  const [otpCode, setOtpCode] = useState(prefillCode ?? "");
  const [otpFocused, setOtpFocused] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const otpInputRef = useRef<HTMLInputElement>(null);

  /* 주소창의 코드는 채우자마자 지운다 — 기록·공유·화면 캡처에 코드가 남지 않게 */
  useEffect(() => {
    if (!prefillCode) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("otp");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [prefillCode]);

  useEffect(() => {
    if (expiresAt === null) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [expiresAt]);
  const remaining = expiresAt !== null ? Math.max(0, expiresAt - now) : 0;
  const remainingLabel = `${Math.floor(remaining / 60000)}:${String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0")}`;

  // ── 03C 이름 수정
  const [editName, setEditName] = useState("");
  const [editGiven, setEditGiven] = useState("");
  const [editFamily, setEditFamily] = useState("");
  const [editErrField, setEditErrField] = useState<"name" | "latin" | null>(null);
  /* 라틴 지면에서 등록한 이름은 자국어 이름이 곧 로마자다 — 그 경우만 이름 칸을 두지 않는다 */
  const nameIsLatin =
    !!ownerFull &&
    formatOwnerLatin(ownerFull.givenLatin, ownerFull.familyLatin)?.toLowerCase() === ownerFull.name.trim().toLowerCase();
  const showNameField = !(isLatinLocale && nameIsLatin);
  const previewLatin = formatOwnerLatin(editGiven, editFamily);
  const previewNative = showNameField ? editName.trim() : "";
  const previewScriptRef = useFitText<HTMLParagraphElement>(previewLatin ?? "", 44, 24);
  const ownerScriptRef = useFitText<HTMLParagraphElement>(displayLatin ?? "", 52, 28);

  function goMain() {
    setErr(null);
    setView("main");
  }

  async function sendCode() {
    if (busy) return;
    setBusy(true);
    setErr(null);
    const res = await requestOwnerOtp(code);
    setBusy(false);
    if (res.ok) {
      setOtpEmail(res.emailMasked ?? "");
      setOtpCode("");
      setExpiresAt(Date.now() + OTP_TTL_MS);
      setNow(Date.now());
      otpInputRef.current?.focus();
    } else {
      setErr(localized(res.error, extra.ownErrGeneric));
    }
  }

  /* 「본인 인증하고 전체 보기」 — 누른 동작이 곧 코드 요청이다(사용자 제스처 안에서 보낸다) */
  function openAuth() {
    setErr(null);
    setView("otp");
    if (otpEmail === null || remaining === 0) void sendCode();
  }

  async function verifyWith(value: string) {
    setBusy(true);
    setErr(null);
    const res = await verifyOwnerOtp(code, value);
    setBusy(false);
    if (res.ok) {
      setOtpCode("");
      setExpiresAt(null);
      setOtpEmail(null);
      setView("main");
      router.refresh();
    } else {
      setErr(localized(res.error, extra.ownErrCode));
    }
  }

  async function onVerifyCode(e: FormEvent) {
    e.preventDefault();
    if (busy || otpCode.length !== OTP_LEN) return;
    await verifyWith(otpCode);
  }

  /* 확인 링크로 왔다 — 화면이 뜨자마자 스스로 인증한다(서버 액션 POST).
     링크를 GET으로 미리 여는 메일 보안 검사기는 여기까지 오지 않아 인증을 소모하지 못한다.
     개발 모드의 이펙트 두 번 실행에 코드가 두 번 제출되지 않게 ref로 한 번만 보낸다.
     실패하면(만료·사용됨) 코드가 채워진 03B에 오류를 띄워 둔다 — 재전송으로 이어진다 */
  const autoVerified = useRef(false);
  useEffect(() => {
    if (!prefillCode || authed || autoVerified.current) return;
    autoVerified.current = true;
    void verifyWith(prefillCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 마운트 1회
  }, []);

  async function onSignOut() {
    await signOutOwner(code);
    router.refresh();
  }

  function openEdit() {
    if (!authed || !ownerFull) return openAuth();
    setEditName(ownerFull.name);
    setEditGiven(ownerFull.givenLatin ?? "");
    setEditFamily(ownerFull.familyLatin ?? "");
    setEditErrField(null);
    setErr(null);
    setView("edit");
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const given = editGiven.trim();
    const family = editFamily.trim();
    const latin = formatOwnerLatin(given, family) ?? "";
    const name = showNameField ? editName.trim() : latin;
    if (showNameField && !name) {
      setEditErrField("name");
      setErr(entry.errName);
      return;
    }
    if (!given || !family) {
      setEditErrField("latin");
      setErr(entry.errLatinName);
      return;
    }
    setEditErrField(null);
    setBusy(true);
    setErr(null);
    const res = await updateOwnerName(code, name, { given, family });
    setBusy(false);
    if (res.ok) {
      setView("main");
      router.refresh();
    } else {
      setErr(localized(res.error, extra.ownErrSave));
    }
  }

  /* 쿠키에 쓰고 서버를 다시 태운다 — 이 화면의 언어는 서버 prop이라 refresh 없이는 안 바뀐다 */
  function chooseLocale(next: BottleLocale) {
    setLangOpen(false);
    if (next === locale) return;
    persistBottleLocale(next);
    router.refresh();
  }

  /* 03D 하단 시트 — <dialog>로 연다. 포커스 트랩·Esc·배경 inert가 브라우저 것이다 */
  const langRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dlg = langRef.current;
    if (!dlg) return;
    if (langOpen && !dlg.open) dlg.showModal();
    else if (!langOpen && dlg.open) dlg.close();
  }, [langOpen]);

  const chevron = (
    <svg className={styles.rowChevron} width="8" height="14" viewBox="0 0 8 14" aria-hidden>
      <path d="M1 1 L7 7 L1 13" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );

  const header = (
    <header className={styles.header}>
      {view === "main" ? (
        <Link href={`/b/${code}/record`} className={styles.back} aria-label={extra.certBackNoSerial}>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <path d="M12.5 4 L6.5 10 L12.5 16" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </Link>
      ) : (
        <button type="button" className={styles.back} onClick={goMain} aria-label={extra.ownCancel}>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <path d="M12.5 4 L6.5 10 L12.5 16" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      )}
      <span className={styles.brand}>MUSE DE MARÉE</span>
      <span className={styles.headerSpacer} aria-hidden />
    </header>
  );

  /* ── 03B 본인 인증 ── */
  if (view === "otp") {
    const sent = otpEmail !== null;
    return (
      <main className={`${styles.page} ${scriptClass}`}>
        <div className={styles.frame}>
          {header}
          <section className={styles.subHead}>
            <span className={styles.label}>{sectionLabel("Verification", extra.ownVerifyHead, locale)}</span>
            {sent && <h1 className={styles.subTitle}>{extra.ownOtpTitle}</h1>}
            <p className={styles.subBody}>
              {sent ? extra.ownOtpSent.replace("{email}", otpEmail || "") : extra.ownOtpLead}
            </p>
          </section>

          {sent ? (
            <form className={styles.otpForm} onSubmit={onVerifyCode}>
              {/* 칸 여섯은 그림이다 — 실제 입력은 그 위에 투명하게 얹은 한 칸이 받는다
                  (붙여넣기·SMS 자동 채움·지우기가 한 칸에서 그대로 동작한다) */}
              <div className={styles.otpCells}>
                {Array.from({ length: OTP_LEN }, (_, i) => {
                  const ch = otpCode[i];
                  const active = otpFocused && i === Math.min(otpCode.length, OTP_LEN - 1) && otpCode.length < OTP_LEN;
                  return (
                    <span
                      key={i}
                      className={`${styles.otpCell} ${ch ? styles.otpCellFilled : ""} ${active ? styles.otpCellActive : ""}`}
                      aria-hidden
                    >
                      {ch ?? (active ? <span className={styles.otpCaret} /> : null)}
                    </span>
                  );
                })}
                <input
                  ref={otpInputRef}
                  className={styles.otpInput}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={OTP_LEN}
                  value={otpCode}
                  onChange={(ev) => setOtpCode(ev.target.value.replace(/\D/g, "").slice(0, OTP_LEN))}
                  onFocus={() => setOtpFocused(true)}
                  onBlur={() => setOtpFocused(false)}
                  aria-label={extra.ownOtpPlaceholder}
                  aria-invalid={!!err}
                  autoFocus
                />
              </div>
              {err && <p className={`${ui.error} ${styles.otpError}`}>{err}</p>}
              <div className={styles.otpActions}>
                <button
                  type="submit"
                  className={`${ui.primaryD} ${busy ? styles.busy : ""}`}
                  disabled={busy || otpCode.length !== OTP_LEN}
                  aria-busy={busy}
                >
                  <span>{busy ? extra.ownOtpVerifying : extra.ownOtpVerify}</span>
                  {!busy && <span className={ui.chev} aria-hidden>›</span>}
                </button>
                <button type="button" className={ui.linkD} onClick={sendCode} disabled={busy}>
                  {remaining > 0 ? `${extra.ownOtpResend} · ${remainingLabel}` : extra.ownOtpResend}
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.otpActions}>
              {err && <p className={ui.error}>{err}</p>}
              <button
                type="button"
                className={`${ui.primaryD} ${busy ? styles.busy : ""}`}
                onClick={sendCode}
                disabled={busy}
                aria-busy={busy}
              >
                <span>{busy ? extra.ownOtpSending : extra.ownOtpSend}</span>
                {!busy && <span className={ui.chev} aria-hidden>›</span>}
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  /* ── 03C 이름 수정 ── */
  if (view === "edit") {
    return (
      <main className={`${styles.page} ${scriptClass}`}>
        <div className={styles.frame}>
          {header}
          <section className={`${styles.subHead} ${styles.subHeadTight}`}>
            <span className={styles.label}>{sectionLabel("Name", extra.ownEditName, locale)}</span>
            <p className={styles.subBody}>{extra.ownEditNameSub}</p>
          </section>

          {/* 인증서에 표기될 모습 — 입력하는 동안 그대로 따라 바뀐다 */}
          <div className={styles.preview}>
            <div className={styles.previewPlate}>
              <div className={styles.previewInner}>
                <span className={styles.previewLabel}>{extra.certOwnerLabel}</span>
                <div className={styles.previewScriptBox}>
                  <p ref={previewScriptRef} className={styles.previewScript}>
                    {previewLatin ?? " "}
                  </p>
                </div>
                <span className={styles.previewRule} aria-hidden />
                {previewNative && previewNative.toLowerCase() !== (previewLatin ?? "").toLowerCase() && (
                  <p className={styles.previewNative}>{previewNative}</p>
                )}
              </div>
            </div>
            <p className={styles.previewCaption}>{extra.ownEditPreview}</p>
          </div>

          <form className={styles.editForm} onSubmit={onSaveEdit} noValidate>
            <div className={styles.editFields}>
              {showNameField && (
                <div>
                  <label className={`${ui.field} ${editErrField === "name" ? ui.fieldError : ""}`}>
                    <span className={ui.fieldLabel}>{entry.nameLabel}</span>
                    <input
                      className={ui.input}
                      value={editName}
                      onChange={(ev) => setEditName(ev.target.value)}
                      autoComplete="name"
                      maxLength={60}
                      aria-invalid={editErrField === "name"}
                    />
                  </label>
                  {editErrField === "name" && err && <p className={`${ui.error} ${styles.fieldErr}`}>{err}</p>}
                </div>
              )}
              <div>
                <div className={styles.editRow}>
                  <label
                    className={`${ui.field} ${editErrField === "latin" && !editGiven.trim() ? ui.fieldError : ""}`}
                  >
                    <span className={ui.fieldLabel}>{entry.latinGivenLabel}</span>
                    <input
                      className={ui.input}
                      value={editGiven}
                      onChange={(ev) => setEditGiven(ev.target.value)}
                      autoComplete="given-name"
                      maxLength={40}
                      aria-invalid={editErrField === "latin" && !editGiven.trim()}
                    />
                  </label>
                  <label
                    className={`${ui.field} ${editErrField === "latin" && !editFamily.trim() ? ui.fieldError : ""}`}
                  >
                    <span className={ui.fieldLabel}>{entry.latinFamilyLabel}</span>
                    <input
                      className={ui.input}
                      value={editFamily}
                      onChange={(ev) => setEditFamily(ev.target.value)}
                      autoComplete="family-name"
                      maxLength={40}
                      aria-invalid={editErrField === "latin" && !editFamily.trim()}
                    />
                  </label>
                </div>
                {editErrField === "latin" && err && <p className={`${ui.error} ${styles.fieldErr}`}>{err}</p>}
              </div>
            </div>
            {err && editErrField === null && <p className={`${ui.error} ${styles.fieldErr}`}>{err}</p>}

            <div className={styles.editActions}>
              {/* 취소 — 앞으로 가는 동작이 아니라 ›가 없다 */}
              <button type="button" className={`${ui.secondaryD} ${styles.editCancel}`} onClick={goMain}>
                {extra.ownCancel}
              </button>
              <button
                type="submit"
                className={`${ui.primaryD} ${styles.editSave} ${busy ? styles.busy : ""}`}
                disabled={busy}
                aria-busy={busy}
              >
                <span>{busy ? extra.ownSaving : extra.ownSave}</span>
                {!busy && <span className={ui.chev} aria-hidden>›</span>}
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  /* ── 03A 소유 정보 관리 ── */
  return (
    <main className={`${styles.page} ${scriptClass}`}>
      <div className={styles.frame}>
        {header}

        {/* ── 등록된 소유자 ── */}
        <section className={styles.owner}>
          <span className={styles.label}>{sectionLabel("Registered Owner", extra.ownHead, locale)}</span>
          {displayLatin ? (
            <div className={styles.ownerScriptBox}>
              <p ref={ownerScriptRef} className={styles.ownerScript}>
                {displayLatin}
              </p>
            </div>
          ) : null}
          <div className={styles.ownerLine}>
            {showNative && (
              <span className={displayLatin ? styles.ownerNative : styles.ownerNativeOnly}>{displayName}</span>
            )}
            {displayEmail && <span className={styles.ownerEmail}>{displayEmail}</span>}
          </div>
          <div className={styles.ownerStatus}>
            <span className={styles.statusDot} aria-hidden />
            <span>
              {authed ? extra.ownAuthed : extra.ownVerified}
              {registered ? ` · ${registered}` : ""}
            </span>
          </div>
          {authed ? (
            <button type="button" className={ui.linkD} onClick={onSignOut}>
              {extra.ownSignOut}
            </button>
          ) : (
            <button type="button" className={ui.secondaryD} onClick={openAuth}>
              <span>{extra.ownAuthOpen}</span>
              <span className={ui.chev} aria-hidden>›</span>
            </button>
          )}
        </section>

        {/* ── 소유한 병 — 병 사진(실체) → 번호 → 이름 → 바다 기록 순 ── */}
        <section className={styles.collection}>
          <div className={styles.collectionHead}>
            <span className={styles.label}>
              {sectionLabel("Collection", cards.length > 1 ? extra.ownBottleHeadPlural : extra.ownBottleHead, locale)}
            </span>
            <span className={styles.collectionCount}>{cards.length}</span>
          </div>
          <div className={styles.bottleList}>
            {cards.map((c) => (
              <Link key={c.code} href={`/b/${c.code}/certificate`} className={styles.bottleRow}>
                <span className={styles.bottleTile}>
                  <span className={styles.bottleTileImg}>
                    <Image
                      src={c.meta.imagePortrait ?? c.meta.image}
                      alt=""
                      fill
                      sizes="96px"
                      className={styles.bottleImg}
                    />
                  </span>
                </span>
                <span className={styles.bottleInfo}>
                  {/* 여러 병이 세워졌을 때만 지금 태그한 병을 짚어준다 */}
                  {cards.length > 1 && c.code === code && (
                    <span className={styles.bottleHere}>{extra.ownThisBottle}</span>
                  )}
                  <span className={styles.bottleEdition}>
                    <span className={styles.bottleNo}>N°</span>
                    <span className={styles.bottleNum}>{c.serial ?? "—"}</span>
                    <span className={styles.bottleTotal}>/ {c.meta.quantity}</span>
                  </span>
                  <span className={styles.bottleName}>{c.year ? `${c.meta.name} · ${c.year}` : c.meta.name}</span>
                  <span className={styles.bottleFacts}>
                    {extra.ownBottleFacts.replace("{d}", String(c.depth)).replace("{n}", String(c.months))}
                  </span>
                  <span className={styles.bottleCert}>
                    {extra.ownViewCert} <span aria-hidden>›</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 소유자 정보 ── */}
        <section className={styles.settings}>
          <span className={`${styles.label} ${styles.settingsHead}`}>
            {sectionLabel("Settings", extra.ownAccountHead, locale)}
          </span>
          <div className={styles.settingsList}>
            <button type="button" className={styles.settingRow} onClick={openEdit}>
              <span className={styles.settingText}>
                <span className={styles.settingTitle}>{extra.ownEditName}</span>
                <span className={styles.settingSub}>{extra.ownEditNameSub}</span>
              </span>
              {chevron}
            </button>
            <button
              type="button"
              className={styles.settingRow}
              onClick={() => setLangOpen(true)}
              aria-haspopup="dialog"
            >
              <span className={styles.settingText}>
                <span className={styles.settingTitle}>{extra.ownLanguage}</span>
                <span className={styles.settingSub}>{activeLocale.native}</span>
              </span>
              {chevron}
            </button>
            {/* 이메일은 읽기 전용 — 본인 인증의 근거라 여기서 바꾸면 동의도 기록도 없는
                소유권 이전이 된다. 변경은 문의로만. */}
            <div className={styles.settingRow}>
              <span className={styles.settingText}>
                <span className={styles.settingTitle}>{extra.ownFieldEmail}</span>
                <span className={styles.settingSub}>{extra.ownEmailRowSub}</span>
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ── 03D 언어 선택 — 하단 시트 ── */}
      <dialog
        ref={langRef}
        className={styles.langDialog}
        aria-labelledby="owner-lang-title"
        onClose={() => setLangOpen(false)}
        onClick={(e) => {
          /* 시트 바깥(배경 막)을 누르면 닫는다 — dialog 자신이 눌린 경우만 바깥이다 */
          if (e.target === e.currentTarget) setLangOpen(false);
        }}
      >
        <div className={`${styles.langSheet} ${scriptClass}`}>
          <span className={styles.langHandle} aria-hidden />
          <span id="owner-lang-title" className={`${styles.label} ${styles.langHead}`}>
            {sectionLabel("Language", extra.ownLanguage, locale)}
          </span>
          <div className={styles.langList} role="listbox" aria-labelledby="owner-lang-title">
            {BOTTLE_LOCALES.map((l) => {
              const on = l.code === locale;
              const latinName = l.code === "en" || l.code === "fr";
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={on}
                  lang={l.code}
                  className={`${styles.langRow} ${on ? styles.langRowOn : ""} ${latinName ? styles.langRowLatin : ""}`}
                  onClick={() => chooseLocale(l.code)}
                >
                  <span>{l.native}</span>
                  {on && <span className={styles.langDot} aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>
      </dialog>
    </main>
  );
}
