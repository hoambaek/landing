"use client";

/**
 * 숙성 이력 인증서 카드 — Paper "04 — 디지털 인증서"의 아이보리 증서 한 장.
 *
 * 이 컴포넌트 하나가 네 자리에 선다: 인증서 화면(04) · 저장 PNG(04A) · 등록 완료 발급(02) ·
 * 기록 페이지 미리보기(03). 저장본을 따로 조판하지 않는다 — 화면에서 본 것과 저장된 것이
 * 같은 한 장이어야 한다(Paper SPEC A). 작게 보일 자리는 부모가 zoom으로 줄인다.
 *
 * 증서 문구는 보는 사람의 언어 하나로만 낸다(병기 없음). 브랜드 표기(N° · 큐베명 ·
 * 필기체 이름 · OCEAN CELLAR)는 번역하지 않는다.
 *
 * 번호 양옆 물결 띠와 인장은 그 병의 입수~인양 주간 수온으로 그린다(cert-pattern.ts) —
 * 병마다 문양이 다르다.
 */

import { useId, useMemo } from "react";
import styles from "./certcard.module.css";
import { RECORD_EXTRA, type BottleLocale } from "../_lib/copy";
import type { CertCardData } from "../_lib/cert-card";
import { attestation, registeredDate } from "../_lib/cert-text";
import { BAND_H, BAND_W, SEAL_SIZE, bandPaths, sealBlob, sealRings } from "../_lib/cert-pattern";
import { useFitText } from "../_lib/use-fit-text";

export default function CertificateCard({
  card,
  locale,
  elevated = false,
  className = "",
}: {
  card: CertCardData;
  locale: BottleLocale;
  /** 어두운 바탕 위 — 그림자와 금빛 외곽선 한 줄을 얹는다. 저장 PNG(종이 바탕)에는 주지 않는다. */
  elevated?: boolean;
  className?: string;
}) {
  const extra = RECORD_EXTRA[locale];
  const isLatin = locale === "en" || locale === "fr";
  const scriptClass = locale === "ja" ? styles.ja : locale === "zh" ? styles.zh : "";

  /* 한 화면에 카드가 둘 설 수 있다(인증서 화면 + 저장용). 그라디언트 id가 겹치면
     뒤 카드가 앞 카드의 정의를 집어 간다 — useId로 가른다. url() 안에서 콜론이
     깨지므로 영숫자만 남긴다. */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const foilId = `foil${uid}`;
  const sheenId = `sheen${uid}`;

  const band = useMemo(() => bandPaths(card.temps), [card.temps]);
  const rings = useMemo(() => sealRings(card.temps), [card.temps]);
  const blob = useMemo(() => sealBlob(card.temps), [card.temps]);

  const attest = attestation(locale, card);
  const registered = registeredDate(card.registeredAt, locale);
  const latin = card.ownerLatin;
  /* 라틴 지면에서 등록하면 자국어 이름이 곧 로마자다 — 같은 이름을 두 번 세우지 않는다 */
  const showNative = !!latin && card.ownerName.trim().toLowerCase() !== latin.toLowerCase();
  /* 서명체는 한 줄로 세운다 — 이름 길이는 등록자가 정하므로 폭에 맞춰 크기를 내린다 */
  const scriptRef = useFitText<HTMLParagraphElement>(latin ?? "", 50, 26);

  const product = card.year ? `${card.productName} · ${card.year}` : card.productName;

  return (
    <div
      className={`${styles.card} ${elevated ? styles.elevated : ""} ${isLatin ? styles.latin : ""} ${scriptClass} ${className}`}
      lang={locale}
    >
      <div className={styles.frameOuter}>
        <div className={styles.frameInner}>
          {/* ── 표제 — 심볼 + 문서명(보는 사람의 언어 하나) ── */}
          <header className={styles.head}>
            {/* 저장 PNG에서 WebKit이 next/image의 srcset을 흘리는 일이 있어 원본 <img>로 둔다 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans.png" alt="Muse de Marée" className={styles.symbol} />
            <p className={styles.title}>{extra.certTag}</p>
          </header>

          {/* ── 번호 — 양옆으로 그 병의 수온이 그린 물결 띠가 지나간다 ── */}
          <section className={styles.numberBlock}>
            {card.serial !== null && (
              <>
                <svg
                  className={styles.band}
                  width={BAND_W}
                  height={BAND_H}
                  viewBox={`0 0 ${BAND_W} ${BAND_H}`}
                  aria-hidden
                >
                  {band.map((d, i) => (
                    <path key={i} d={d} fill="none" stroke="#A8834A" strokeWidth={0.45} opacity={0.55} />
                  ))}
                </svg>
                <div className={styles.numberRow}>
                  <span className={styles.no}>N°</span>
                  <span className={styles.num}>{card.serial}</span>
                  <span className={styles.total}>/ {card.total}</span>
                </div>
              </>
            )}
            <p className={styles.product}>{product}</p>
          </section>

          {/* ── 증명문 — 병에 관한 사실만. 인양 전이면 인양을 적지 않는다(cert-text.ts) ── */}
          {attest && <p className={styles.attest}>{attest}</p>}

          {/* ── 소유자 ── */}
          <section className={styles.owner}>
            <span className={styles.label}>{extra.certOwnerLabel}</span>
            {latin ? (
              <>
                <div className={styles.scriptBox}>
                  <p ref={scriptRef} className={styles.script}>
                    {latin}
                  </p>
                </div>
                <span className={styles.ownerRule} aria-hidden />
                {showNative && <p className={styles.native}>{card.ownerName}</p>}
              </>
            ) : (
              /* 로마자가 없는 옛 등록 — 서명체를 포기하고 자국어 이름을 크게 세운다 */
              <>
                <p className={styles.nativeOnly}>{card.ownerName}</p>
                <span className={styles.ownerRule} aria-hidden />
              </>
            )}
          </section>

          {/* ── 등록일 · 인증서 번호 | 인장 ── */}
          <section className={styles.bottom}>
            <div className={styles.fields}>
              {registered && (
                <div className={styles.field}>
                  <span className={styles.label}>{extra.certRegisteredLabel}</span>
                  <span className={styles.fieldValue}>{registered}</span>
                </div>
              )}
              <div className={styles.field}>
                <span className={styles.label}>{extra.certIdLabel}</span>
                <span className={styles.certId}>{card.certId}</span>
              </div>
            </div>

            <div className={styles.seal}>
              <svg
                className={styles.sealSvg}
                width={SEAL_SIZE}
                height={SEAL_SIZE}
                viewBox={`0 0 ${SEAL_SIZE} ${SEAL_SIZE}`}
                aria-hidden
              >
                <defs>
                  <linearGradient id={foilId} x1="0.1" y1="0" x2="0.9" y2="1">
                    <stop offset="0" stopColor="#C9A568" />
                    <stop offset="0.28" stopColor="#AE8646" />
                    <stop offset="0.5" stopColor="#9C7740" />
                    <stop offset="0.66" stopColor="#BF9C60" />
                    <stop offset="0.85" stopColor="#A7803F" />
                    <stop offset="1" stopColor="#7E5E2E" />
                  </linearGradient>
                  <radialGradient id={sheenId} cx="0.3" cy="0.28" r="0.75">
                    <stop offset="0" stopColor="#FFF6DE" stopOpacity="0.22" />
                    <stop offset="0.45" stopColor="#FFF6DE" stopOpacity="0" />
                    <stop offset="1" stopColor="#3A2A12" stopOpacity="0.22" />
                  </radialGradient>
                </defs>
                {rings.map((r, i) => (
                  <path key={i} d={r.d} fill="none" stroke="#A8834A" strokeWidth={r.width} opacity={r.opacity} />
                ))}
                <path d={blob.shadow} fill="#5E4520" opacity={0.28} />
                <path d={blob.body} fill={`url(#${foilId})`} />
                <path d={blob.body} fill={`url(#${sheenId})`} />
                <path d={blob.rimLight} fill="none" stroke="#F6E8C6" strokeWidth={0.45} opacity={0.55} />
                <path d={blob.rimDark} fill="none" stroke="#6E5226" strokeWidth={0.35} opacity={0.4} />
              </svg>
              <span className={styles.sealText}>
                <span>OCEAN</span>
                <span>CELLAR</span>
              </span>
            </div>
          </section>

          {/* ── 미세 문자 — 발행자만 만들 수 있는 값(HMAC). 키가 없으면 줄째 숨긴다 ── */}
          {card.signature && (
            <section className={styles.micro}>
              <span className={styles.microRule} aria-hidden />
              <span className={styles.microText}>{card.signature}</span>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
