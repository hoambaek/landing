import Image from "next/image";
import Link from "next/link";
import { locales, localePrefixMap, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import koDict from "@/i18n/messages/ko.json";

/**
 * F · Footer — 서명 (다크, Paper 08 1:1)
 * 로고 락업 + 모토(Mrs Saint Delafield) + 앰버 헤어라인 + 내비 3열 + 법인 정보 + 약관·SNS·언어.
 * 모토는 S1 히어로 서명과 수미상관. 내비 라벨은 브랜드 고유명이라 전 로케일 공통, 앵커만 locale prefix.
 */

const NAV_COLS = [
  {
    head: "COLLECTION",
    items: [
      { label: "En Lieu Sûr", anchor: "#archive" },
      { label: "Élément de Surprise", anchor: "#archive" },
      { label: "Atomes Crochus", anchor: "#archive" },
    ],
  },
  {
    head: "RECORD",
    items: [
      { label: "Ocean Cellar™", anchor: "#data-archive" },
      { label: "First Record", anchor: "#the-first-record" },
      { label: "The Maker", anchor: "#the-maker" },
      { label: "Journal", url: "https://blog.musedemaree.com" },
    ],
  },
  {
    head: "RELATION",
    items: [
      { label: "Ocean Cellar Privé", anchor: "#ocean-circle" },
      { label: "Partnership", anchor: "#professionals" },
    ],
  },
];

const LEGAL = [
  "주식회사 오크니",
  "대표 정설화",
  "사업자등록번호 859-85-03139",
  "서울특별시 강남구 압구정로 306, B1 #6-J14",
];

const EMAIL = "info@musedemaree.com";

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Footer({
  locale = "ko",
  dict = koDict.footer,
}: {
  locale?: Locale;
  dict?: Dictionary["footer"];
} = {}) {
  const base = localePrefixMap[locale];
  return (
    <footer className="s-footer">
      {/* 로고 락업 + 모토 + 앰버 헤어라인 */}
      <div className="s-footer__identity">
        <Image
          src="/images/logo/logo_all_W_KR.png"
          alt="Muse de Marée"
          width={284}
          height={278}
          className="s-footer__logo"
        />
        <p className="s-footer__motto">Written by the Sea.</p>
        <span className="s-footer__motto-rule" aria-hidden="true" />
      </div>

      {/* ── 하단 다크 블록 ── */}
      <div className="s-footer__lower">
      {/* 내비 3열 */}
      <nav className="s-footer__nav">
        {NAV_COLS.map((col) => (
          <div key={col.head} className="s-footer__nav-col">
            <span className="s-footer__nav-head">{col.head}</span>
            <ul className="s-footer__nav-items">
              {col.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={"url" in it ? it.url : `${base}${it.anchor}`}
                    className="s-footer__nav-item"
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* 법인 정보 + 이메일(강조) */}
      <div className="s-footer__legal">
        {LEGAL.map((l) => (
          <span key={l}>{l}</span>
        ))}
        <a href={`mailto:${EMAIL}`} className="s-footer__legal-email">{EMAIL}</a>
      </div>

      {/* 하단 */}
      <div className="s-footer__bottom">
        <p className="s-footer__warning">
          알코올은 발암물질로 지나친 음주는 간암, 위암 등을 일으킵니다. 임신 중 음주는 기형아 출생 위험을 높입니다.
        </p>
        <div className="s-footer__bar">
          <div className="s-footer__bar-left">
            <span className="s-footer__copyright">© 2026 Muse de Marée</span>
            <div className="s-footer__social">
              <InstagramIcon />
              <YoutubeIcon />
            </div>
          </div>
          <div className="s-footer__bar-right">
            <div className="s-footer__policies">
              <Link href="/terms">{dict.policies.terms}</Link>
              <Link href="/privacy">{dict.policies.privacy}</Link>
              <Link href="/cookies">{dict.policies.cookies}</Link>
            </div>
            <div className="s-footer__lang">
              {locales.map((lc) => (
                <Link
                  key={lc}
                  href={localePrefixMap[lc]}
                  className={lc === locale ? "s-footer__lang-active" : undefined}
                >
                  {lc === "ko" ? "KR" : lc.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
