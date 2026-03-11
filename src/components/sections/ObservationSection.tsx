/** ObservationSection — Server Component (CSS-only reveals) */
import Image from "next/image";

export default function ObservationSection() {
  return (
    <section id="observation" className="s-obs" aria-label="Observation">
      <div className="s-obs__proposition">
        <div className="container">
          <div className="reveal">
            <h2 className="s-obs__headline">
              바다가 숙성한
              <br />
              샴페인
            </h2>
          </div>

          <div className="s-obs__rule reveal reveal-delay-1" aria-hidden="true" />

          <div className="reveal reveal-delay-2">
            <div className="s-obs__intro">
              <p>
                샹파뉴의 포도밭에서 태어난 한 병이
                <br />
                한국 남해, 수심 50미터로 내려갑니다.
              </p>
              <p>
                빛 대신 수압이,
                <br />
                공기 대신 해류가,
                <br />
                시간 대신 파도가 병을 감쌉니다.
              </p>
            </div>
          </div>

          <div className="reveal reveal-delay-3">
            <p className="s-obs__emphasis">
              지상의 셀러는 닿을 수 없는 시간.
            </p>
          </div>
        </div>
      </div>

      <div className="s-obs__image reveal">
        <Image
          src="/images/o1.webp"
          alt="해저 숙성 환경"
          fill
          className="s-obs__image-inner"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
