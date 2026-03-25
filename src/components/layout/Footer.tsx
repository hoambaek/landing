/** Footer — Server Component */
export default function Footer({ hideSubscribe = false }: { hideSubscribe?: boolean }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* 히어로 — 대형 브랜드 타이포 */}
        <div className="footer__hero">
          <span className="footer__brand">MUSE DE MAREE</span>
          <span className="footer__tagline">두 개의 떼루아, 하나의 샴페인.</span>
        </div>

        {/* 네비게이션 — 가로 인라인 */}
        <div className="footer__nav">
          <div className="footer__nav-group">
            <span className="footer__nav-label">Collection</span>
            <div className="footer__nav-links">
              <a href="#archive" className="footer__link">En Lieu S&ucirc;r</a>
              <a href="#archive" className="footer__link">Magnum</a>
              <a href="#archive" className="footer__link">&Eacute;l&eacute;ment de Surprise</a>
              <a href="#archive" className="footer__link">Atomes Crochus</a>
            </div>
          </div>
          <div className="footer__nav-right">
            <div className="footer__nav-group">
              <span className="footer__nav-label">Brand</span>
              <div className="footer__nav-links">
                <a href="#observation" className="footer__link">Ocean Aging</a>
                <a href="#data-archive" className="footer__link">Sea Log</a>
                <a href="#the-maker" className="footer__link">The Maker</a>
              </div>
            </div>
            <div className="footer__nav-group">
              <span className="footer__nav-label">Support</span>
              <div className="footer__nav-links">
                <a href="#ocean-circle" className="footer__link">Ocean Cellar</a>
                <a href="#professionals" className="footer__link">Partnership</a>
                <a href="#" className="footer__link">Contact</a>
              </div>
            </div>
          </div>
        </div>

        {/* 법인 정보 */}
        <div className="footer__entity">
          <span>주식회사 오크니</span>
          <span>대표 정설화</span>
          <span>사업자등록번호 509-88-03399</span>
          <span>서울특별시 강남구 압구정로 306, B1 #6-J14</span>
          <span>info@musedemaree.com</span>
        </div>

        {/* 경고문 */}
        <p className="footer__warning">
          알코올은 발암물질로 지나친 음주는 간암, 위암 등을 일으킵니다. 임신 중 음주는 기형아 출생 위험을 높입니다.
        </p>

        {/* 하단 — 저작권 + 소셜 + 약관 + 언어 */}
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <span className="footer__copyright">&copy; 2026 Muse de Mar&eacute;e</span>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="4" /><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" /></svg>
              </a>
            </div>
          </div>
          <div className="footer__bottom-right">
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
        </div>
      </div>
    </footer>
  );
}
