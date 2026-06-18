import Image from "next/image";

/**
 * S3 · The First Record — 인양 (다크→라이트 클라이맥스, Paper 03 1:1)
 * 연속 그라데이션 배경 + Entry + 플레이트 4컷(데스크톱) / 3컷(모바일) + 타임코드 캡션 + Closing.
 * 이미지: rec01~04 (AI 시안 — 인양 실사 확보 시 교체).
 */
export default function TheFirstRecordSection() {
  return (
    <section id="the-first-record" className="s-first">
      {/* Entry */}
      <header className="s-first__entry reveal">
        <span className="s-first__eyebrow">THE FIRST RECORD</span>
        <p className="s-first__headline">
          <Image
            src="/text/first-headline.png"
            alt="첫 번째 기록이 수면 위로 떠올랐습니다"
            width={679}
            height={54}
            className="s-first__headline-img s-first__headline-img--d"
          />
          <Image
            src="/text/first-headline-m.png"
            alt="첫 번째 기록이 수면 위로 떠올랐습니다"
            width={233}
            height={70}
            className="s-first__headline-img s-first__headline-img--m"
          />
        </p>
      </header>

      {/* ── 데스크톱 4컷 ── */}
      <div className="s-first__rows s-first__rows--desktop">
        <figure className="s-first__row s-first__row--center">
          <div className="s-first__plate s-first__plate--03">
            <Image src="/images/ai/rec03.webp" alt="수면에서 만나는 첫 빛 · 첫 빛" fill sizes="920px" className="s-first__img" />
          </div>
        </figure>

        <span className="s-first__connector" aria-hidden="true" />

        <figure className="s-first__row s-first__row--center">
          <div className="s-first__plate s-first__plate--04">
            <Image src="/images/ai/rec04.webp" alt="따개비와 소금 결정이 앉은 병 표면 · 바다가 쓴 원고" fill sizes="920px" className="s-first__img" />
          </div>
        </figure>
      </div>

      {/* ── 모바일 3컷 ── */}
      <div className="s-first__rows s-first__rows--mobile">
        <figure className="s-first__row s-first__row--bleed">
          <div className="s-first__plate s-first__plate--m2">
            <Image src="/images/ai/rec03.webp" alt="수면에서 만나는 첫 빛 · 첫 빛" fill sizes="100vw" className="s-first__img" />
          </div>
        </figure>

        <span className="s-first__connector s-first__connector--dim" aria-hidden="true" />

        <figure className="s-first__row">
          <div className="s-first__plate s-first__plate--m3">
            <Image src="/images/ai/rec04.webp" alt="따개비와 소금 결정이 앉은 병 표면 · 바다가 쓴 원고" fill sizes="300px" className="s-first__img" />
          </div>
        </figure>
      </div>

      {/* Closing */}
      <footer className="s-first__closing reveal">
        <p className="s-first__closing-line">
          <Image
            src="/text/first-closing.png"
            alt="병마다 다른 바다의 지문 같은 병은 없습니다"
            width={350}
            height={104}
            className="s-first__closing-img"
          />
        </p>
      </footer>
    </section>
  );
}
