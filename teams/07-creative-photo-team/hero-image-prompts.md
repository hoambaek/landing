# S1 히어로 섹션 — AI 이미지 생성 프롬프트

**버전**: 2.0
**작성**: 크리에이티브 사진팀 (07)
**기준일**: 2026-02-23
**컨셉**: "심해에서 건져 올린 시간의 결"

---

## 핵심 방향

시간과 자연이 빚어낸 텍스처의 향연. 해저 숙성된 샴페인 코르크의 매크로 클로즈업.
장인 정신의 묵직한 진정성을 따뜻한 앰버-크림 톤으로 표현한다.

---

## 프롬프트 — 메인 히어로 이미지

### 영문 프롬프트 (AI 생성용)

```
Extreme macro close-up photograph of a sea-aged champagne cork, shot on medium format film.

SUBJECT: Used champagne cork with deep, irregular pore structure showing signs of prolonged underwater aging. The cork surface reveals micro salt crystals, faint traces of barnacle residue, and discolored pigmentation from marine sediment. A barely visible brand logo or vintage year is subtly scorched into the cork's side, adding artisanal authenticity. The cork shows compression marks from the bottle neck — evidence of time and pressure. Not a new cork. This cork has lived.

ANGLE & COMPOSITION: Low angle macro (1:1 magnification or greater), cork positioned slightly off-center using golden ratio. The cork fills 60-70% of the frame, creating a monumental, almost geological impression — as if viewing an ancient mountain range up close.

LIGHTING: Single directional raking light from upper-right at 45 degrees. Warm color temperature (late golden hour / candlelight warmth). The light grazes across the cork surface, carving deep shadows into every pore and crevice. Lit areas glow in warm amber; shadow areas fall into deep cream and brown tones. Soft yet directional quality — cozy and luxurious atmosphere.

BACKGROUND (heavy bokeh): Razor-sharp focus on cork pore texture, background dissolved into extremely soft, creamy bokeh.
- Bottom layer: chalky white limestone / chalk soil texture suggesting champagne terroir
- Mid layer: silhouette of an aged champagne bottle shoulder catching light highlights as circular bokeh. Bottle surface shows faint sediment and underwater patina.
- Near cork: a corroded, rust-patinated muselet (wire cage) resting nearby, blurred, suggesting the moment of opening.
- Scattered light: champagne glass stem catching light as warm golden bokeh highlights.

TONE & TEXTURE: Rich analog film grain throughout. Warm amber, gold, cream, deep brown palette — matching aged champagne color. No cool blue tones. No teal. No cyan. No oversaturation. The grain adds analog authenticity and a sense of time passing. Overall mood: deep, mysterious, genuine, artisanal.

COLOR PALETTE: Warm ivory (#F5F1E8), amber gold (#CCAD7B), deep cork brown (#6B5B4E), chalk white (#E8E5E1), shadow brown (#3A3228).

STYLE REFERENCE: Hasselblad medium format film photography, 80mm lens at f/2.0. Think Irving Penn's still life work meets National Geographic macro photography. Editorial luxury, not commercial product photography. Not an advertisement.

ASPECT RATIO: 16:9 (hero banner) and 3:2 (alternative crop)
RESOLUTION: 8K minimum for extreme detail in pore structure
```

### 한국어 프롬프트 요약

```
해저 숙성된 샴페인 코르크의 극적 매크로 클로즈업. 중형 필름 카메라 촬영.

피사체: 오랜 해저 숙성 흔적이 남은 사용된 코르크. 미세 소금 결정, 따개비 흔적,
해양 침전물 색소 침착. 측면에 희미하게 그슬린 브랜드 로고. 병목 압착 흔적.

앵글: 로우앵글 매크로(1:1), 황금비율 오프센터 배치. 코르크가 프레임 60-70% 차지.
마치 거대한 바위 산맥을 보는 듯한 웅장함.

조명: 우측 상단 45도 단일 레이킹 라이트. 따뜻한 색온도(저녁 노을/촛불).
기공마다 깊은 그림자. 앰버색 하이라이트 / 크림-갈색 섀도우.

배경(강한 아웃포커스):
- 바닥: 석회암/백악질 토양 질감 → 테루아 암시
- 중경: 오래된 샴페인 병 어깨 실루엣, 해저 침전물 흔적, 원형 보케
- 전경: 녹슨 뮤즐렛이 코르크 근처에 흐릿하게 배치
- 빛점: 샴페인 잔 스템의 골든 보케 하이라이트

톤: 필름 그레인 전체 적용. 앰버/금색/크림/갈색 팔레트. 차가운 톤 배제.
분위기: 깊고, 신비로우며, 진정성 있는 장인의 세계.
```

---

## 웹 통합 가이드

### 히어로 섹션과의 조화

| 항목 | 지시 |
|------|------|
| **배경 통합** | 현재 warm-ivory(#F5F1E8) 배경 위에 이미지 오버레이. `mix-blend-mode: multiply` 또는 `opacity: 0.85`로 텍스트와 조화 |
| **텍스트 가독성** | 이미지 중앙부에 밝은 영역 확보 — 코르크를 좌측/우하단에 배치하여 "깊이의 증거" 텍스트 공간 보장 |
| **CSS 파티클 연결** | 기존 7개 골드 파티클이 보케 하이라이트와 시각적으로 연결되도록 파티클 색상을 이미지의 골든 보케와 일치 |
| **스크롤 패럴럭스** | 이미지가 스크롤 시 미세하게 상승(translateY)하며 자연스럽게 퇴장 |
| **해상도** | 데스크톱: 2560px 이상 / 모바일: 1080px 이상 |
| **포맷** | WebP (품질 85%) + AVIF 대체 |

### 이미지 크롭 가이드

```
데스크톱 (16:9):
┌──────────────────────────────────────┐
│                    "깊이의 증거"      │
│                                      │
│    ┌────────┐          서브타이틀     │
│    │ 코르크  │                        │
│    │ 매크로  │     [보케 영역]         │
│    │        │                        │
│    └────────┘          scroll ↓      │
└──────────────────────────────────────┘

모바일 (3:4):
┌──────────────────┐
│  "깊이의 증거"    │
│                  │
│   ┌────────┐    │
│   │ 코르크  │    │
│   │ 매크로  │    │
│   │        │    │
│   └────────┘    │
│  [보케 영역]     │
│                  │
│   scroll ↓      │
└──────────────────┘
```

---

## 금지 사항

- 새것 코르크 사용 금지 — 반드시 사용/숙성 흔적이 있는 코르크
- 차가운 블루/틸/사이안 톤 금지
- 과포화 색상 금지
- 상업적 제품 사진 느낌 금지
- 코르크 전체가 프레임에 들어올 필요 없음 — 표면 단면이 화면을 채운다
- 인위적인 소품 배치 금지 — 모든 요소가 자연스러운 현장감

---

## 납품 체크리스트

- [ ] 16:9 히어로 배너용 메인 컷 (3컷 이상)
- [ ] 3:2 대안 크롭 (2컷 이상)
- [ ] 9:16 모바일 세로형 (2컷 이상)
- [ ] 텍스트 오버레이 테스트 완료 (가독성 확인)
- [ ] 필름 그레인 적용 확인
- [ ] 원본 RAW/고해상도 포함
- [ ] WebP 변환본 별도 폴더
