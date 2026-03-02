# 홈페이지 인터랙션 디테일 — 프론트엔드 구현 참조

> 담당팀: 03-ux-team
> 기준 와이어프레임: `wireframe/homepage-wireframe.html`
> 참조: `homepage-flow.md`, `00-luxury-branding-team/final-homepage-plan.md`
> 작성일: 2026-02-23
> 목적: 와이어프레임을 코드로 옮길 때 놓치기 쉬운 세부 디테일 정리

---

## 1. S1→S2 전환 디테일 (The Void → Observation)

### 1-1. Hero 스크롤 아웃 시퀀스

와이어프레임에서 S1(`.s-void`)은 `200vh` 높이에 `sticky` 핀으로 구현되어 있다. 스크롤 진행도에 따라 다음 순서로 퇴장한다.

```
스크롤 구간 (S1 내부 기준)
─────────────────────────────────────────────────────
0%        히어로 콘텐츠 완전 노출 (headline + sub + scroll indicator)
0~50%     콘텐츠 opacity: 1 → 0, translateY: 0 → -scrollY*0.3
          scroll indicator: 동일 비율로 퇴장, 속도 계수 0.5 (본문보다 느리게)
50%       콘텐츠 완전 투명
50~100%   sticky 핀 유지, 배경만 노출 상태
100%      S1 언핀, S2 진입
```

**배경색 보간 타이밍**

와이어프레임 기준 S1 배경은 `--warm-ivory`(`#ECEAE6`), S2(`.s-obs__pin`) 배경은 스크롤 진행도에 따라 `#ECEAE6` → `#0A0908`로 보간된다. 전환 경계에서 색 점프가 발생하지 않으려면:

```
S1 sticky 핀 배경:      #ECEAE6 (고정)
S2 sticky 핀 초기 배경:  #ECEAE6 (S1과 동일한 색에서 시작)
S2 progress 0.00~1.00:  #ECEAE6 → #0A0908 (선형 보간)
```

- 보간 함수: 와이어프레임의 `lerpColor()` 사용. RGB 채널별 선형 보간.
- 전환 시작 시점: S2 섹션 상단이 뷰포트에 닿는 순간 (S1 sticky 해제와 동시).
- 중간 색상 참고: progress 0.5 지점에서 대략 `rgb(123, 122, 119)` — 어두운 그레이지.

**파티클 페이드아웃 타이밍**

S1의 `.particle` 요소는 CSS `float-up` 애니메이션으로 동작한다. 스크롤 아웃 시:

```
S1 progress 0~30%:    파티클 정상 동작
S1 progress 30~60%:   파티클 컨테이너(.s-void__particles) opacity: 1 → 0
S1 progress 60%+:     파티클 비활성 (display: none 또는 visibility: hidden)
```

- 구현 시 주의: 파티클 컨테이너에 `will-change: opacity` 적용. 개별 파티클이 아닌 컨테이너 단위로 제어.
- `prefers-reduced-motion` 환경: 파티클 `.particle { display: none }` (와이어프레임에 이미 구현됨).

**헤더 색상 전환**

와이어프레임의 `.header__logo`와 `.header__menu span`은 `--void-text`(`#F1EFEB`)로 고정되어 있다. S1은 라이트 배경이므로:

```
S1 구간:  헤더 로고/메뉴 색상 → 다크 (#312E2A)
S2 전반: 배경 밝음 → 다크, 동기적으로 로고/메뉴 색상 반전
S2 후반: 배경 어둡 → 로고/메뉴 라이트 (#F1EFEB)
```

- 구현 방법: IntersectionObserver 또는 스크롤 기반으로 `.header`에 `.header--light` / `.header--dark` 클래스 토글.
- 전환 duration: `0.5s var(--ease-water)`.
- 와이어프레임 미반영 사항: 현재 와이어프레임에서 헤더 색상 전환이 구현되어 있지 않다. 반드시 추가 필요.

---

## 2. S2 Pressure Descent 타이밍 맵

### 2-1. 전체 구간 분할

와이어프레임 기준 S2(`.s-obs`)는 `400vh` 높이. 스크롤 진행도(`progress`)는 0.00~1.00.

```
progress 계산식 (와이어프레임 JS 참조):
  relScroll = window.scrollY - obsSection.offsetTop
  progress = clamp(relScroll / (obsHeight - viewportHeight), 0, 1)
```

### 2-2. 각 Fact의 등장/퇴장 스크롤 구간

와이어프레임 JS에서 추출한 정확한 계산식:

```javascript
factZoneStart = 0.05;   // 5%에서 첫 fact 시작
factZoneEnd   = 0.82;   // 82%에서 마지막 fact 종료
climaxStart   = 0.85;   // 85%에서 클라이맥스 시작
factCount     = 5;
```

각 fact의 구간:

| Fact | data-obs-depth | 등장 시작 | 피크 (opacity 1.0) | 퇴장 완료 | 카피 |
|------|---------------|----------|-------------------|----------|------|
| 0 (0m) | 0 | **5.0%** | **17.3%** | **18.8%** | "수면. 빛과 공기." |
| 1 (-10m) | 1 | **20.4%** | **32.7%** | **34.2%** | "빛의 90%가 사라지는 지점." |
| 2 (-20m) | 2 | **35.8%** | **48.1%** | **49.6%** | "3기압. 기포의 직경이 절반으로." |
| 3 (-30m) | 3 | **51.2%** | **63.5%** | **65.0%** | "수온 8°C. 숙성이 시작되는 온도." |
| 4 (-40m) | 4 | **66.6%** | **78.9%** | **80.4%** | "완전한 어둠. 완전한 고요. 여기서 12개월." |
| 클라이맥스 | - | **85.0%** | **100%** (fade-in) | 유지 | "아무것도 하지 않았다. 전부 달라졌다." |

**계산 공식** (fact index `i`):

```
fStart = 0.05 + (0.82 - 0.05) * (i / 5)       // 등장 시작
fPeak  = fStart + 0.77 * (0.4 / 5)             // 피크 (최대 opacity)
fEnd   = fStart + 0.77 * (0.9 / 5)             // 퇴장 완료
```

**등장 곡선** (fStart → fPeak):
```
opacity: 0 → 1 (선형)
translateY: 20px → 0px (선형)
```

**퇴장 곡선** (fPeak → fEnd):
```
opacity: 1 → 0 (선형)
translateY: 0px → -10px (선형)
```

### 2-3. 배경색 보간 커브

```
progress 0.00: #ECEAE6 (warm-ivory, 라이트)
progress 0.25: ~#A4A19D (중간 그레이)
progress 0.50: ~#5B5853 (어두운 그레이)
progress 0.75: ~#2A2723 (거의 다크)
progress 1.00: #0A0908 (void-bg, 완전 다크)
```

- 보간: RGB 채널별 선형(`lerpColor` 함수).
- 텍스트 색상 동기 보간: `#312E2A` → `#F1EFEB`.
- 전환 인지 임계점: progress ~0.35 지점에서 배경이 중간 밝기를 통과하며, 이때 fact 텍스트의 가독성이 가장 취약하다.

**가독성 보장 로직** (와이어프레임에 이미 구현):
```javascript
// fact 등장 시점의 배경 밝기 계산
factBgBrightness = (1 - factProgress) * 236 + factProgress * 10;
if (factBgBrightness > 120) fact.color = '#1a1815';  // 라이트 배경 → 다크 텍스트
else fact.color = '#F1EFEB';                          // 다크 배경 → 라이트 텍스트
```

### 2-4. 깊이 카운터 동기

```
progress 0.00 → "0m"
progress 0.25 → "-10m"
progress 0.50 → "-20m"
progress 0.75 → "-30m"
progress 1.00 → "-40m"
```

- 계산: `Math.round(progress * 40)` + "m" 접두어.
- 폰트: `var(--font-heading)`, italic, clamp(2.5rem, 5vw, 4rem).
- 위치: 우상단 고정 (absolute, top: 48px, right: 80px).
- opacity: 0.15 (은은하게 표시).

### 2-5. 수직 깊이 라인

```
progress 0.00: width 1px, opacity 0.06
progress 1.00: width 3px, opacity 0.12
```

- 위치: 화면 정중앙 수직선.
- 그라데이션: 상단 `rgba(49,46,42,0.06)` → 하단 `rgba(241,239,235,0.08)`.
- 색상은 배경 전환과 독립적 (gradient 자체가 상/하 톤을 커버).

### 2-6. 타이포그래피 압축 효과

스크롤 진행에 따라 전체 `.s-obs__pin`의 타이포그래피가 미세하게 압축된다:

```
progress 0.00: letter-spacing 0.04em, line-height 2.2
progress 1.00: letter-spacing 0.01em, line-height 1.7
```

- 심해의 압력감을 무의식적으로 전달하기 위한 장치.
- 의식적으로 인지되면 안 된다. 최대 변화폭이 작으므로 주의.

---

## 3. 스크롤 리빌 트리거

### 3-1. 공통 IntersectionObserver 설정

와이어프레임의 공통 `.reveal` 클래스에 적용되는 기본 설정:

```javascript
const observer = new IntersectionObserver(callback, {
  threshold: 0.15,
  rootMargin: '0px 0px -8% 0px'
});
```

### 3-2. 섹션별 권장 설정

| 섹션 | 요소 | threshold | rootMargin | 비고 |
|------|------|-----------|------------|------|
| **S1 The Void** | 자동 재생 (CSS animation) | N/A | N/A | IntersectionObserver 미사용. 페이지 로드 시 즉시 실행 |
| **S2 Observation** | `.s-obs` (Pressure Descent) | N/A | N/A | 스크롤 위치 기반 계산 (IO 미사용) |
| **S2 Evidence** | `.s-obs__evidence-header` | 0.15 | `0px 0px -8% 0px` | 기본 reveal |
| **S2 Evidence** | `.s-obs__pair` (before/after) | 0.15 | `0px 0px -8% 0px` | 각 pair 독립 트리거 |
| **S2 Evidence** | `.s-obs__closing` | 0.15 | `0px 0px -8% 0px` | 기본 reveal |
| **S3 Data Archive** | `.s-data__header` | 0.15 | `0px 0px -8% 0px` | 기본 reveal |
| **S3 Data Archive** | `.s-data__wave` | 0.15 | `0px 0px -8% 0px` | reveal-delay-1 (0.15s) |
| **S3 Data Archive** | `.s-data__metrics` | 0.15 | `0px 0px -8% 0px` | reveal-delay-2 (0.3s). **카운팅 애니메이션 트리거 포인트** |
| **S3 Data Archive** | `.s-data__bottom` | 0.15 | `0px 0px -8% 0px` | reveal-delay-3 (0.45s) |
| **S4 The Maker** | `.s-maker__header` | 0.15 | `0px 0px -8% 0px` | 기본 reveal |
| **S4 The Maker** | `.s-maker__card` (왼쪽) | 0.15 | `0px 0px -8% 0px` | 기본 reveal |
| **S4 The Maker** | `.s-maker__card` (오른쪽) | 0.15 | `0px 0px -8% 0px` | reveal-delay-1 (0.15s) |
| **S5 Archive** | `.s-archive__header` | 0.15 | `0px 0px -8% 0px` | 기본 reveal |
| **S5 Archive** | `.s-archive__carousel-wrap` | 0.15 | `0px 0px -8% 0px` | reveal-delay-1 (0.15s) |
| **S5 Archive** | `.s-archive__provenance` | 0.15 | `0px 0px -8% 0px` | 기본 reveal |
| **S6 Ocean Circle** | `.s-circle__visual` | 0.15 | `0px 0px -8% 0px` | 기본 reveal |
| **S6 Ocean Circle** | `.s-circle__content` | 0.15 | `0px 0px -8% 0px` | reveal-delay-1 (0.15s) |
| **S7 Professionals** | `.s-pro__center` | 0.15 | `0px 0px -8% 0px` | 기본 reveal |

### 3-3. reveal 애니메이션 상세

```css
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.9s var(--ease-gentle),
              transform 0.9s var(--ease-gentle);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**딜레이 클래스**:
```
.reveal-delay-1 → transition-delay: 0.15s
.reveal-delay-2 → transition-delay: 0.30s
.reveal-delay-3 → transition-delay: 0.45s
.reveal-delay-4 → transition-delay: 0.60s
```

### 3-4. 섹션 인디케이터 (`.indicator`)

```javascript
// 활성 섹션 감지
function updateIndicator() {
  const center = window.scrollY + window.innerHeight * 0.4;  // 뷰포트 40% 지점
  let activeId = 'void';
  document.querySelectorAll('section[id]').forEach(section => {
    if (section.offsetTop <= center) activeId = section.id;
  });
  // 활성 도트 전환
}
```

- 활성 도트: `height: 4px → 20px`, `border-radius: 50% → 2px`, `opacity: 0.25 → 0.6`.
- `mix-blend-mode: difference` 적용으로 배경색과 무관하게 가시성 확보.
- 모바일(767px 이하): `display: none`.

### 3-5. 구현 시 주의사항

1. **단방향 트리거**: 와이어프레임의 IO 콜백은 `isIntersecting`만 검사하고, 뷰포트를 벗어날 때 `is-visible`을 제거하지 않는다. 즉, 한 번 등장한 요소는 스크롤을 올려도 다시 숨겨지지 않는다.
2. **Passive 리스너**: 스크롤 이벤트 리스너는 모두 `{ passive: true }` 적용 (와이어프레임에 이미 적용됨).
3. **requestAnimationFrame**: 섹션 인디케이터 업데이트는 `rAF` 스로틀 적용 (와이어프레임에 `ticking` 플래그로 구현).

---

## 4. 모바일 적응 체크리스트 (≤767px)

### 4-1. 전역 변경

| 항목 | 데스크톱 | 모바일 (≤767px) |
|------|---------|----------------|
| `--grid-margin` | 80px | **24px** |
| `--grid-gutter` | 24px | **16px** |
| 섹션 인디케이터 | 우측 세로 도트 | **숨김** (`display: none`) |
| 헤더 패딩 | 36px | **24px** |
| 푸터 레이아웃 | 수평 (logo + copy) | **세로 스택** + 중앙 정렬 |

### 4-2. 섹션별 변경 요소

#### S1 — The Void
| 요소 | 변경 |
|------|------|
| `.s-void__headline` font-size | `clamp(36px, 6vw, 64px)` → `clamp(28px, 8vw, 40px)` |
| `.s-void__headline` letter-spacing | `0.08em` → `0.06em` |

#### S2 — Observation (Pressure Descent)
| 요소 | 변경 |
|------|------|
| `.s-obs__depth` (깊이 카운터) | `right: 80px` → `right: 24px`, font-size `2.5rem` 고정 |
| `.s-obs__pair` (before/after) | 2컬럼 → **단일 컬럼**, gap `2px` → `32px`, 좌우 패딩 24px |
| `.s-obs__pair-title` | `grid-column: 1/-1` → `grid-column: 1` |
| `.s-obs__evidence` 패딩 | `160px 0` → `100px 0` |

#### S3 — Data Archive
| 요소 | 변경 |
|------|------|
| 섹션 패딩 | `240px 0 280px` → `160px 0 200px` |
| `.s-data__wave` height | `320px` → `200px` |
| `.s-data__metrics` | 수평 3열 (gap 100px) → **세로 스택** (gap 48px) |
| `.s-data__bottom` | 2컬럼 그리드 → **단일 컬럼**, 카피 중앙 정렬 |

#### S4 — The Maker
| 요소 | 변경 |
|------|------|
| 섹션 패딩 | `160px 0 140px` → `100px 0 100px` |
| `.s-maker__cards` | 2컬럼 → **단일 컬럼**, gap `60px` → `48px` |

#### S5 — Archive
| 요소 | 변경 |
|------|------|
| 섹션 패딩 | `200px 0 120px` → `120px 0 80px` |
| `.card` flex-basis | `272px` → `240px` |
| 캐러셀 | 유지 (수평 스크롤), 카드 폭 축소 |

#### S6 — Ocean Circle
| 요소 | 변경 |
|------|------|
| 섹션 패딩 | `160px 0` → `100px 0` |
| `.s-circle__inner` | 2컬럼 그리드 → **단일 컬럼**, 중앙 정렬 |
| `.s-circle__visual` | `aspect-ratio: 4/3` → `auto`, 패딩 20px |
| `.s-circle__ring` | `200px` → `160px` |

#### S7 — For Professionals
| 요소 | 변경 |
|------|------|
| 섹션 패딩 | `120px 0 140px` → `80px 0 100px` |

### 4-3. 태블릿 (≤1023px)

| 항목 | 변경 |
|------|------|
| `--grid-margin` | 80px → **40px** |
| 메뉴 오버레이 inner gap | 80px → 40px |
| `.s-maker__cards` gap | 60px → 40px |
| `.s-data__metrics` gap | 100px → 56px |

---

## 5. 접근성 (a11y) 체크리스트

### 5-1. 키보드 내비게이션

- [ ] **Skip Link**: 페이지 최상단에 "본문으로 건너뛰기" 링크. Tab 포커스 시 시각적으로 노출. target: `#main-content` 또는 첫 번째 `<section>`.
- [ ] **메뉴 버튼**: `aria-label="메뉴 열기"` (와이어프레임에 구현됨). `aria-expanded` 상태 토글 필요 (와이어프레임 미구현 — **추가 필요**).
- [ ] **메뉴 오버레이**: `role="dialog"`, `aria-label="내비게이션 메뉴"` (와이어프레임에 구현됨). 열림 시 **포커스 트랩** 필요 (와이어프레임에 미구현 — Tab이 오버레이 밖으로 나가지 않도록).
- [ ] **ESC 키**: 메뉴 닫기 (와이어프레임에 구현됨). 닫힌 후 포커스를 메뉴 버튼으로 복원 (**미구현 — 추가 필요**).
- [ ] **포커스 표시**: 모든 인터랙티브 요소에 `:focus-visible` 스타일. `outline: 2px solid var(--amber)`, `outline-offset: 4px`.
- [ ] **Tab 순서**: 자연스러운 DOM 순서 유지. `tabindex` 사용 최소화.

### 5-2. 스크린 리더 대응

- [ ] **S2 Pressure Descent**: 스크롤 기반 시각 경험이므로, 스크린 리더 사용자를 위해 모든 fact 텍스트를 정적으로 접근 가능하게 유지. `aria-hidden` 사용 금지.
- [ ] **S2 깊이 카운터**: `aria-live="off"` 또는 `aria-hidden="true"` — 시각 장식 요소이므로 스크린 리더에서 계속 읽히지 않도록 처리.
- [ ] **S2 수직 깊이 라인**: `aria-hidden="true"` (장식).
- [ ] **S3 파동 SVG**: `aria-hidden="true"`, `role="presentation"` — 장식용 시각화.
- [ ] **S3 메트릭 수치**: `<dl>` / `<dt>` + `<dd>` 구조 사용 권장. 수치 카운팅 애니메이션의 최종값이 스크린 리더에 즉시 노출되어야 한다.
- [ ] **S5 캐러셀**: 각 카드에 의미 있는 `aria-label`. 점 인디케이터에 `role="tablist"` + `role="tab"` 또는 `aria-current` 적용.
- [ ] **S6 Ocean Circle 링 애니메이션**: `aria-hidden="true"` (장식).
- [ ] **메뉴 오버레이 링크**: 각 링크에 해당 섹션의 한국어 설명 보충. 예: `aria-label="the void — 홈 히어로 섹션으로 이동"`.
- [ ] **언어 속성**: 프랑스어 큐베명에 `lang="fr"`, 영어 섹션명에 `lang="en"`.

### 5-3. prefers-reduced-motion 대응

와이어프레임에 이미 기본 대응이 구현되어 있다:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.15s !important;
  }
  .reveal { opacity: 1; transform: none; }
  .particle { display: none; }
}
```

**추가 필요 항목**:

- [ ] **S2 Pressure Descent**: `prefers-reduced-motion: reduce` 시 스크롤 기반 fact 등장/퇴장, 배경 보간, 타이포그래피 압축을 모두 비활성화. 모든 fact를 정적으로 세로 나열하여 표시.
- [ ] **S3 파동 SVG**: `wave-flow` 애니메이션 비활성화됨 (위 CSS로 커버). 정적 상태의 파동이 의미 있게 보이는지 확인 필요.
- [ ] **S5 캐러셀**: 수평 스크롤은 유지하되, `scroll-snap-type`의 스냅 전환이 즉각적이어야 한다.
- [ ] **S6 링 호흡 애니메이션**: `ring-breathe` 비활성화됨 (위 CSS로 커버). 링이 정적 상태에서도 시각적으로 의미 있는지 확인.
- [ ] **Lenis smooth scroll**: `prefers-reduced-motion: reduce` 시 비활성화하고 브라우저 네이티브 스크롤 사용.
- [ ] **카운팅 애니메이션 (S3 메트릭)**: 즉시 최종값 표시.
- [ ] **히어로 타이틀 등장 (S1)**: `title-in` 애니메이션 비활성화됨. 즉시 표시.

### 5-4. 색 대비

| 배경 | 텍스트 | 예상 대비비 | WCAG AA |
|------|--------|-----------|---------|
| `#ECEAE6` (warm-ivory) | `#312E2A` (earth) | ~10.5:1 | 통과 |
| `#0A0908` (void-bg) | `#F1EFEB` (void-text) | ~18.1:1 | 통과 |
| `#0A0908` | `rgba(204,173,123,0.85)` (~`#B89868`) | ~6.2:1 | 통과 |
| `#0A0908` | `rgba(232,228,223,0.4)` (~`#4B4A48`) | ~2.5:1 | **주의** — 보조 텍스트에만 사용 |
| `#0A0908` | `rgba(232,228,223,0.3)` (~`#3A3938`) | ~1.9:1 | **위험** — 라벨/보조 텍스트만 허용. 핵심 정보에 사용 금지 |
| `#E8E5E1` (sand) | `rgba(49,46,42,0.5)` (~`#989591`) | ~2.7:1 | **주의** |
| S2 전환 중간점 (~`#7B7A77`) | `#1a1815` | ~4.5:1 | 경계선 — fact 텍스트 가독성 보장 로직 필수 |

**위험 항목 대응**:
- `rgba(232,228,223,0.3)` 및 `rgba(49,46,42,0.5)` 계열은 AA 대비 미달 가능. 라벨/캡션/보조 텍스트에만 사용하고, 핵심 정보에는 사용 금지.
- S2 전환 중간점에서 fact 텍스트의 동적 색상 전환 로직이 정확히 작동하는지 반드시 검증.

---

## 6. 마이크로인터랙션 목록

### 6-1. 이징 함수 정의 (Design Tokens)

```css
--ease-gentle: cubic-bezier(0.25, 0.1, 0.25, 1.0);   /* 범용 전환 */
--ease-water:  cubic-bezier(0.23, 1.0, 0.32, 1.0);    /* 유기적, 물속 느낌 — 호버/등장 */
--ease-slow:   cubic-bezier(0.4, 0.0, 0.2, 1.0);      /* 느린 전환 — 오버레이 */
```

### 6-2. 호버 효과

| 요소 | 트리거 | 효과 | duration | easing | 비고 |
|------|--------|------|----------|--------|------|
| **햄버거 메뉴** (`.header__menu`) | hover | 세 줄 span opacity `0.6 → 1` | 0.4s | `--ease-water` | 둘째 줄(60% 너비)도 동일 |
| **메뉴 오버레이 링크** (`.menu-overlay__link`) | hover | opacity `0.75 → 1`, translateX `0 → 12px` | 0.4s | `--ease-water` | 우측으로 밀리는 효과 |
| **메뉴 오버레이 링크 (Pro)** (`.menu-overlay__link--pro`) | hover | opacity `0.35 → 0.6` | 0.4s | `--ease-water` | 메인 링크보다 절제된 반응 |
| **메뉴 오버레이 큐베명** (`.menu-overlay__cuvee`) | hover | color `rgba(…,0.2) → rgba(…,0.5)` | 0.4s | 기본 | |
| **메뉴 오버레이 소셜/언어** | hover | color `rgba(…,0.25) → rgba(…,0.55)` | 0.3s | 기본 | |
| **메뉴 닫기** (`.menu-overlay__close`) | hover | color `rgba(…,0.5) → rgba(…,0.9)` | 0.3s | 기본 | |
| **텍스트 CTA** (`.text-cta`, `.s-circle__cta`, `.s-pro__cta`) | hover | color opacity 증가 + `border-color` 진해짐 | 0.4s | `--ease-water` | 밑줄 스타일 유지 |
| **제품 카드** (`.card`) | hover | `translateY(-6px)` | 0.5s | `--ease-water` | 미세 상승 효과 |
| **섹션 인디케이터 도트** (`.indicator__dot`) | 활성 상태 | `height: 4px → 20px`, `border-radius: 50% → 2px`, `opacity: 0.25 → 0.6` | 0.5s | `--ease-water` | hover 아닌 스크롤 기반 |

### 6-3. 포커스 스타일

```css
/* 모든 인터랙티브 요소 공통 */
:focus-visible {
  outline: 2px solid var(--amber);  /* #CCAD7B */
  outline-offset: 4px;
}

/* 마우스 클릭 시 포커스 링 미표시 */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 6-4. 전환 타이밍 상세

| 전환 | 속성 | duration | easing | delay |
|------|------|----------|--------|-------|
| **메뉴 오버레이 열기** | opacity, visibility | 0.6s | `--ease-slow` | 0 |
| **메뉴 오버레이 닫기** | opacity, visibility | 0.6s | `--ease-slow` | 0 |
| **Reveal 등장** | opacity, transform | 0.9s | `--ease-gentle` | 0~0.6s (delay 클래스) |
| **헤더 패딩** | padding | 0.5s | `--ease-water` | 0 |
| **파동 SVG stroke** | stroke-dashoffset | ∞ (loop) | linear | 0 |
| **파동 라인 1** | stroke-dashoffset 주기 | 10s | linear | 0 |
| **파동 라인 2** | stroke-dashoffset 주기 | 14s (역방향) | linear | 0 |
| **파동 라인 3** | stroke-dashoffset 주기 | 18s | linear | 0 |
| **링 호흡** (`.s-circle__ring`) | scale, opacity | 8s / 12s | ease-in-out | 0 |
| **히어로 타이틀** | opacity, transform | 2.0s | `--ease-gentle` | 0.5s |
| **히어로 서브** | opacity, transform | 1.5s | `--ease-gentle` | 1.2s |
| **스크롤 인디케이터** | opacity, transform | 1.0s | `--ease-gentle` | 2.5s |
| **스크롤 펄스 라인** | top, opacity | 1.8s | ease-in-out | 0 (loop) |
| **파티클 상승** | transform, opacity | 18~25s (각각 다름) | linear | 0~10s (각각 다름) |
| **캐러셀 도트 전환** | width, background | 0.4s | `--ease-water` | 0 |

### 6-5. 와이어프레임에 없지만 구현 시 필요한 인터랙션

1. **S3 메트릭 카운팅 애니메이션**: 와이어프레임에서 정적 텍스트로 표시되어 있지만, `homepage-flow.md`에 명시된 카운팅 효과 구현 필요. `0 → target` (duration: 2.0s, ease-out). IntersectionObserver `is-visible` 트리거 시 시작.

2. **S5 캐러셀 스크롤 동기 도트**: 와이어프레임에 도트가 정적으로 표시되어 있지만, 스크롤 위치에 따라 활성 도트를 전환하는 JS 로직 필요. `scrollLeft / (scrollWidth - clientWidth)` 기반.

3. **헤더 스크롤 축소**: 와이어프레임에 `transition: padding 0.5s` 정의되어 있으나, 축소 트리거 로직 미구현. 권장: `scrollY > 100px` 시 padding `36px → 20px`.

4. **Body scroll lock**: 메뉴 오버레이 열릴 때 `body { overflow: hidden }` 처리 필요. 와이어프레임에 미구현.

5. **S2→Evidence 전환**: Pressure Descent가 끝나고 Evidence 섹션(`.s-obs__evidence`)으로 넘어갈 때, 배경이 이미 `#0A0908`이므로 자연스럽게 연결된다. 별도 전환 효과 불필요.

---

## 부록 — 구현 우선순위 가이드

```
P0 (반드시 정확해야 함):
  - S2 배경색 보간 + fact 텍스트 색상 전환 (가독성)
  - prefers-reduced-motion 전체 대응
  - 메뉴 오버레이 포커스 트랩 + ESC 복원
  - reveal 트리거 threshold/rootMargin 일치

P1 (시각 품질에 직접 영향):
  - S1→S2 배경색 무색 점프 보장
  - 파티클 페이드아웃 타이밍
  - 헤더 색상 전환 (라이트↔다크)
  - 카운팅 애니메이션 (S3)
  - 캐러셀 도트 동기

P2 (폴리싱):
  - 타이포그래피 압축 효과 (S2)
  - 깊이 라인 너비 변화 (S2)
  - 헤더 스크롤 축소
  - 제품 카드 hover translateY
```

---

*03-ux-team — 2026-02-23*
