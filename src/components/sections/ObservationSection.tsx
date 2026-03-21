/** ObservationSection — Server Component (CSS-only reveals) */
import Image from "next/image";

export default function ObservationSection() {
  return (
    <section id="observation" className="s-obs" aria-label="Observation">
      <div className="s-obs__proposition">
        <div className="container">
          <div className="reveal">
            <h2 className="s-obs__headline">
              수심 50미터.
              <br />
              빛이 사라진 곳에서
              <br />
              숙성이 시작됩니다.
            </h2>
          </div>

          <div className="s-obs__rule reveal reveal-delay-1" aria-hidden="true" />

          <div className="reveal reveal-delay-2">
            <div className="s-obs__intro">
              <p>
                3.98기압의 수압이 기포를 다듬고,
                <br />
                8°C의 해류가 온도를 지키고,
                <br />
                완벽한 어둠이 시간을 느리게 합니다.
              </p>
              <p>
                이 조건들은 상상이 아닙니다.
                <br />
                지금 이 순간에도 측정되고 있습니다.
              </p>
            </div>
          </div>


        </div>
      </div>

      <div className="s-obs__image">
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
