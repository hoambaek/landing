/** TheMakerSection — Server Component */
export default function TheMakerSection() {
  return (
    <section id="the-maker" className="s-maker hanji-texture">
      <div className="container">
        {/* 헤더 */}
        <div className="s-maker__header reveal">
          <h2 className="s-maker__title">the maker.</h2>
          <div className="s-maker__title-kr">이중의 떼루아</div>
          <p className="s-maker__sub">
            7천만 년 전 바다였던 땅에서 태어나,
            <br />
            지금의 바다에서 완성되는 것.
          </p>
        </div>

        {/* 2컬럼 카드 */}
        <div className="s-maker__cards">
          {/* 카드 1 — Champagne Mignon Boulard */}
          <div className="s-maker__card reveal">
            <div className="s-maker__card-image" />
            <div className="s-maker__card-label">partner maison</div>
            <div className="s-maker__card-name">
              Champagne Mignon Boulard
            </div>
            <p className="s-maker__card-desc">
              Venteuil, Vall&eacute;e de la Marne.
              <br />
              6.42헥타르, 49개 마이크로 파셀.
              <br />
              제초제 없이 직접 경작하는 토양.
              <br />
              온도 조절 없는 자연 발효.
              <br />
              여과하지 않는 와인.
            </p>
          </div>

          {/* 카드 2 — Muse de Maree */}
          <div className="s-maker__card reveal reveal-delay-1">
            <div className="s-maker__card-image" />
            <div className="s-maker__card-label">aging team</div>
            <div className="s-maker__card-name">
              Muse de Mar&eacute;e
            </div>
            <p className="s-maker__card-desc">
              대한민국 남해안, 수심 20&ndash;40m.
              <br />
              474병의 첫 빈티지를 바다에 맡긴 팀.
              <br />
              설계하고, 기록하고,
              <br />
              바다가 완성할 때까지 기다리는 일.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
