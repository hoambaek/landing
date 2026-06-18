/** OriginSection — Server Component */
export default function OriginSection() {
  return (
    <section id="origin" className="s-origin" aria-label="Origin">
      <div className="container">
        <div className="s-origin__content">
          <div className="reveal">
            <h2>origin<span className="dot">.</span></h2>
          </div>
          <div className="s-origin__body reveal reveal-delay-1">
            <p>뮤즈드마레는 하나의 질문에서 시작되었습니다.</p>
            <p className="s-origin__question">
              &lsquo;바다는 와인에 무엇을 할 수 있을까?&rsquo;
            </p>
            <p>
              이 질문은 낭만이 아니라 가설이었습니다. 수압, 수온, 광차단,
              해류. 해저의 조건들을 하나씩 측정하고, 예측하고, 검증하면서
              뮤즈드마레의 첫 번째 병이 바다로 내려갔습니다.
            </p>
            <p className="s-origin__conclusion">
              그리고 다시 올라온 그 병은 내려가기 전과 같은 와인이 아니었습니다.
            </p>
          </div>
        </div>

        {/* placeholder 이미지 */}
        <div className="s-origin__image reveal">
          <div
            className="s-origin__placeholder"
            role="img"
            aria-label="오리진 이미지 플레이스홀더"
          >
            <span aria-hidden="true">ORIGIN IMAGE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
