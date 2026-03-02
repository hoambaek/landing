# Hero → Observation 수면 전환 효과 분석

> **프로젝트**: Muse de Maree 랜딩 페이지
> **주제**: 히어로에서 Observation 섹션으로의 "물속에 잠기는" 전환 효과
> **작성일**: 2026-02-26
> **상태**: 팀 리뷰 대기

---

## 1. 현재 상태 분석

### 현재 구현

**HeroSection** (`src/components/sections/HeroSection.tsx`)
- `s-void` 섹션: `height: 200vh`, `position: sticky` 핀 구조
- 배경: `h1.webp` 풀커버 이미지 + radial/linear gradient 오버레이 (`.s-void__bg::after`)
- 텍스트: 세로쓰기(`writing-mode: vertical-rl`), CSS 애니메이션 → 스크롤 시 JS로 전환
- 패럴랙스: headline `0.4x`, sub `0.2x`, scroll indicator `0.15x`
- 페이드아웃: `progress = scrollY / (heroH * 0.5)` 기준, `opacity = 1 - progress`
- 파티클: CSS `float-up` 애니메이션 7개

**ObservationSection** (`src/components/sections/ObservationSection.tsx`)
- `s-obs` 섹션: `height: 400vh`, `position: sticky` 핀 구조
- 배경색 보간: `#ECEAE6`(밝음) → `#0A0908`(어둠), `progress` 기반
- 텍스트색 보간: `#312E2A` → `#F1EFEB`
- 스크롤 기반: `relScroll = scrollY - section.offsetTop`
- 수심 카운터: 0m → -40m
- Facts: 순차 등장/퇴장 애니메이션

### 핵심 문제: 전환 단절

```
[Hero 200vh]          [Observation 400vh]
  ↓ 텍스트 페이드아웃      ↓ 밝은 배경에서 시작
  ↓ opacity → 0           ↓ lerpColor 시작
  ↓ 파티클만 남음          ↓ 0m 수심 표시
       ↓
   === GAP ===
   빈 화면 → 갑작스러운 전환
```

현재 히어로가 완전히 페이드아웃된 후 Observation이 시작된다. 사이에 시각적 연결고리가 없다. "바다에 빠져드는" 체험 대신, 한 장면이 끝나고 다른 장면이 시작되는 느낌이다.

### 목표 상태

```
[Hero 후반부]
  ↓ 텍스트가 수면 아래로 가라앉는 느낌
  ↓ 수면 왜곡 효과 시작 (ripple, caustic)
  ↓ 배경 톤이 수중 색감으로 전환
       ↓
   === 수면 통과 ===
   물의 경계면을 관객이 통과하는 순간
       ↓
[Observation 시작]
  ↓ 이미 수중에 있는 느낌
  ↓ 자연스럽게 깊이 하강 시작
```

---

## 2. 팀별 분석

### 2.1 — 01-frontend-team: 기술 타당성 분석

#### 접근법 A: 비디오 오버레이 + 디졸브

**구현 방식**
- 수면 아래로 잠기는 실사/CG 영상을 `<video>` 요소로 오버레이
- 스크롤 진행도에 따라 `currentTime` 제어 또는 opacity 디졸브
- Hero 후반(`progress > 0.5`)에서 비디오 opacity 0→1, Observation 초반에서 1→0

**성능 영향**
- 비디오 파일: 최소 2-5MB (1080p, 3-5초, H.264)
- `requestVideoFrameCallback` 또는 스크롤 기반 `currentTime` 조작 필요
- iOS Safari: 자동재생 제약 (`playsinline muted` 필수), 스크롤 기반 시간 제어 불안정
- GPU 디코딩 활용 가능하나, 모바일에서 비디오 + 스크롤 동기화는 프레임 드롭 위험
- LCP 영향: 비디오 프리로드 시 2.0s 목표 위협. `poster` + lazy load 필수

**브라우저 호환성**
- Chrome/Edge: 안정적, `requestVideoFrameCallback` 지원
- Safari/iOS: 스크롤 연동 `currentTime` 제어 시 끊김 발생 빈도 높음
- Firefox: `requestVideoFrameCallback` 미지원 (polyfill 필요)

**코드 영향**
- `HeroSection.tsx` 또는 새 전환 컴포넌트에 `<video>` 추가
- 기존 `s-void__bg` 위에 레이어링
- JS 번들 영향: 최소 (~2KB 제어 로직)

#### 접근법 B: WebGL 수면 셰이더 (Three.js / R3F)

**구현 방식**
- `@react-three/fiber` Canvas를 전환 영역에 배치
- 커스텀 GLSL 셰이더: Fresnel 반사, caustic 패턴, 굴절 왜곡
- 스크롤 진행도를 uniform으로 전달하여 수면 통과 시뮬레이션
- 히어로 텍스트를 셰이더 뒤로 보내거나, postprocessing으로 왜곡

**성능 영향**
- Three.js 번들: ~150KB gzipped (이미 설치됨, 하지만 현재 미사용)
- 셰이더 실행: GPU 부하. 모바일에서 fragment shader 복잡도 제한 필요
- **First Load JS 90KB 목표 위반 확실** — Three.js만으로 초과
- 동적 import + `Suspense`로 초기 로드에서 제외 가능하나, 상호작용 시점에 로딩 지연
- 전체 페이지에서 Three.js를 다른 섹션에도 사용 예정이라면 비용 분산 가능

**브라우저 호환성**
- WebGL 2.0: 모던 브라우저 전부 지원
- 저사양 모바일: GPU 과열, 프레임 드롭 위험
- `failIfMajorPerformanceCaveat` 체크 필요

**코드 영향**
- 새 컴포넌트: `WaterSurfaceTransition.tsx` + GLSL 셰이더 파일
- R3F Canvas 라이프사이클 관리 (언마운트 시 WebGL context 정리)
- 기존 vanilla JS 스크롤 리스너와 R3F 렌더 루프 간 동기화 필요

#### 접근법 C: CSS/Canvas 레이어드 이펙트

**구현 방식**
- CSS: `backdrop-filter: blur()` 점진적 증가 + 청색 오버레이 opacity 전환
- Canvas 2D: caustic 패턴 (사인파 합성), 물결 왜곡 (`ctx.drawImage` + displacement)
- SVG filter: `feTurbulence` + `feDisplacementMap`으로 물결 효과
- 스크롤 연동: 기존 `window.addEventListener('scroll')` 패턴 활용

**성능 영향**
- CSS `backdrop-filter`: Safari에서 높은 GPU 비용, 특히 큰 영역에 적용 시
- Canvas 2D caustic: CPU 기반, 해상도에 비례하는 비용. 저해상도 캔버스 + CSS scale 전략
- SVG filter: 정적이면 효율적, 애니메이션 시 재계산 비용
- JS 번들: ~3-5KB (canvas 유틸리티)
- **LCP/JS 예산 준수 가능**

**브라우저 호환성**
- `backdrop-filter`: Safari 9+, Chrome 76+, Firefox 103+
- Canvas 2D: 전 브라우저 지원
- SVG filter 애니메이션: 성능 편차 큼

**코드 영향**
- 기존 HeroSection의 `onScroll` 함수 확장 또는 별도 전환 컴포넌트
- `.s-void__pin` 내부에 새 오버레이 레이어 추가
- 기존 CSS 클래스 구조(`s-void__*`, `s-obs__*`)에 자연스럽게 통합 가능

#### 접근법 D: 하이브리드 (CSS 베이스 + 경량 Canvas ripple)

**구현 방식**
- **Layer 1** — CSS 색상 전환: 기존 `s-void__bg` 위에 `.s-void__water-overlay`
  - `background: radial-gradient(...)` 청색/틸계열, opacity 0→0.6
  - `backdrop-filter: blur(0px)` → `blur(4px)` 점진 적용
- **Layer 2** — Canvas 2D caustic: 저해상도(화면의 1/4) 캔버스
  - 3-4개 사인파 합성으로 caustic light 패턴
  - `mix-blend-mode: soft-light`, opacity 스크롤 연동
- **Layer 3** — CSS vignette: `box-shadow: inset ...` 또는 gradient overlay
  - 수면 아래로 갈수록 가장자리 어두워짐
- 스크롤 연동: 기존 HeroSection의 `onScroll` 확장

**성능 영향**
- Canvas: 저해상도 렌더 + CSS `image-rendering: auto` scale → CPU 부하 최소
- CSS 레이어: GPU 합성, 리플로우 없음
- JS 번들: ~4-6KB (caustic 생성기 + 스크롤 로직)
- **LCP 2.0s, JS 90KB 예산 모두 준수 가능**
- `will-change: opacity, filter` 힌트로 GPU 레이어 분리

**브라우저 호환성**
- 모든 모던 브라우저 지원
- `backdrop-filter` 미지원 시: 단순 opacity overlay로 graceful degradation
- 저사양 기기: Canvas 레이어만 비활성화, CSS 전환만으로도 효과 유지

**코드 영향**
- 기존 패턴 완벽 호환: vanilla JS scroll + CSS 클래스 구조
- Framer Motion, GSAP 불필요 (설치는 되어 있으나 hero/observation 미사용)
- 기존 `s-void__pin` 내부에 레이어 추가, `onScroll` 함수 확장

---

### 2.2 — 02-design-team: 비주얼 디렉션

#### 수면 통과의 시각적 단계

```
[Phase 1: 수면 접근]  Hero progress 0.4–0.6
├── 수면의 빛 반사(caustic) 미세하게 등장
├── 배경에 아주 연한 청록빛 틴트 시작
├── 히어로 텍스트가 여전히 선명
└── 파티클이 약간 느려지며 부유감 증가

[Phase 2: 수면 통과]  Hero progress 0.6–0.8
├── caustic 패턴 강도 증가
├── 화면 가장자리에 수중 비네트 등장
├── 텍스트에 미세한 굴절 왜곡 (blur 0→2px)
├── 배경 색조: warm ivory → cool blue-green 전환 시작
└── 밝기 점진 하강

[Phase 3: 수중 진입]  Hero progress 0.8–1.0 → Obs progress 0–0.1
├── 전체 화면이 수중 색감 (#0E2A3A 계열)
├── caustic이 천장(수면)에서 내려오는 빛으로 변환
├── 텍스트 완전 페이드, 수심 카운터 등장 준비
├── blur 가 다시 걷히며 시야 확보 (수중 적응)
└── Observation의 lerpColor와 자연스럽게 이어짐
```

#### 색상 진행 (Color Progression)

| 단계 | 배경 | 오버레이 | 텍스트 |
|------|------|----------|--------|
| 수면 위 | `#ECEAE6` (warm ivory) | 없음 | `#312E2A` |
| 수면 접근 | `#ECEAE6` | `rgba(14,42,58, 0.05)` | `#312E2A` |
| 수면 통과 | — | `rgba(14,42,58, 0.25)` | `rgba(49,46,42, 0.5)` |
| 수중 진입 | — | `rgba(14,42,58, 0.55)` | 페이드아웃 |
| Obs 시작 | `#ECEAE6` → Obs lerpColor 시작 | 오버레이 페이드아웃 | Obs 자체 제어 |

핵심 색상 값:
- 수중 틴트: `#0E2A3A` (deep ocean teal) — 브랜드의 해양 정체성과 정렬
- caustic 빛: `rgba(204, 173, 123, 0.08)` — 기존 파티클 색상(`rgba(204,173,123,0.2)`)과 통일
- 비네트: `rgba(10, 9, 8, 0.4)` — Observation 최종 배경(`#0A0908`)과 연결

#### 레퍼런스

- **Krug.com**: 섹션 전환에 부드러운 색상 보간 사용, 급격한 전환 없음. 이 프로젝트의 전환도 동일한 품격을 유지해야 함
- **Apple Vision Pro 소개 페이지**: 스크롤 기반 환경 변화의 모범. 은근하되 몰입적
- **Kinfolk.com**: 에디토리얼 미니멀리즘의 여백 활용. 전환 효과도 여백처럼 "비어있되 존재하는" 느낌

#### 디자인 원칙

1. **빼기의 미학**: 효과가 눈에 띄면 실패. 관객이 "어느새 물속에 있다"고 느끼는 것이 성공
2. **색온도 전환**: warm(히어로) → cool(수중) → neutral(Observation 초반). 급격한 색상 점프 금지
3. **빛의 방향성**: 수면 위에서는 빛이 아래로, 수면 아래에서는 빛이 위에서 내려옴 — caustic 패턴의 방향 전환

---

### 2.3 — 03-ux-team: 스크롤 타이밍과 사용자 인지

#### 전환 길이 분석

현재 히어로 구조:
- `s-void` 높이: `200vh`
- sticky pin 내부에서 `progress = scrollY / (heroH * 0.5)` → 실질적 페이드아웃 구간: `100vh`

**제안: 전환 구간 = 약 80-100vh (히어로 후반 절반)**

| 구간 | 스크롤 범위 | 사용자 체감 시간 (일반 스크롤 속도) |
|------|-------------|--------------------------------------|
| 수면 접근 | Hero 40-60% | ~1.5초 |
| 수면 통과 | Hero 60-80% | ~1.5초 |
| 수중 진입 | Hero 80-100% | ~1.0초 |
| **전체 전환** | **~80vh** | **~3-4초** |

3-4초는 럭셔리 브랜드의 여유로운 페이싱에 적합하다. 너무 짧으면(2초 미만) 효과를 인지하기 전에 지나가고, 너무 길면(6초 이상) 인내심을 시험한다.

#### 모션 시크니스 고려사항

| 위험 요소 | 현재 수준 | 수면 효과 추가 시 | 완화 방안 |
|-----------|-----------|-------------------|-----------|
| 패럴랙스 차이 | headline 0.4x, sub 0.2x → 속도 차이 존재 | 동일 유지 | 차이를 0.2x 이하로 유지 |
| 색상 급변 | 없음 (현재 단절) | 점진 전환 도입 → 개선됨 | 보간 구간 충분히 확보 |
| 왜곡 효과 | 없음 | blur/ripple 추가 | `blur` 최대 4px 제한, ripple 진폭 2-3px |
| 스크롤 하이재킹 | 없음 (현재 네이티브 스크롤) | 변동 없음 | Lenis 적용 시에도 속도 조절 금지 |

**`prefers-reduced-motion` 대응 필수**:
```css
@media (prefers-reduced-motion: reduce) {
  .s-void__water-overlay {
    /* caustic, ripple 비활성화. 색상 전환만 유지 */
    animation: none;
    backdrop-filter: none;
  }
}
```

#### 스크롤 방향 되돌림

사용자가 위로 스크롤할 때 효과가 정확히 역재생되어야 한다. 현재 히어로의 `onScroll`은 `scrollY` 기반이므로 양방향 모두 자연스럽게 동작한다. 새 전환 효과도 동일한 `progress` 변수 기반으로 구현하면 역방향 호환성 자동 확보.

#### 인지 프레이밍

전환 전에 사용자에게 "물속으로 들어간다"는 기대를 설정하는 장치가 필요할 수 있다:
- 스크롤 인디케이터의 "scroll" 텍스트 옆에 미세한 물결 아이콘 — 과도하면 생략
- 히어로 하단에 수면 반사광 같은 수평선 힌트 (1px, `rgba(204,173,123,0.1)`)
- 또는 아무 장치 없이, 효과 자체가 직관적이면 프레이밍 불필요 (추천)

---

### 2.4 — 06-creative-video-team: 비디오 사양 (접근법 A 채택 시)

#### 영상 스펙

| 항목 | 사양 |
|------|------|
| 해상도 | 1920x1080 (데스크톱), 1080x1920 (모바일 별도) |
| 길이 | 3-5초 (60fps 기준 180-300 프레임) |
| 코덱 | H.264 High Profile (범용), VP9/AV1 (최적화) |
| 컨테이너 | MP4 (H.264), WebM (VP9) |
| 비트레이트 | 2-4 Mbps (품질/용량 밸런스) |
| 파일 크기 목표 | < 3MB (데스크톱), < 1.5MB (모바일) |
| 색공간 | sRGB, 10bit 권장 |
| 알파채널 | WebM VP9 알파 (반투명 오버레이용) |

#### 영상 내용 디렉션

- **시점**: 1인칭. 카메라가 수면 위에서 수면 아래로 천천히 잠기는 시점
- **수면 표현**: 잔잔한 물결, 과도한 파도 없음. 호수 같은 고요함
- **빛**: 수면 위에서 들어오는 자연광, caustic 패턴이 화면 전체에 퍼짐
- **색감**: 첫 프레임 warm ivory → 마지막 프레임 deep teal, 현재 사이트 팔레트와 정합
- **루프**: 불필요. 스크롤 기반 단방향 재생. 역방향 스크롤 시 역재생 필요

#### 제작 방식 옵션

1. **실사 촬영**: 수중 촬영 장비 필요. 최고 퀄리티이나 비용 높음
2. **CG 렌더링**: Houdini/Blender FLIP 시뮬레이션. 제어 용이, 비용 중간
3. **AI 생성**: Runway Gen-3, Sora 등. 빠르나 품질 편차 큼. 럭셔리 브랜드 기준 미달 가능성

#### 기술적 주의사항

- 스크롤 연동 재생 시 `video.currentTime` 직접 설정은 iOS Safari에서 불안정
- 대안: 프레임을 이미지 시퀀스로 추출 → Canvas에 그리기. 파일 크기 증가하나 호환성 확보
- 이미지 시퀀스 시: 30fps * 4초 = 120장. WebP 압축 기준 장당 ~15KB = ~1.8MB 총량

---

## 3. 접근법 비교 매트릭스

| 기준 | A: 비디오 오버레이 | B: WebGL 셰이더 | C: CSS/Canvas 레이어 | D: 하이브리드 (CSS + Canvas) |
|------|:-:|:-:|:-:|:-:|
| **시각적 완성도** | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| **성능 비용** | ★★★☆☆ | ★★☆☆☆ | ★★★★★ | ★★★★☆ |
| **JS 예산 준수 (90KB)** | ✅ 준수 | ❌ 위반 (~150KB+) | ✅ 준수 | ✅ 준수 |
| **LCP 2.0s 준수** | ⚠️ 위험 | ⚠️ 위험 | ✅ 준수 | ✅ 준수 |
| **구현 복잡도** | 중간 | 높음 | 낮음 | 중간 |
| **구현 기간 (추정)** | 5-7일 | 10-14일 | 2-3일 | 4-5일 |
| **모바일 호환성** | ⚠️ iOS 제약 | ⚠️ 저사양 위험 | ✅ 안정 | ✅ 안정 |
| **브라우저 호환성** | ⚠️ Firefox rvfc | ✅ WebGL2 전부 | ✅ 전부 | ✅ 전부 |
| **기존 코드 정합성** | 중간 | 낮음 (패러다임 전환) | 높음 | 높음 |
| **유지보수 비용** | 중간 (에셋 관리) | 높음 (셰이더 전문성) | 낮음 | 낮음 |
| **Graceful degradation** | 양호 (poster 폴백) | 어려움 | 용이 | 용이 |
| **브랜드 격 정합** | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★☆ |

### 범례
- ★: 1점(낮음)~5점(높음)
- ✅: 충족 / ⚠️: 조건부 / ❌: 미충족

---

## 4. 추천안

### 1순위: 접근법 D — 하이브리드 (CSS 베이스 + 경량 Canvas caustic)

**선정 근거**

1. **성능 예산 준수**: JS 90KB, LCP 2.0s 모두 충족. 추가 JS ~4-6KB
2. **기존 코드 패턴 완벽 호환**: 현재 HeroSection/ObservationSection의 vanilla JS scroll + CSS 구조를 그대로 활용. Framer Motion이나 GSAP 도입 불필요
3. **점진적 강화 가능**: CSS만으로도 기본 전환 동작. Canvas 레이어는 부가 효과. 저사양 기기에서 Canvas만 끄면 됨
4. **유지보수 용이**: 셰이더 전문성 불필요. CSS + Canvas 2D는 프론트엔드 누구나 수정 가능
5. **브랜드 톤 적합**: 은근하고 절제된 효과. "물속에 들어왔다"는 느낌을 색온도와 미세한 빛 패턴으로 전달. 과시적이지 않음

**시각적 완성도 보완 전략**:
- D 접근법의 ★4를 ★4.5로 올리는 방법: caustic 패턴의 디테일과 색상 전환 커브를 정교하게 튜닝
- 빛의 방향성과 강도 변화만으로도 "수면 통과"를 인지시킬 수 있음

### 2순위: 접근법 A — 비디오 (향후 업그레이드)

런칭 후 성능 모니터링 데이터를 바탕으로, 비디오 에셋이 확보되면 D에서 A로 교체 가능한 구조로 설계한다. 오버레이 레이어를 컴포넌트로 분리해두면 교체 비용 최소화.

### 비추천

- **접근법 B** (WebGL): Three.js가 설치되어 있으나, 이 전환 하나를 위해 ~150KB 번들을 로드하는 것은 과도. 다른 섹션(Data Archive 등)에서 Three.js를 본격 사용하게 될 때 재검토
- **접근법 C** (CSS-only): 기술적으로 가장 가볍지만, caustic 없이는 "물"의 느낌 부족. 럭셔리 브랜드가 요구하는 감각적 밀도에 미달

---

## 5. 구현 플랜

### Phase 0: 준비 (0.5일)

- [ ] `HeroSection.tsx`의 스크롤 핸들러 구조 분석 및 전환 진입점 확정
- [ ] Observation의 `LIGHT_BG` 시작점과 히어로 종료점의 색상 연결 설계
- [ ] `prefers-reduced-motion` 대응 전략 확정

### Phase 1: CSS 오버레이 레이어 (1일)

**목표**: 스크롤 기반 색온도 전환만으로 "수중 진입" 기본 효과 확보

**구현 내용**:

1. `.s-void__pin` 내부에 새 오버레이 레이어 추가:

```css
.s-void__water-overlay {
  position: absolute;
  inset: 0;
  z-index: 1; /* s-void__bg(0) 위, s-void__content(2) 아래 */
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    ellipse 120% 80% at 50% 30%,
    rgba(14, 42, 58, 0.4),
    rgba(14, 42, 58, 0.7) 60%,
    rgba(10, 9, 8, 0.8) 100%
  );
  will-change: opacity;
  transition: none; /* JS로 직접 제어 */
}

.s-void__water-vignette {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  box-shadow: inset 0 0 120px 40px rgba(10, 9, 8, 0);
  will-change: box-shadow;
}
```

2. `HeroSection.tsx`의 `onScroll` 확장:

```typescript
// 기존 progress 계산 이후 추가
const waterStart = 0.4;  // 수면 효과 시작
const waterEnd = 1.0;    // 히어로 종료

if (progress > waterStart) {
  const waterProgress = (progress - waterStart) / (waterEnd - waterStart);

  // 수중 오버레이 opacity
  if (waterOverlayRef.current) {
    waterOverlayRef.current.style.opacity = String(waterProgress * 0.6);
  }

  // 비네트 강도
  if (vignetteRef.current) {
    const spread = waterProgress * 60;
    vignetteRef.current.style.boxShadow =
      `inset 0 0 ${80 + spread}px ${20 + spread}px rgba(10,9,8,${waterProgress * 0.3})`;
  }

  // 텍스트 blur (수면 통과 느낌)
  if (headlineRef.current) {
    const blur = waterProgress * 3; // 최대 3px
    headlineRef.current.style.filter = `blur(${blur}px)`;
  }
  if (subRef.current) {
    const blur = waterProgress * 2;
    subRef.current.style.filter = `blur(${blur}px)`;
  }
}
```

3. **검증**: 스크롤 시 warm → cool 색온도 전환 확인. 역방향 스크롤 시 원복 확인.

### Phase 2: Canvas caustic 레이어 (1.5일)

**목표**: 수면 아래 빛 패턴(caustic)으로 "물" 느낌 추가

**구현 내용**:

1. 새 유틸리티: `src/lib/caustic.ts`

```typescript
/**
 * 저해상도 Canvas에 caustic 빛 패턴을 렌더링.
 * 3-4개 사인파 합성으로 자연스러운 빛 무늬 생성.
 */
export function renderCaustic(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  intensity: number // 0-1
) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 3개 사인파 합성
      const v1 = Math.sin(x * 0.03 + time * 0.8) * Math.cos(y * 0.04 + time * 0.6);
      const v2 = Math.sin((x + y) * 0.02 + time * 1.1);
      const v3 = Math.cos(x * 0.05 - y * 0.03 + time * 0.7);

      const combined = (v1 + v2 + v3) / 3;
      const brightness = Math.max(0, combined) * intensity * 40;

      const idx = (y * width + x) * 4;
      data[idx] = 204 * (brightness / 255);     // R (gold tint)
      data[idx + 1] = 173 * (brightness / 255); // G
      data[idx + 2] = 123 * (brightness / 255); // B
      data[idx + 3] = brightness;                // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
```

2. `HeroSection.tsx`에 Canvas 레이어 추가:
- 캔버스 해상도: `window.innerWidth / 4` x `window.innerHeight / 4` (성능 최적화)
- CSS: `width: 100%; height: 100%; image-rendering: auto;` (브라우저가 bilinear 보간)
- `mix-blend-mode: soft-light`
- `requestAnimationFrame` 루프, `intensity`는 스크롤 progress에 연동
- 히어로가 뷰포트를 벗어나면 `cancelAnimationFrame`으로 루프 중단

3. **검증**: caustic 패턴이 자연스러운 수중 빛 느낌을 주는지. 모바일에서 프레임 드롭 없는지.

### Phase 3: Observation 연결부 정합 (1일)

**목표**: 히어로의 수중 오버레이와 Observation의 `lerpColor` 시작점을 매끄럽게 연결

**구현 내용**:

1. Observation의 `LIGHT_BG` 색상이 히어로 종료 시점의 오버레이 합산 색상과 일치하도록 조정
2. 히어로 수중 오버레이의 최종 opacity와 Observation 배경색 시작값 간 차이가 눈에 띄지 않도록 보정
3. Observation `progress 0–0.05` 구간에서 caustic 패턴이 서서히 사라지도록 처리 (선택)
4. 수심 카운터 `0m` 표시가 수중 진입과 타이밍 일치하는지 확인

**핵심 연결 포인트**:
```
Hero 종료 시:
  - water overlay opacity: ~0.6
  - 합산 배경색: #ECEAE6 + rgba(14,42,58,0.6) ≈ 어두운 teal

Observation 시작 시:
  - lerpColor(#ECEAE6, #0A0908, 0) = #ECEAE6

→ 이 간극을 해소해야 함.
```

해결 방안:
- Observation 시작 시 히어로 오버레이가 아직 보이는 구간을 만들거나
- Observation의 `LIGHT_BG`를 히어로 종료 시 합산색과 맞추거나
- 히어로와 Observation 사이에 전환 전용 wrapper를 배치하여 양쪽 fade를 크로스

### Phase 4: 모바일 최적화 + 접근성 (0.5일)

- [ ] `prefers-reduced-motion`: caustic 비활성, 색상 전환만 유지
- [ ] 저사양 기기 감지: `navigator.hardwareConcurrency <= 4` 시 Canvas 비활성
- [ ] 모바일 뷰포트: caustic 캔버스 해상도 추가 축소 (1/6)
- [ ] 터치 스크롤 관성과의 호환성 테스트

### Phase 5: 튜닝 + QA (1일)

- [ ] easing 커브 미세 조정: 색상 전환의 진행도에 `easeInOutCubic` 적용 검토
- [ ] caustic 파라미터 튜닝: 파장, 속도, 밝기
- [ ] 다양한 스크롤 속도에서 자연스러움 확인
- [ ] 역방향 스크롤 테스트
- [ ] Chrome, Safari, Firefox, iOS Safari, Samsung Internet 테스트
- [ ] Lighthouse 성능 측정: LCP, CLS, FID 변동 확인

### 전체 일정 요약

| Phase | 내용 | 기간 |
|-------|------|------|
| 0 | 준비 및 설계 | 0.5일 |
| 1 | CSS 오버레이 레이어 | 1일 |
| 2 | Canvas caustic | 1.5일 |
| 3 | Observation 연결 정합 | 1일 |
| 4 | 모바일/접근성 | 0.5일 |
| 5 | 튜닝/QA | 1일 |
| **합계** | | **5.5일** |

### 리스크 및 완화

| 리스크 | 확률 | 영향 | 완화 |
|--------|------|------|------|
| caustic CPU 부하가 예상 초과 | 중 | 모바일 프레임 드롭 | 캔버스 해상도 추가 축소, 또는 정적 이미지 패턴으로 대체 |
| 히어로-Observation 색상 연결 부자연스러움 | 높 | 시각적 단절감 유지 | Phase 3에서 집중 조정. 최악 시 전환 wrapper 도입 |
| `backdrop-filter` 성능 이슈 (Safari) | 중 | 스크롤 버벅임 | `backdrop-filter` 대신 불투명 오버레이 레이어로 대체 |
| 브랜딩팀 비주얼 리젝 | 중 | 재작업 | Phase 1 완료 후 조기 리뷰 요청 |

---

## 부록: 향후 업그레이드 경로

### D → A 전환 (비디오 업그레이드)

Phase 1에서 생성하는 `.s-void__water-overlay`를 별도 컴포넌트(`WaterTransition.tsx`)로 분리하면, 향후 비디오 에셋 확보 시 내부 구현만 교체 가능:

```
<WaterTransition progress={waterProgress}>
  {/* 현재: CSS overlay + Canvas caustic */}
  {/* 향후: <video> 스크롤 연동 */}
</WaterTransition>
```

### Three.js 통합 시점

Data Archive 섹션 등에서 Three.js를 본격 사용하게 되면, 전환 효과도 WebGL 셰이더로 업그레이드하여 시각적 일관성을 높일 수 있다. 이때 Three.js 번들 비용은 다른 섹션과 공유되므로 추가 부담 없음.
