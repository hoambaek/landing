/** Footer — Server Component */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* 상단: 네비게이션 컬럼 */}
        <div className="footer__nav">
          <div className="footer__col">
            <div className="footer__col-title">Collection</div>
            <a href="#archive" className="footer__link">En Lieu S&ucirc;r.</a>
            <a href="#archive" className="footer__link">En Lieu S&ucirc;r Magnum.</a>
            <a href="#archive" className="footer__link">&Eacute;l&eacute;ment de Surprise.</a>
            <a href="#archive" className="footer__link">Atomes Crochus 1yr.</a>
            <a href="#archive" className="footer__link">Atomes Crochus 3yr.</a>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">Brand</div>
            <a href="#observation" className="footer__link">Observation</a>
            <a href="#data-archive" className="footer__link">Data Archive</a>
            <a href="#the-maker" className="footer__link">The Maker</a>
            <a href="#ocean-circle" className="footer__link">Ocean Circle</a>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">Support</div>
            <a href="#professionals" className="footer__link">For Professionals</a>
            <a href="#" className="footer__link">Contact</a>
            <a href="#" className="footer__link">FAQ</a>
          </div>
        </div>

        {/* 중단: 소셜 + 뉴스레터 */}
        <div className="footer__middle">
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Instagram">Instagram</a>
            <a href="#" className="footer__social-link" aria-label="YouTube">YouTube</a>
            <a href="#" className="footer__social-link" aria-label="KakaoTalk">KakaoTalk</a>
          </div>
          <div className="footer__newsletter">
            Muse de Mar&eacute;e의 소식을 받아보세요.
          </div>
        </div>

        {/* 하단: 법적 고지 */}
        <div className="footer__bottom">
          <div className="footer__logo">MUSE DE MAR&Eacute;E</div>
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">이용약관</a>
            <a href="#" className="footer__legal-link">개인정보처리방침</a>
            <a href="#" className="footer__legal-link">쿠키 정책</a>
          </div>
          <div className="footer__copy">
            &copy; 2026 Muse de Mar&eacute;e. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
