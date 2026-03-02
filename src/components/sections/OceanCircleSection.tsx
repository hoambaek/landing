/** OceanCircleSection — Server Component */
export default function OceanCircleSection() {
  return (
    <section id="ocean-circle" className="s-circle">
      {/* 비네팅 오버레이 */}
      <div className="s-circle__vignette" />

      <div className="container">
        <div className="s-circle__inner">
          {/* 호흡 링 */}
          <div className="s-circle__visual reveal">
            <div className="s-circle__ring" />
          </div>

          {/* 카피 */}
          <div className="s-circle__content reveal reveal-delay-1">
            <h2 className="s-circle__title">ocean circle.</h2>
            <p className="s-circle__headline">
              가입이 아니다.
              <br />
              초대.
            </p>
            <a href="/ocean-circle" className="s-circle__cta">
              원에 들어오다 &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
