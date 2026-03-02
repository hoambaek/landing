/** ProfessionalsSection — Server Component */
export default function ProfessionalsSection() {
  return (
    <section id="professionals" className="s-pro hanji-texture">
      <div className="container">
        <div className="s-pro__center reveal">
          <h2 className="s-pro__title">for professionals.</h2>
          <div className="s-pro__title-kr">
            바다의 시간을 테이블 위에 놓는 일.
          </div>
          <p className="s-pro__desc">
            파인다이닝. 호텔 바. 프라이빗 셀러.
            <br />
            공간의 격에 맞는 제안.
          </p>
          <a href="/professionals" className="s-pro__cta">
            문의하기 &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
