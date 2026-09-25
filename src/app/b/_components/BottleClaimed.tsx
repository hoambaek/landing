"use client";

/**
 * 01B — 이미 등록된 병 (Paper "01B — 이미 등록된 병").
 *
 * 등록된 병을 다른 사람이 태그했을 때 폼 대신 번호와 소유자 이름 증서 조각을 보여준다.
 * 기록은 누구에게나 열어 둔다. 이메일은 어떤 형태로도 노출하지 않는다(마스킹 값도).
 * 소유자 본인이면 본인 인증(03B)으로 간다.
 * "필름 보기"는 입장 필름을 화면 전체로 다시 튼다(01C, BottleFilm).
 */

import Link from "next/link";
import styles from "./entry.module.css";
import ui from "./ui.module.css";
import type { EntryCopy } from "../_lib/copy";
import { useFitText } from "../_lib/use-fit-text";

export default function BottleClaimed({
  copy,
  code,
  serial,
  total,
  productName,
  year,
  name,
  nameLatin,
  onWatchFilm,
}: {
  copy: EntryCopy;
  code: string;
  serial: number | null;
  total: number;
  productName: string;
  year: string | null;
  name: string;
  nameLatin: string | null;
  /* 필름이 없으면 넘기지 않는다 — 입구도 그리지 않는다 */
  onWatchFilm?: () => void;
}) {
  const scriptRef = useFitText<HTMLParagraphElement>(nameLatin ?? "", 46, 26);
  /* 라틴 지면에서 등록하면 자국어 이름이 곧 로마자다 — 같은 이름을 두 번 세우지 않는다 */
  const showNative = !!nameLatin && name.trim().toLowerCase() !== nameLatin.toLowerCase();

  return (
    <section className={styles.dark} aria-labelledby="claimed-title">
      <div className={styles.claimedHead}>
        {/* 브랜드 표기 — 번역하지 않는다 */}
        <span className={styles.darkEyebrow}>Owned by</span>
        <h1 id="claimed-title" className={styles.darkTitle}>
          {copy.claimedTitle}
        </h1>
      </div>

      <div className={styles.plateWrap}>
        <div className={styles.plate}>
          <div className={styles.plateInner}>
            {serial !== null && (
              <div className={styles.plateNumber}>
                <span className={styles.plateNo}>N°</span>
                <span className={styles.plateNum}>{serial}</span>
                <span className={styles.plateTotal}>/ {total}</span>
              </div>
            )}
            <p className={styles.plateProduct}>{year ? `${productName} · ${year}` : productName}</p>
            <span className={styles.plateRule} aria-hidden />
            {nameLatin ? (
              <>
                <div className={styles.plateScriptBox}>
                  <p ref={scriptRef} className={styles.plateScript}>
                    {nameLatin}
                  </p>
                </div>
                {showNative && <p className={styles.plateNative}>{name}</p>}
              </>
            ) : (
              <p className={styles.plateNameOnly}>{name}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.claimedFoot}>
        <p className={styles.claimedNote}>{copy.claimedBody}</p>
        <Link href={`/b/${code}/record`} className={ui.primaryD}>
          <span>{copy.claimedCta}</span>
          <span className={ui.chev} aria-hidden>›</span>
        </Link>
        {onWatchFilm && (
          <button type="button" className={`${ui.linkD} ${styles.filmLink}`} onClick={onWatchFilm}>
            <svg width="7" height="8" viewBox="0 0 7 8" aria-hidden>
              <path d="M0.5 0.6 L6.5 4 L0.5 7.4 Z" fill="#CCAD7B" />
            </svg>
            <span>{copy.claimedFilm}</span>
          </button>
        )}
        <Link href={`/b/${code}/owner?verify=1`} className={ui.linkD}>
          {copy.claimedVerify}
        </Link>
      </div>
    </section>
  );
}
