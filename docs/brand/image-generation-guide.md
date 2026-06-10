# 이미지 생성 가이드 — 컬러 그레이딩 & 프롬프트

> **버전:** 1.0 · 2026-06-10
> **목적:** 브랜드 비주얼 에셋 생성 시 톤 일관성 유지. 모든 신규 생성/보정 이미지에 적용.
> **근거:** `docs/plans/2026-06-10-homepage-structure.md` §2 전역 비주얼 규칙 + 2026-06-10 히어로/S2 그레이딩 확정값

---

## 1. 그레이딩 원칙

**"웜톤은 하이라이트에만, 섀도우는 차갑고 깨끗하게."**

기존 문제: sepia/vintage 키워드가 화면 전체에 퍼지면 섀도우까지 브라운이 섞여
이미지가 탁해진다. 쨍함(선명함)은 채도가 아니라 **명암의 명료함 + 색온도 대비**에서 온다.

- 블랙은 진짜 블랙(#0A0908급)까지 떨어질 것 — 다크 브라운에서 멈추지 않기
- 섀도우: 중성~한색 (수중 컷은 미세한 청록 허용 — 기획서 §2.5)
- 하이라이트(빛 기둥·수면 반사·노을)에만 웜 세피아
- 채도 −15% 내외, 대비 +8~9%
- 필름 그레인 유지 (선명한 디지털 화질 금지 — 기획서 원칙)

## 2. 공용 그레이딩 블록 (모든 컷 공통)

장면 프롬프트 뒤에 그대로 붙인다:

```
COLOR GRADE: Near-monochrome cinematic film grade. Deep solid blacks
(true black shadows, no brown cast in dark areas), neutral-to-cool
shadow tones, desaturated overall (saturation -15%), slightly lifted
contrast with crisp highlights. Warm sepia tone reserved ONLY for
highlights and light sources — shadows stay cold and clean.
Split-toned: warm highlights / cool neutral shadows.
Heavy 35mm film grain, soft halation on light sources.
Luxury champagne brand campaign, shot on medium format film.
No text, no watermark.
```

### 짧은 버전 (키워드)

```
deep solid blacks, no brown cast in shadows, cool neutral shadows with
warm highlights only, split-toned, desaturated, crisp contrast, heavy film grain
```

## 3. 장면별 추가 블록

### 수면 컷 (히어로 계열)

```
Sea surface scene: warm dusk light reflecting on upper water surface,
the reflections carry the only warmth in the frame; deep water below
falls into cold neutral darkness.
```

### 수중 컷 (S2 · 인양 계열)

```
Underwater scene: a subtle cold teal tint in the deep shadows
(barely perceptible, not blue), warm pale light only in the descending
light shaft from the surface; everything outside the beam is cold
near-black. The temperature contrast between warm beam and cold
depth defines the image.
```

> 청록 틴트는 **수중 컷에만** 허용 (기획서 §2.5). 수면·지상 컷은 중성 섀도우까지만.

## 4. CSS / LUT 기준값 (기존 이미지 후보정용)

Paper 목업에서 확정한 근사값. 이미지 재보정·LUT 제작 시 기준:

| 항목 | 수면 컷 (히어로) | 수중 컷 (S2) |
|---|---|---|
| contrast | +8% | +9% |
| saturate | −14% | −16% |
| 섀도우 틴트 | `#13202A` | `#0C1E26` |
| 블렌드 | color · 20% | color · 26% |
| 마스크 | 상단(반사 영역) 페이드 보호 | 빛 기둥 보호, 하단 55%부터 풀 적용 |

CSS 근사 구현:

```css
/* 이미지 */
filter: contrast(1.08) saturate(0.86); /* 수중: 1.09 / 0.84 */

/* 오버레이 레이어 */
background: #13202A;            /* 수중: #0C1E26 */
mix-blend-mode: color;
opacity: 0.2;                   /* 수중: 0.26 */
mask-image: linear-gradient(to top, black 48%, rgba(0,0,0,.3) 78%, transparent 100%);
```

> 최종 구현에서는 CSS 오버레이보다 **이미지 자체를 이 기준으로 재보정**하는 것을 권장
> (성능 + 색 정확도). CSS 값은 시안 검증용.

## 5. 구도 가이드 (비율별)

- **데스크톱(가로)**: 구조물은 한쪽(주로 우측), 반대편은 빈 수면/어둠 = 카피 영역
- **모바일(세로 9:16)**: 로프·빛 기둥의 수직선이 화면을 관통, 구조물은 하단 1/3,
  상단은 카피용 여백. `vertical 9:16 portrait composition` 명시
- 케이지 기하는 실물 일치 유지: 2×2 격자 · 4코너 수직 로프 (기획서 S1 가드레일)
- 해상도 2560×1440 이상, 워터마크 없는 채널

## 6. 기존 적용 현황 (2026-06-10)

| 에셋 | 적용 |
|---|---|
| h3.webp / h3_m.webp (히어로) | CSS 오버레이로 적용 (Paper 목업) — 원본 재보정 대기 |
| o3_m_v2.webp (S2 모바일) | CSS 오버레이로 적용 — 원본 재보정 대기 |
| o3.webp (S2 데스크톱) | 미적용 — 동일 기준 적용 필요 |
| rec01~04.jpg (S3 인양 시퀀스) | 미적용 — 재생성 시 §2+§3 블록 사용 |
