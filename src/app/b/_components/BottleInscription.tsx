"use client";

/**
 * 등록 완료 — 소유 등록 직후 나타나는 완료 화면 (Paper "02 등록 완료").
 * 등록 완료 문구 → 대형 N° → 병 → 소유자 이름을 위에서 아래로 순차 리빌하고,
 * 잠깐 정지한 뒤 CTA를 페이드 인한다. 자동 이동은 하지 않는다(사용자가 눌러 이동).
 * 표기 규칙: 병 번호 N°/총량. 다크·앰버 톤(기록 페이지와 동일).
 */

import Image from "next/image";
import styles from "./entry.module.css";
import type { EntryCopy } from "../_lib/copy";

export default function BottleInscription({
  copy,
  name,
  nameLatin,
  serial,
  total,
  image,
  productName,
  productSub,
  onContinue,
  onBrowse,
}: {
  copy: EntryCopy;
  name: string;
  /* 인증서와 같은 얼굴로 보여주기 위한 로마자 표기 — 없으면 자국어 이름만 세운다 */
  nameLatin?: string | null;
  serial: number | null;
  total: number;
  image: string;
  /* 제품명 — 병 사진 아래 캡션 자리에 세운다 */
  productName: string;
  /* 입수 연차 · 숙성 기간 — 큐베명 아래 한 단 작게. 큐베명만으로는 1년물·2년물이
     같은 이름이고, 연차가 없으면 이듬해 입수분과도 같은 이름이 된다.
     숙성 배치가 없는 병은 null — 없는 연도를 지어내느니 줄을 비운다. */
  productSub: string | null;
  onContinue: () => void;
  /* 이미 등록된 병으로 들어왔을 때만 — 입장 화면(필름·Identity·Provenance)으로 내려간다.
     등록 직후에는 방금 지나온 화면이라 주지 않는다. */
  onBrowse?: () => void;
}) {
  return (
    <section className={styles.inscribe} aria-live="polite">
      <div className={styles.inscribeHead}>
        <span className={styles.inscribeEyebrow}>{copy.inscribedEyebrow}</span>
        <h1 className={styles.inscribeTitle}>{copy.inscribedTitle}</h1>
        <p className={styles.inscribeSub}>
          {serial !== null
            ? copy.inscribedSub.replace("{serial}", String(serial))
            : copy.inscribedSubNoSerial}
        </p>
      </div>

      {serial !== null && (
        <div className={styles.inscribeEdition}>
          <span className={styles.iEdNo}>N°</span>
          <span className={styles.iEdNum}>{serial}</span>
          <span className={styles.iEdTotal}>/ {total}</span>
        </div>
      )}

      <div className={styles.inscribeBottle}>
        {/* CSS가 height 기준(최대 268px, 작은 화면에서는 그보다 작게)으로 그리므로
            실제 렌더 폭은 width prop보다 크다. width만 주면 그 값으로 srcset이 만들어져
            고밀도 화면에서 흐려진다 — sizes로 최대 표시 폭(268 × 158/264 ≈ 160px)을 알려
            원본에 가까운 크기를 받게 한다. 화면이 작아지면 렌더 폭은 이보다 작아질 뿐이라
            흐려지는 쪽으로는 어긋나지 않는다. width/height prop은 종횡비 선언 몫이다. */}
        <Image
          src={image}
          alt=""
          width={158}
          height={264}
          sizes="160px"
          quality={90}
          className={styles.inscribeBottleImg}
          aria-hidden
        />
      </div>

      <div className={styles.inscribeOwner}>
        {/* 라벨("첫 소유자") 자리에 제품명을 세운다 — 위 병 사진의 캡션이자
           이 문서가 어느 술의 것인지를 밝히는 줄이다. */}
        <span className={styles.iProductName}>{productName}</span>
        {productSub && <span className={styles.iProductSub}>{productSub}</span>}
        {nameLatin ? (
          <>
            <span className={styles.iOwnerScript}>{nameLatin}</span>
            <span className={styles.iOwnerNative}>{name}</span>
          </>
        ) : (
          <span className={styles.iOwnerName}>{name}</span>
        )}
        <span className={styles.iOwnerRule} aria-hidden />
      </div>

      <div className={styles.inscribeCta}>
        <button type="button" className={styles.inscribeCtaBtn} onClick={onContinue}>
          {copy.inscribedCta}
        </button>
        <p className={styles.inscribeCtaSub}>{copy.inscribedCtaSub}</p>
        {onBrowse && (
          <button type="button" className={styles.inscribeBrowse} onClick={onBrowse}>
            {/* 개체는 번호로 부른다 — 번호가 없으면 부르지 않는다 */}
            {serial !== null
              ? copy.inscribedBrowse.replace("{serial}", String(serial))
              : copy.inscribedBrowseNoSerial}
          </button>
        )}
      </div>
    </section>
  );
}
