"use client";

/**
 * 각인 공개 — 소유 등록 직후 나타나는 완료 화면 (Paper "02 등록 완료 · 각인 공개").
 * 등록 완료 문구 → 대형 N° → 병 → 소유자 이름을 위에서 아래로 각인하듯 리빌하고,
 * 잠깐 정지한 뒤 CTA를 페이드 인한다. 자동 이동은 하지 않는다(사용자가 눌러 이동).
 * 표기 규칙: 병 번호 N°/총량. 다크·앰버 톤(기록 페이지와 동일).
 */

import Image from "next/image";
import styles from "./entry.module.css";
import type { EntryCopy } from "../_lib/copy";

export default function BottleInscription({
  copy,
  name,
  serial,
  total,
  image,
  onContinue,
}: {
  copy: EntryCopy;
  name: string;
  serial: number | null;
  total: number;
  image: string;
  onContinue: () => void;
}) {
  return (
    <section className={styles.inscribe} aria-live="polite">
      <div className={styles.inscribeHead}>
        <span className={styles.inscribeEyebrow}>{copy.inscribedEyebrow}</span>
        <h1 className={styles.inscribeTitle}>{copy.inscribedTitle}</h1>
        <p className={styles.inscribeSub}>{copy.inscribedSub}</p>
      </div>

      {serial !== null && (
        <div className={styles.inscribeEdition}>
          <span className={styles.iEdNo}>N°</span>
          <span className={styles.iEdNum}>{serial}</span>
          <span className={styles.iEdTotal}>/ {total}</span>
        </div>
      )}

      <div className={styles.inscribeBottle}>
        <Image
          src={image}
          alt=""
          width={142}
          height={264}
          className={styles.inscribeBottleImg}
          aria-hidden
        />
      </div>

      <div className={styles.inscribeOwner}>
        <span className={styles.iOwnerLabel}>{copy.inscribedOwnerLabel}</span>
        <span className={styles.iOwnerName}>{name}</span>
        <span className={styles.iOwnerRule} aria-hidden />
      </div>

      <div className={styles.inscribeCta}>
        <button type="button" className={styles.inscribeCtaBtn} onClick={onContinue}>
          {copy.inscribedCta}
        </button>
        <p className={styles.inscribeCtaSub}>{copy.inscribedCtaSub}</p>
      </div>
    </section>
  );
}
