"use client";

/**
 * 소유권 이전 수락 — 새 소유자가 이메일 링크(/b/{code}/transfer?token=...)로 진입.
 * 토큰 소유 자체가 이메일 통제 증명. 수락 시 되돌릴 수 없다.
 */

import { useState } from "react";
import Link from "next/link";
import styles from "./transfer.module.css";
import { acceptTransfer } from "../_lib/owner-actions";

export default function BottleTransferAccept({
  code,
  token,
  serial,
}: {
  code: string;
  token: string;
  serial: number | null;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">(token ? "idle" : "error");
  const [err, setErr] = useState<string | null>(token ? null : "잘못된 링크입니다.");

  async function onAccept() {
    if (state === "busy") return;
    setState("busy");
    setErr(null);
    const res = await acceptTransfer(code, token);
    if (res.ok) {
      setState("done");
    } else {
      setErr(res.error ?? "이전 처리 중 문제가 발생했습니다.");
      setState("error");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/logo_trans_W_lg.png" alt="" className={styles.symbol} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/logo_text_trans_W.png" alt="Muse de Marée" className={styles.wordmark} />
        </div>

        {state === "done" ? (
          <>
            <h1 className={styles.title}>소유권이 이전되었습니다.</h1>
            <p className={styles.body}>이제 이 병과 바다의 기록, 디지털 인증서의 소유자로 등록되었습니다.</p>
            <Link href={`/b/${code}/certificate`} className={styles.primary}>디지털 인증서 보기</Link>
            <Link href={`/b/${code}/record`} className={styles.secondary}>바다의 기록 보기 →</Link>
          </>
        ) : (
          <>
            <span className={styles.eyebrow}>OWNERSHIP TRANSFER · {serial !== null ? `N° ${serial}` : "N°"}</span>
            <h1 className={styles.title}>병 소유권을 수락하시겠어요?</h1>
            <p className={styles.body}>
              수락하면 이 병과 바다의 기록·디지털 인증서의 소유 기록이 회원님께 이전됩니다. 이전은 되돌릴 수 없습니다.
            </p>
            <button type="button" className={styles.primary} onClick={onAccept} disabled={state === "busy" || !token}>
              {state === "busy" ? "처리 중" : "소유권 이전 수락"}
            </button>
            {err && <p className={styles.err}>{err}</p>}
          </>
        )}
      </div>
    </main>
  );
}
