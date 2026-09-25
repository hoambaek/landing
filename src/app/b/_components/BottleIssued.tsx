"use client";

/**
 * 02 — 등록 완료 · 인증서 발급 (Paper "02 — 등록 완료 · 인증서 발급").
 *
 * 「N° 89의 소유자로 등록했습니다」 아래로 방금 발급된 인증서 카드가 떠오른다(1.2s).
 * 자동 이동은 하지 않는다 — 바다 기록 보기(주) 또는 인증서 전체 보기를 사용자가 고른다.
 *
 * 카드는 등록 뒤 서버에서 받는다(cert-actions.ts). 입장 페이지가 해양 관측을 미리
 * 읽지 않도록 한 선택이고, 카드가 떠오르는 연출이 그 왕복을 덮는다.
 * 받지 못하면(네트워크·서버 오류) 카드 없이 두 버튼만 남는다 — 등록 자체는 끝났다.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./entry.module.css";
import ui from "./ui.module.css";
import CertificateCard from "./CertificateCard";
import type { BottleLocale, EntryCopy } from "../_lib/copy";
import type { CertCardData } from "../_lib/cert-card";
import { fetchIssuedCertificate } from "../_lib/cert-actions";

export default function BottleIssued({
  copy,
  code,
  serial,
  locale,
}: {
  copy: EntryCopy;
  code: string;
  serial: number | null;
  locale: BottleLocale;
}) {
  const [card, setCard] = useState<CertCardData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchIssuedCertificate(code)
      .then((c) => {
        if (!alive) return;
        if (c) setCard(c);
        else setFailed(true);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [code]);

  const title = serial !== null ? copy.inscribedTitle.replace("{serial}", String(serial)) : copy.inscribedTitleNoSerial;
  const cta = serial !== null ? copy.inscribedCta.replace("{serial}", String(serial)) : copy.inscribedCtaNoSerial;

  return (
    <section className={styles.dark} aria-live="polite" aria-labelledby="issued-title">
      <div className={styles.issuedHead}>
        {/* 브랜드 표기 — 번역하지 않는다 */}
        <span className={styles.darkEyebrow}>Certificate Issued</span>
        <h1 id="issued-title" className={styles.darkTitle}>
          {title}
        </h1>
      </div>

      <div className={styles.issuedCard}>
        {card ? (
          <div className={styles.issuedCardInner}>
            <CertificateCard card={card} locale={locale} elevated />
          </div>
        ) : (
          !failed && <div className={styles.issuedCardWait} aria-hidden />
        )}
      </div>

      <div className={styles.issuedDock}>
        <Link href={`/b/${code}/record`} className={ui.primaryD}>
          <span>{cta}</span>
          <span className={ui.chev} aria-hidden>›</span>
        </Link>
        <Link href={`/b/${code}/certificate`} className={ui.linkD}>
          {copy.inscribedCertLink}
        </Link>
      </div>
    </section>
  );
}
