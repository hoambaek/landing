"use client";

/**
 * /b 공용 푸터 — record·certificate가 이 하나를 쓴다.
 *
 * 페이지마다 푸터를 복제해 두면 한 곳만 고쳐지고 서로 어긋난다.
 * 실제로 라이트 전환 때 record 언어 버튼의 셰브론만 아이보리로 남아
 * 종이 위에서 보이지 않았다 — 같은 마크업을 두 곳에 두고 있던 대가다.
 *
 * 언어 선택 상태는 이 안에서 관리하고, 고른 결과만 위로 올린다.
 */

import { useState } from "react";
import styles from "./footer.module.css";
import { BOTTLE_LOCALES, type BottleLocale } from "../_lib/copy";
import { persistBottleLocale } from "../_lib/locale";

export default function BottleFooter({
  locale,
  onLocaleChange,
  tagline,
  brandPage,
  blogPage,
  year,
}: {
  locale: BottleLocale;
  onLocaleChange: (l: BottleLocale) => void;
  tagline: string;
  brandPage: string;
  blogPage: string;
  year: string;
}) {
  const [langOpen, setLangOpen] = useState(false);
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;

  const chevronRight = (
    <svg className={styles.arrow} width="5" height="9" viewBox="0 0 5 9" aria-hidden>
      <polyline
        points="0.9,0.9 4.1,4.5 0.9,8.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <footer className={styles.footer}>
      {/* 브랜드 줄 — 언어 선택은 하단으로 내렸다. 정체성과 기능을 같은 층에 두면
          푸터가 헤더처럼 읽힌다. */}
      <div className={styles.logoRow}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo/logo_trans.png" alt="" className={styles.symbol} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo/logo_text_trans.png" alt="Muse de Marée" className={styles.wordmark} />
      </div>

      <p className={styles.tagline}>{tagline}</p>

      <div className={styles.cols}>
        <a href="https://musedemaree.com" className={styles.col}>
          <span className={styles.colHead}>BRAND</span>
          <span className={styles.colRow}>
            <span>{brandPage}</span>
            {chevronRight}
          </span>
        </a>
        <a href="https://blog.musedemaree.com" className={styles.col}>
          <span className={styles.colHead}>JOURNAL</span>
          <span className={styles.colRow}>
            <span>{blogPage}</span>
            {chevronRight}
          </span>
        </a>
      </div>

      <div className={styles.base}>
        <div className={styles.legal}>
          <span>© {year} MUSE DE MARÉE</span>
          <span>ORKNEY CORP. · KOREA</span>
        </div>

        <div className={styles.lang}>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLangOpen((v) => !v)}
            aria-expanded={langOpen}
            aria-label="Language"
          >
            <span>{activeLocale.short}</span>
            {/* currentColor — 색을 박아두면 테마가 바뀔 때 이 한 곳만 남는다 */}
            <svg className={styles.langChevron} width="7" height="5" viewBox="0 0 7 5" aria-hidden>
              <polyline points="1,1 3.5,4 6,1" fill="none" stroke="currentColor" strokeWidth="1" />
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
                    onLocaleChange(l.code);
                    persistBottleLocale(l.code);
                    setLangOpen(false);
                  }}
                >
                  <span className={styles.langOptCode}>{l.short}</span>
                  <span>{l.native}</span>
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
      </div>
    </footer>
  );
}
