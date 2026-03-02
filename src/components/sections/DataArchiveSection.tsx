/** DataArchiveSection — Server Component */

const METRICS = [
  { value: "20–40", unit: "m", label: "수심", sub: "depth" },
  { value: "6–12", unit: "°C", label: "수온", sub: "temp." },
  { value: "1.96–4.91", unit: "atm", label: "수압", sub: "pressure" },
  { value: "365+", unit: "일", label: "최소 숙성", sub: "aging" },
  { value: "0.00", unit: "Hz", label: "진동", sub: "vibr." },
  { value: "24/7", unit: "", label: "모니터링", sub: "IoT mon." },
] as const;

/** 수심 — Area chart: 채워진 영역으로 깊이 범위 표현 */
function SparkDepth() {
  return (
    <svg className="s-data__spark" viewBox="0 0 140 44" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="g-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path
        d="M0,22 C16,18 28,12 42,14 C56,16 68,26 82,28 C96,26 108,16 122,14 C132,16 138,20 140,22 L140,44 L0,44 Z"
        fill="url(#g-depth)"
      />
      <path
        d="M0,22 C16,18 28,12 42,14 C56,16 68,26 82,28 C96,26 108,16 122,14 C132,16 138,20 140,22"
        stroke="currentColor" strokeWidth="1.2"
      />
    </svg>
  );
}

/** 수온 — Line + dots: 곡선 위 관측 포인트 표시 */
function SparkTemp() {
  const curve = "M0,32 C12,30 24,18 38,10 C52,4 64,4 76,12 C88,20 100,32 116,38 C128,36 136,32 140,30";
  const dots = [
    [0, 32], [20, 24], [38, 10], [58, 5], [76, 12], [96, 28], [116, 38], [134, 32], [140, 30],
  ];
  return (
    <svg className="s-data__spark" viewBox="0 0 140 44" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d={curve} stroke="currentColor" strokeWidth="1.2" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill="currentColor" opacity="0.6" />
      ))}
    </svg>
  );
}

/** 수압 — Horizontal bands: 안정적인 수압을 수평 레이어로 표현 */
function SparkPressure() {
  return (
    <svg className="s-data__spark" viewBox="0 0 140 44" fill="none" preserveAspectRatio="none" aria-hidden="true">
      {[10, 18, 26, 34].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="140" y2={y} stroke="currentColor" strokeWidth="1" opacity={0.15 + i * 0.1} />
      ))}
      <rect x="0" y="16" width="140" height="12" fill="currentColor" opacity="0.08" rx="1" />
      <line x1="0" y1="22" x2="140" y2="22" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

/** 최소 숙성 — Staircase: 단계적 시간 누적 */
function SparkAging() {
  return (
    <svg className="s-data__spark" viewBox="0 0 140 44" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,40 L12,40 L12,36 L28,36 L28,31 L44,31 L44,26 L60,26 L60,22 L76,22 L76,17 L92,17 L92,13 L108,13 L108,9 L124,9 L124,5 L140,5"
        stroke="currentColor" strokeWidth="1.2"
      />
      {[
        [12, 36], [28, 31], [44, 26], [60, 22], [76, 17], [92, 13], [108, 9], [124, 5],
      ].map(([x, y], i) => (
        <rect key={i} x={Number(x) - 1.5} y={Number(y) - 1.5} width="3" height="3" fill="currentColor" opacity="0.4" />
      ))}
    </svg>
  );
}

/** 진동 — Scatter dots: 바닥 근처 미세 점들 (무진동) */
function SparkVibration() {
  const dots = [
    [6, 38], [14, 36], [22, 39], [30, 37], [40, 38], [48, 40], [56, 37],
    [66, 39], [74, 38], [82, 36], [90, 39], [100, 38], [108, 40], [118, 37], [126, 39], [134, 38],
  ];
  return (
    <svg className="s-data__spark" viewBox="0 0 140 44" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="40" x2="140" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="2 4" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="currentColor" opacity={0.2 + (i % 3) * 0.1} />
      ))}
    </svg>
  );
}

/** 모니터링 — Vertical bars: 균일한 막대로 24/7 상시 가동 표현 */
function SparkMonitoring() {
  const bars = Array.from({ length: 18 }, (_, i) => ({
    x: 4 + i * 7.6,
    h: 18 + (i % 3 === 0 ? 8 : i % 2 === 0 ? 4 : 0),
  }));
  return (
    <svg className="s-data__spark" viewBox="0 0 140 44" fill="none" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={44 - b.h}
          width="3"
          height={b.h}
          fill="currentColor"
          opacity={0.25 + (b.h > 22 ? 0.15 : 0)}
          rx="0.5"
        />
      ))}
    </svg>
  );
}

const SPARK_COMPONENTS = [
  SparkDepth, SparkTemp, SparkPressure, SparkAging, SparkVibration, SparkMonitoring,
];

export default function DataArchiveSection() {
  return (
    <section id="data-archive" className="s-data">
      <div className="container s-data__inner">
        {/* Header row: title left ↔ statement right */}
        <div className="s-data__header reveal">
          <div className="s-data__header-left">
            <div className="s-data__label">
              OCEAN CELLAR<sup className="s-data__tm">TM</sup>
            </div>
            <h2 className="s-data__title">data archive.</h2>
          </div>
          <div className="s-data__statements">
            <p className="s-data__statement-block">
              단순히 바다에 넣은 것이 아니다.
              <br />
              <mark className="s-data__highlight">설계된 것이다.</mark>
            </p>
            <p className="s-data__statement-block">
              지상의 셀러가 만들 수 없는 조건을
              <br />
              바다가 만든다.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="s-data__rule reveal" style={{ transitionDelay: "120ms" }} />

        {/* Data Panel — 3×2, each with unique graph style */}
        <div className="s-data__panel">
          {METRICS.map((m, i) => {
            const Spark = SPARK_COMPONENTS[i];
            return (
              <div
                key={m.sub}
                className="s-data__metric reveal"
                style={{ transitionDelay: `${180 + i * 70}ms` }}
              >
                <div className="s-data__metric-head">
                  <div className="s-data__metric-labels">
                    <span className="s-data__metric-label">{m.label}</span>
                    <span className="s-data__metric-sub">{m.sub}</span>
                  </div>
                  <div className="s-data__metric-val">
                    <span className="s-data__metric-num">{m.value}</span>
                    {m.unit && <span className="s-data__metric-unit">{m.unit}</span>}
                  </div>
                </div>
                <Spark />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <hr className="s-data__rule reveal" style={{ transitionDelay: "650ms" }} />
        <p className="s-data__footer reveal" style={{ transitionDelay: "700ms" }}>
          데이터 기록 주기 6시간 · IoT 센서 상시 가동 · 검증 기관 인증
        </p>
        <div className="s-data__cta-wrap reveal" style={{ transitionDelay: "760ms" }}>
          <a href="/data-archive" className="s-data__cta">
            아카이브 전체 보기 &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
