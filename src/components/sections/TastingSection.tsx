/** TastingSection — Server Component (CSS-only reveals) */

const NOTES = [
  {
    num: "01",
    label: "Pression",
    desc: "수압이 빚어낸 기포는\n더 섬세하고, 더 조밀합니다.",
  },
  {
    num: "02",
    label: "Courant",
    desc: "해류가 지켜낸 온도는\n산미를 더 선명하게 만듭니다.",
  },
  {
    num: "03",
    label: "Silence",
    desc: "바다가 남긴 질감은\n직접 확인해야만 믿게 됩니다.",
  },
];

export default function TastingSection() {
  return (
    <section id="tasting" className="s-tasting" aria-label="The Tasting">
      {/* 다크→라이트 그라데이션 전환 영역 */}
      <div className="s-tasting__bridge">
        <div className="s-tasting__bridge-text reveal">
          <p className="s-tasting__headline">첫 모금에서 다릅니다.</p>
        </div>
      </div>

      {/* 시네마틱 영상 + 오버레이 노트 */}
      <div className="s-tasting__cinema">
        <div className="s-tasting__image">
          <video
            className="s-tasting__video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/images/tasting.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 테이스팅 노트 밴드 */}
        <div className="s-tasting__note-band reveal reveal-delay-2">
          {NOTES.map((note, i) => (
            <div key={note.num} className="s-tasting__note">
              <div className="s-tasting__note-head">
                <span className="s-tasting__note-num" lang="fr">{note.num}</span>
                <span className="s-tasting__note-label" lang="fr">{note.label}</span>
              </div>
              <p className="s-tasting__note-desc">
                {note.desc.split("\n").map((line, j) => (
                  <span key={j}>
                    {j > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
              {i < NOTES.length - 1 && <span className="s-tasting__note-divider" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
