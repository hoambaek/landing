/** ObservationSection — Server Component (CSS-only reveals) */
import Image from "next/image";

export default function ObservationSection() {
  return (
    <section id="observation" className="s-obs" aria-label="Observation">
      <div className="s-obs__proposition">
        <div className="container">
          <div className="reveal">
            <h2 className="s-obs__headline">
              바다는
              <br />
              가장 오래된
              <br />
              저장고입니다.
            </h2>
          </div>
          <div className="reveal reveal-delay-2">
            <div className="s-obs__intro">
              <p>
                수천 년간 바다는 온도와 빛으로부터
                <br />
                모든 것을 고요히 품어왔습니다.
              </p>
              <p>
                샹파뉴의 백악 토양이 만든 샴페인을
                <br />
                한국 남해 청정해역의 바다가 숙성합니다.
              </p>
              <p className="s-obs__emphasis">
                두 개의 떼루아가
                <br />
                하나의 샴페인 안에서 만납니다.
              </p>
            </div>
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
