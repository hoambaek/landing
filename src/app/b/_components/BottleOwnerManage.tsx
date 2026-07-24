"use client";

/**
 * /b 소유 정보 관리 (Paper "03A — 소유 정보 관리") + 소유자 인증(phase-3).
 * 미인증: 마스킹된 소유자 표시 + "본인 인증"(등록 이메일 OTP).
 * 인증(세션 유효): 이름 전체 표시 + 이름·이메일 수정 + 소유권 이전(되돌릴 수 없음, 새 소유자 수락 필요).
 * 변경/이전은 서버 액션에서 세션을 재확인한 뒤에만 실행된다.
 */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./owner.module.css";
import { PRODUCT_META, RECORD_EXTRA } from "../_lib/copy";
import type { BottleRecordData, BottleOwner } from "../_lib/data";
import {
  requestOwnerOtp,
  verifyOwnerOtp,
  signOutOwner,
  updateOwnerInfo,
  initiateTransfer,
} from "../_lib/owner-actions";

type Panel = "none" | "otp" | "edit" | "transfer";

export default function BottleOwnerManage({
  code,
  data,
  ownerMasked,
  authed,
  ownerFull,
}: {
  code: string;
  data: BottleRecordData;
  ownerMasked: BottleOwner | null;
  authed: boolean;
  ownerFull: { name: string; email: string } | null;
}) {
  const router = useRouter();
  const extra = RECORD_EXTRA.ko;
  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const serial = data.bottle.serial;
  const serialLabel = serial !== null ? `N° ${serial}` : "N° —";

  const displayName = authed && ownerFull ? ownerFull.name : ownerMasked?.nameMasked ?? extra.certOwnerFallback;
  const displayEmail = authed && ownerFull ? ownerFull.email : ownerMasked?.emailMasked ?? "";

  const [panel, setPanel] = useState<Panel>("none");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // OTP
  const [otpStage, setOtpStage] = useState<"request" | "code">("request");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // edit
  const [editName, setEditName] = useState(ownerFull?.name ?? "");
  const [editEmail, setEditEmail] = useState(ownerFull?.email ?? "");
  const [editDone, setEditDone] = useState(false);

  // transfer
  const [trEmail, setTrEmail] = useState("");
  const [trName, setTrName] = useState("");
  const [trSent, setTrSent] = useState(false);

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
      setErr(res.error ?? "잠시 후 다시 시도해 주세요.");
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
      setErr(res.error ?? "코드가 일치하지 않아요.");
    }
  }

  async function onSignOut() {
    await signOutOwner(code);
    router.refresh();
  }

  function openEdit() {
    if (!authed) return openAuth();
    setEditName(ownerFull?.name ?? "");
    setEditEmail(ownerFull?.email ?? "");
    setEditDone(false);
    setErr(null);
    setPanel("edit");
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    const res = await updateOwnerInfo(code, editName, editEmail);
    setBusy(false);
    if (res.ok) {
      setEditDone(true);
      setPanel("none");
      router.refresh();
    } else {
      setErr(res.error ?? "저장 중 문제가 발생했습니다.");
    }
  }

  function openTransfer() {
    if (!authed) return openAuth();
    setTrEmail("");
    setTrName("");
    setTrSent(false);
    setErr(null);
    setPanel("transfer");
  }

  async function onTransfer(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!window.confirm("정말 이전하시겠어요? 받는 분이 수락하면 되돌릴 수 없습니다.")) return;
    setBusy(true);
    setErr(null);
    const res = await initiateTransfer(code, trEmail, trName);
    setBusy(false);
    if (res.ok) {
      setTrSent(true);
    } else {
      setErr(res.error ?? "잠시 후 다시 시도해 주세요.");
    }
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

        {/* ── 등록된 소유자 ── */}
        <section className={styles.identity}>
          <span className={styles.identityHead}>{extra.ownHead}</span>
          <p className={styles.identityName}>{displayName}</p>
          {displayEmail && <p className={styles.identityEmail}>{displayEmail}</p>}
          <div className={styles.identityStatus}>
            <span className={styles.statusDot} aria-hidden />
            <span>{authed ? "본인 인증됨" : extra.ownVerified}</span>
          </div>
          {authed ? (
            <button type="button" className={styles.textAction} onClick={onSignOut}>인증 해제</button>
          ) : (
            <button type="button" className={styles.authCta} onClick={openAuth}>본인 인증하고 전체 보기</button>
          )}

          {panel === "otp" && (
            <div className={styles.authPanel}>
              {otpStage === "request" ? (
                <>
                  <p className={styles.authLead}>등록하신 이메일로 6자리 인증 코드를 보내드립니다.</p>
                  <button type="button" className={styles.panelBtn} onClick={onRequestCode} disabled={busy}>
                    {busy ? "보내는 중" : "인증 코드 받기"}
                  </button>
                </>
              ) : (
                <form onSubmit={onVerifyCode}>
                  <p className={styles.authLead}>{otpEmail}로 코드를 보냈어요. 5분 안에 입력해 주세요.</p>
                  <input
                    className={styles.panelInput}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="6자리 코드"
                    value={otpCode}
                    onChange={(ev) => setOtpCode(ev.target.value.replace(/\D/g, ""))}
                    autoFocus
                  />
                  <button type="submit" className={styles.panelBtn} disabled={busy}>
                    {busy ? "확인 중" : "확인"}
                  </button>
                  <button type="button" className={styles.textAction} onClick={onRequestCode} disabled={busy}>
                    코드 다시 받기
                  </button>
                </form>
              )}
              {err && <p className={styles.panelErr}>{err}</p>}
            </div>
          )}
        </section>

        {/* ── 연결된 병 ── */}
        <section className={styles.linked}>
          <Link href={`/b/${code}/certificate`} className={styles.linkedCard}>
            <span className={styles.linkedSerial}>
              <span className={styles.linkedSerialNo}>N°</span>
              <span className={styles.linkedSerialNum}>{serial ?? "—"}</span>
            </span>
            <span className={styles.linkedInfo}>
              <span className={styles.linkedName}>{meta.name}</span>
              <span className={styles.linkedSub}>{extra.ownLinkedSub}</span>
            </span>
            <span className={styles.linkedArrow} aria-hidden>›</span>
          </Link>
        </section>

        {/* ── 소유자 정보 ── */}
        <section className={styles.group}>
          <h2 className={styles.groupHead}>{extra.ownAccountHead}</h2>
          <button type="button" className={styles.settingRow} onClick={openEdit}>
            <span className={styles.settingText}>
              <span className={styles.settingTitle}>{extra.ownEditName}</span>
              <span className={styles.settingSub}>{extra.ownEditNameSub}</span>
            </span>
            <span className={styles.settingArrow} aria-hidden>›</span>
          </button>

          {panel === "edit" && (
            <form className={styles.panel} onSubmit={onSaveEdit}>
              <label className={styles.panelField}>
                <span className={styles.panelLabel}>이름</span>
                <input className={styles.panelInput} value={editName} onChange={(ev) => setEditName(ev.target.value)} autoComplete="name" />
              </label>
              <label className={styles.panelField}>
                <span className={styles.panelLabel}>이메일</span>
                <input className={styles.panelInput} type="email" inputMode="email" value={editEmail} onChange={(ev) => setEditEmail(ev.target.value)} autoComplete="email" />
              </label>
              {err && <p className={styles.panelErr}>{err}</p>}
              <div className={styles.panelRow}>
                <button type="button" className={styles.panelCancel} onClick={() => setPanel("none")}>취소</button>
                <button type="submit" className={styles.panelBtn} disabled={busy}>{busy ? "저장 중" : "저장"}</button>
              </div>
            </form>
          )}

          <div className={styles.settingRow}>
            <span className={styles.settingText}>
              <span className={styles.settingTitle}>{extra.ownNotify}</span>
              <span className={styles.settingSub}>{extra.ownNotifySub}</span>
            </span>
            <Link href={`/b/${code}/record`} className={styles.settingArrow} aria-label={extra.ownNotify}>›</Link>
          </div>
        </section>

        {/* ── 소유권 이전 ── */}
        <section className={styles.group}>
          <h2 className={styles.groupHead}>{extra.ownRightsHead}</h2>
          <div className={styles.transferCard}>
            <span className={styles.transferTitle}>{extra.ownTransfer}</span>
            <p className={styles.transferSub}>{extra.ownTransferSub}</p>
            {trSent ? (
              <p className={styles.transferSent}>이전 요청을 보냈어요. 받는 분이 수락하면 완료됩니다.</p>
            ) : panel === "transfer" ? (
              <form className={styles.panel} onSubmit={onTransfer}>
                <label className={styles.panelField}>
                  <span className={styles.panelLabel}>받는 분 이메일</span>
                  <input className={styles.panelInput} type="email" inputMode="email" value={trEmail} onChange={(ev) => setTrEmail(ev.target.value)} placeholder="new@example.com" autoFocus />
                </label>
                <label className={styles.panelField}>
                  <span className={styles.panelLabel}>받는 분 이름 (선택)</span>
                  <input className={styles.panelInput} value={trName} onChange={(ev) => setTrName(ev.target.value)} autoComplete="off" />
                </label>
                {err && <p className={styles.panelErr}>{err}</p>}
                <div className={styles.panelRow}>
                  <button type="button" className={styles.panelCancel} onClick={() => setPanel("none")}>취소</button>
                  <button type="submit" className={styles.panelBtn} disabled={busy}>{busy ? "보내는 중" : "이전 요청 보내기"}</button>
                </div>
              </form>
            ) : (
              <button type="button" className={styles.transferBtn} onClick={openTransfer}>
                {authed ? "소유권 이전 시작" : extra.ownTransferCta}
              </button>
            )}
          </div>
        </section>

        {/* ── 푸터 ── */}
        <footer className={styles.footer}>
          <Link href={`/b/${code}/record`} className={styles.footerLink}>
            {extra.ownBackRecord} →
          </Link>
          <span className={styles.footerMeta}>소유 기록 · {serialLabel}</span>
        </footer>
      </div>
    </main>
  );
}
