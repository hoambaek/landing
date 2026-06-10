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
          <span>2026. 06.</span>
          <span className="s-first__hl-sentence">
            <span>첫 번째 기록이</span>{" "}
            <span>수면 위로 돌아왔습니다</span>
          </span>
        </p>
      </header>

      {/* ── 데스크톱 4컷 ── */}
      <div className="s-first__rows s-first__rows--desktop">
        <figure className="s-first__row s-first__row--left">
          <div className="s-first__plate s-first__plate--01">
            <Image src="/images/ai/rec01.webp" alt="어둠 속 인양 케이지 — 인양 개시" fill sizes="680px" className="s-first__img" />
          </div>
          <figcaption className="s-first__cap s-first__cap--amber">
            기록 01 · 05:41 KST · 수심 30M · 인양 개시
          </figcaption>
        </figure>

        <figure className="s-first__row s-first__row--right">
          <div className="s-first__plate s-first__plate--02">
            <Image src="/images/ai/rec02.webp" alt="로프를 회수하는 손 — 로프 회수" fill sizes="480px" className="s-first__img" />
          </div>
          <figcaption className="s-first__cap s-first__cap--amber">
            기록 02 · 05:58 KST · 로프 회수 · 0.3M/S
          </figcaption>
        </figure>

        <figure className="s-first__row s-first__row--center">
          <div className="s-first__plate s-first__plate--03">
            <Image src="/images/ai/rec03.webp" alt="수면에서 만나는 첫 빛 — 첫 빛" fill sizes="920px" className="s-first__img" />
          </div>
          <figcaption className="s-first__cap s-first__cap--earth">
            기록 03 · 06:12 KST · 수면 · 첫 빛
          </figcaption>
        </figure>

        <span className="s-first__connector" aria-hidden="true" />

        <figure className="s-first__row s-first__row--center">
          <div className="s-first__plate s-first__plate--04">
            <Image src="/images/ai/rec04.webp" alt="따개비와 소금 결정이 앉은 병 표면 — 바다가 쓴 원고" fill sizes="920px" className="s-first__img" />
          </div>
          <figcaption className="s-first__cap s-first__cap--earth">
            기록 04 · 같은 날 · 바다가 쓴 원고
          </figcaption>
        </figure>
      </div>

      {/* ── 모바일 3컷 ── */}
      <div className="s-first__rows s-first__rows--mobile">
        <figure className="s-first__row">
          <div className="s-first__plate s-first__plate--m1">
            <Image src="/images/ai/rec01.webp" alt="어둠 속 인양 케이지 — 인양 개시" fill sizes="300px" className="s-first__img" />
          </div>
          <figcaption className="s-first__cap s-first__cap--amber">
            기록 01 · 05:41 KST · 인양 개시
          </figcaption>
        </figure>

        <span className="s-first__connector" aria-hidden="true" />

        <figure className="s-first__row s-first__row--bleed">
          <div className="s-first__plate s-first__plate--m2">
            <Image src="/images/ai/rec03.webp" alt="수면에서 만나는 첫 빛 — 첫 빛" fill sizes="100vw" className="s-first__img" />
          </div>
          <figcaption className="s-first__cap s-first__cap--earth s-first__cap--indent">
            기록 02 · 06:12 KST · 수면 · 첫 빛
          </figcaption>
        </figure>

        <span className="s-first__connector s-first__connector--dim" aria-hidden="true" />

        <figure className="s-first__row">
          <div className="s-first__plate s-first__plate--m3">
            <Image src="/images/ai/rec04.webp" alt="따개비와 소금 결정이 앉은 병 표면 — 바다가 쓴 원고" fill sizes="300px" className="s-first__img" />
          </div>
          <figcaption className="s-first__cap s-first__cap--earth">
            기록 03 · 같은 날 · 바다가 쓴 원고
          </figcaption>
        </figure>
      </div>

      {/* Closing */}
      <footer className="s-first__closing reveal">
        <p className="s-first__closing-line">
          <span>병마다 다른 바다의 지문</span>
          <span>같은 병은 없습니다</span>
        </p>
      </footer>
    </section>
  );
}
