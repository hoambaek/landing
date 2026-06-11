import Image from "next/image";

/**
 * F · Footer — 서명 (다크, Paper 08 1:1)
 * 로고 락업 + 모토(Mrs Saint Delafield) + 앰버 헤어라인 + 내비 3열 + 법인 정보 + 약관·SNS·언어.
 * 모토는 S1 히어로 서명과 수미상관.
 */

const NAV_COLS = [
  {
    head: "COLLECTION",
    items: [
      { label: "En Lieu Sûr", href: "/#archive" },
      { label: "Élément de Surprise", href: "/#archive" },
      { label: "Atomes Crochus", href: "/#archive" },
    ],
  },
  {
    head: "RECORD",
    items: [
      { label: "The Living Record", href: "/#data-archive" },
      { label: "The First Record", href: "/#the-first-record" },
      { label: "The Maker", href: "/#the-maker" },
    ],
  },
  {
    head: "RELATION",
    items: [
      { label: "Ocean Cellar Privé", href: "/#ocean-circle" },
      { label: "Partnership", href: "/#professionals" },
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
      <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="rgb(49 46 42 / 40%)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" fill="none" stroke="rgb(49 46 42 / 40%)" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="rgb(49 46 42 / 40%)" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" fill="none" stroke="rgb(49 46 42 / 40%)" strokeWidth="1.5" />
      <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="none" stroke="rgb(49 46 42 / 40%)" strokeWidth="1.5" />
    </svg>
  );
}

export default function Footer() {
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

      {/* 내비 3열 */}
      <nav className="s-footer__nav">
        {NAV_COLS.map((col) => (
          <div key={col.head} className="s-footer__nav-col">
            <span className="s-footer__nav-head">{col.head}</span>
            <div className="s-footer__nav-items">
              {col.items.map((it) => (
                <a key={it.label} href={it.href} className="s-footer__nav-item">{it.label}</a>
              ))}
            </div>
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
              <span>이용약관</span>
              <span>개인정보처리방침</span>
              <span>쿠키 정책</span>
            </div>
            <div className="s-footer__lang">
              <span className="s-footer__lang-active">KR</span>
              <span>EN</span>
              <span>FR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
