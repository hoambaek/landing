/** Footer — Server Component */
export default function Footer({ hideSubscribe = false }: { hideSubscribe?: boolean }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* 로고 — 중앙 앵커 */}
        <div className="footer__logo-wrap">
          <span className="footer__logo">MUSE DE MAR&Eacute;E</span>
        </div>

        {/* 뉴스레터 + 소셜 */}
        <div className="footer__subscribe">
          {!hideSubscribe && (
            <div className="footer__subscribe-left">
              <span className="footer__subscribe-text">
                해저 숙성의 소식을 받아보세요.
              </span>
              <a href="#ocean-circle" className="footer__subscribe-cta">
                초대 신청
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
                  <path d="M1 4H10M7 1L10 4L7 7" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}
          <div className={`footer__social${hideSubscribe ? " footer__social--end" : ""}`}>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="YouTube">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="4" /><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="KakaoTalk">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.41-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.55.08 1.13.12 1.72.12 5.52 0 10-3.58 10-7.81C22 6.58 17.52 3 12 3z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer__rule" aria-hidden="true" />

        {/* 네비게이션 + 소셜 */}
        <div className="footer__body">
          <div className="footer__nav">
            <div className="footer__col">
              <div className="footer__col-label">Collection</div>
              <a href="#archive" className="footer__link">En Lieu S&ucirc;r</a>
              <a href="#archive" className="footer__link">En Lieu S&ucirc;r Magnum</a>
              <a href="#archive" className="footer__link">&Eacute;l&eacute;ment de Surprise</a>
              <a href="#archive" className="footer__link">Atomes Crochus 1yr</a>
              <a href="#archive" className="footer__link">Atomes Crochus 3yr</a>
            </div>
            <div className="footer__col">
              <div className="footer__col-label">Brand</div>
              <a href="#observation" className="footer__link">Ocean Aging</a>
              <a href="#data-archive" className="footer__link">Living Data</a>
              <a href="#the-maker" className="footer__link">The Maker</a>
            </div>
            <div className="footer__col">
              <div className="footer__col-label">Support</div>
              <a href="#ocean-circle" className="footer__link">Ocean Cellar</a>
              <a href="#professionals" className="footer__link">Partnership</a>
              <a href="#" className="footer__link">Contact</a>
            </div>
            {/* 소셜 — 구분선 아래 뉴스레터 옆으로 이동 */}
          </div>
        </div>

        <div className="footer__rule" aria-hidden="true" />

        {/* 하단: 법적 고지 + 언어 */}
        <div className="footer__bottom">
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">이용약관</a>
            <a href="#" className="footer__legal-link">개인정보처리방침</a>
            <a href="#" className="footer__legal-link">쿠키 정책</a>
          </div>
          <div className="footer__lang">
            <a href="#" className="footer__lang-active">KR</a>
            <a href="#" className="footer__lang-link">EN</a>
            <a href="#" className="footer__lang-link">FR</a>
          </div>
        </div>

        <div className="footer__disclaimer">
          지나친 음주는 건강에 해롭습니다. &copy; 2026 Muse de Mar&eacute;e
        </div>
      </div>
    </footer>
  );
}
