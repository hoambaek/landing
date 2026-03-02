# Muse de Maree — 홈페이지 섹션별 AI 영상/시네마그래프 프롬프트

**버전**: 1.0
**작성**: 크리에이티브 영상 팀
**기준일**: 2026-02-23
**용도**: Runway Gen-3 / Kling / Pika 등 AI 영상 생성 도구용

---

## 공통 스타일 가이드

모든 프롬프트에 아래 스타일 키워드를 기본 적용한다.

```
Base Style Keywords:
cinematic, slow motion, film grain, analog texture, muted color palette,
warm amber tones, soft contrast, Kodak Portra 400 film look,
meditative, contemplative, quiet luxury, no text overlay, no bright colors,
no fast camera movement, seamless loop
```

### 색온도 구분
- **지상/오브제 장면**: 2700K~3200K (앰버-크림 톤)
- **수중 장면**: 7500K~8500K (콜드 딥 블루), 단 빛 입사 구간은 6500K 허용
- **추상 데이터 장면**: 앰버-골드 기조 위에 미드나이트 블루 액센트

### 금지 사항 (전 프롬프트 공통)
- 텍스트, 로고, 워터마크
- 밝은 네온/비비드 컬러
- 빠른 카메라 이동, 줌 인/아웃
- 사람, 손, 얼굴
- HDR 톤매핑, 과도한 선명도
- 틸-오렌지 그레이딩
- 렌즈 플레어, 과도한 보케

---

## S1 — The Void (히어로)

### S1-V01. 수면 아래 빛의 확산 (Ambient Light Diffusion)

> 히어로 배경용 앰비언트 루프. 수면 바로 아래에서 자연광이 물속으로 퍼져 내려오는 장면.

**프롬프트:**
```
Underwater scene shot from 3 meters below the ocean surface looking upward.
Soft natural sunlight penetrates the water surface, creating slowly shifting
caustic light patterns. Light rays descend in gentle columns through deep blue
water with suspended fine particles. The surface ripples are barely visible,
creating an ethereal dappled light effect. No objects, no marine life —
only light and water. Cool blue-green color temperature (7500K). Extremely slow
movement. Shot on 35mm film with visible grain. Cinematic, meditative,
abstract. Seamless loop.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 16:9 (데스크톱 히어로 배경) |
| 길이 | 8~10초 루프 |
| 루프 | 무결절(Seamless) 필수 |
| 용도 | 히어로 섹션 전체 배경 영상 (음소거, 자동재생) |

---

### S1-V02. 미세 기포 상승 (Micro Bubble Ascent)

> 심해에서 미세한 기포가 불규칙하게 천천히 올라가는 장면. 샴페인의 탄산을 바다의 언어로 번역한다.

**프롬프트:**
```
Deep underwater scene. Tiny champagne-like micro bubbles rise slowly and
irregularly through dark navy-blue water. Each bubble catches a faint glimmer
of light from above, appearing as small luminous spheres against the deep
darkness. Bubbles vary in size — some barely visible pinpoints, others slightly
larger — ascending at different speeds with gentle organic drift. Deep ocean
blue-black background with subtle gradient toward lighter blue at top of frame.
No objects visible, only bubbles and water. Extreme slow motion, 50% speed.
35mm film grain. Cool color temperature 8000K. Ethereal, silent, hypnotic.
Seamless vertical loop.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 16:9 (데스크톱) + 9:16 (모바일 대응용 별도 생성 권장) |
| 길이 | 6~8초 루프 |
| 루프 | 무결절 필수 — 상단 소멸 = 하단 생성 |
| 용도 | 히어로 레이어 오버레이 또는 전환 구간 |

---

### S1-C01. 해저 병 시네마그래프 (Bottle on Seabed — Cinemagraph)

> 해저 바닥에 놓인 병이 조류에 미세하게 흔들리는 시네마그래프. 병은 실루엣/부분만 노출.

**프롬프트:**
```
Cinemagraph. A single dark glass champagne bottle rests on a sandy ocean floor
at approximately 30 meters depth. The bottle is partially covered with fine
sediment and tiny barnacles, showing signs of long submersion. Only the lower
half and neck of the bottle are visible — the label is obscured by marine
deposits. A very gentle ocean current causes the surrounding fine sand particles
to drift slowly. The bottle itself remains almost perfectly still with only
the faintest micro-vibration from the current. Dim ambient light from above
creates a soft gradient. Deep navy-blue to black color palette. Cool
temperature 8000K. Macro-level subtle movement only. 35mm film grain texture.
Still photograph feel with minimal living motion. Contemplative, ancient,
timeless.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 16:9 |
| 길이 | 5~6초 루프 |
| 루프 | 무결절 — 모래 입자 흐름만 반복 |
| 용도 | 히어로 하단 또는 스크롤 전환 구간 시네마그래프 |
| 참고 | 병 전면/라벨 직접 노출 금지. 실루엣과 질감만 포착 |

---

## S2 — Observation (스토리)

### S2-C01. 해저 병 표면 미생물 성장 (Marine Growth Timelapse — Cinemagraph)

> 해저에 오래 놓인 병 표면에 미세 생물(따개비, 미세조류)이 서서히 퍼져가는 타임랩스 느낌의 시네마그래프.

**프롬프트:**
```
Cinemagraph with timelapse quality. Extreme macro close-up of a dark glass
bottle surface submerged in deep ocean water. Tiny barnacles, micro-algae,
and mineral deposits are slowly, almost imperceptibly growing and spreading
across the glass surface. The growth pattern is organic and fractal-like,
resembling a living map drawn by the sea. A very faint current moves
microscopic particles in the water around the bottle surface. The glass
beneath the growth shows the amber-green hue of aged champagne bottles.
Lighting: soft, diffused from above, cool blue 7500K with warm amber
reflections off the glass. Ultra slow organic growth movement. Film grain,
shallow depth of field. Scientific yet poetic. Macro lens perspective.
Meditative and patient.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 16:9 또는 4:3 (에디토리얼 레이아웃 대응) |
| 길이 | 8~10초 루프 |
| 루프 | 무결절 — 성장 방향이 자연스럽게 순환 |
| 용도 | Observation 섹션 인라인 시네마그래프 |
| 참고 | 라벨/브랜드명 노출 금지. 유리 곡면과 유기체만 보여야 함 |

---

### S2-V01. 수면→해저 코스틱 라이트 (Caustic Light Descent)

> 수면에서 해저 바닥으로 내려오는 빛이 유기적 파동 패턴을 만드는 장면. 빛 그 자체가 피사체.

**프롬프트:**
```
Underwater scene looking down at a sandy ocean floor from approximately
5 meters above. Natural sunlight penetrates the water surface and creates
caustic light patterns — shifting, organic web-like patterns of bright light
dancing slowly across the pale sand. The light patterns move with gentle
wave-like rhythm, expanding and contracting like breathing. Water is crystal
clear with minimal particles. Color: turquoise-white light patterns (6500K)
against cool blue-green water (7500K) and warm sand floor. No marine life,
no objects — pure light choreography on ocean floor. Extremely slow, hypnotic
movement. 35mm film aesthetic with soft grain. BBC Blue Planet II underwater
cinematography reference. Seamless loop.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 16:9 |
| 길이 | 6~8초 루프 |
| 루프 | 무결절 — 빛 패턴의 자연 순환 주기 활용 |
| 용도 | Observation 섹션 배경 또는 Before/After 전환 영상 |

---

### S2-V02. 압력 하강 시퀀스 (Pressure Descent)

> 수면에서 점점 깊어지는 수심을 빛의 변화로만 표현. 밝은 터쿼이즈 → 진한 네이비 → 거의 암흑.

**프롬프트:**
```
Continuous slow vertical camera descent through ocean water column. Starting
just below the bright water surface with visible sun rays and turquoise tones
(6500K), gradually descending deeper. Light progressively fades — mid-depth
shows blue-green (7500K) with dimming light shafts — deep section transitions
to dark navy-indigo (8500K) with only faint traces of light above.
Fine suspended particles become visible as depth increases, like underwater
snow. No marine life, no objects. The descent feels infinite and meditative.
Camera moves downward at imperceptibly slow pace — approximately 1 meter
per second of footage. 35mm film grain intensifies slightly with depth.
Cinematic, contemplative, like sinking into deep time. Color shift must be
gradual and organic, never abrupt.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 9:16 (세로형 — 모바일 최적화) 또는 16:9 |
| 길이 | 8~10초 (비루프 — 선형 진행) |
| 루프 | 비루프 권장. 단, 루프 필요 시 암전→밝은 수면 전환 가능 |
| 용도 | Observation "Pressure Descent" 서브섹션 스크롤 연동 |

---

## S3 — Data Archive (데이터 시각화)

### S3-V01. 해류 흐름 시각화 (Ocean Current Flow)

> 해류의 흐름을 추상적으로 시각화한 유기적 파동 영상. 데이터가 살아있는 유기체처럼 움직인다.

**프롬프트:**
```
Abstract visualization of ocean current flow. Thousands of thin luminous
particle trails move in organic, sweeping curves across a dark midnight-blue
background. The trails are warm amber-gold color, resembling bioluminescent
plankton carried by deep ocean currents. Movement is fluid and rhythmic —
particles cluster, separate, and reform in wave-like patterns. Some streams
move faster, creating density variations. The overall composition resembles
a living topographical map of underwater currents. Dark background (#0A0A0F)
with amber-gold particle trails (#B7916E to #D4A574). Minimal, elegant,
scientific yet poetic. No grid lines, no text, no UI elements. Organic data
art aesthetic. Slow, meditative movement with gentle acceleration and
deceleration. Film grain overlay.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 16:9 |
| 길이 | 8~10초 루프 |
| 루프 | 무결절 — 입자 흐름 연속 |
| 용도 | Data Archive 섹션 배경 영상 |

---

### S3-V02. 수온 변화 파동 (Temperature Wave)

> 수온 변화를 나타내는 유기적 파동. 등고선처럼 겹겹이 쌓인 곡선이 천천히 물결친다.

**프롬프트:**
```
Abstract data visualization of ocean temperature fluctuation. Multiple layered
organic wave forms undulate slowly across the frame, resembling topographic
contour lines or sound waves. Lines are thin and elegant — warm amber (#B7916E)
and muted gold (#C9A96E) against deep dark background (#0D0D12). The waves
pulse gently as if breathing — expanding and contracting with slow, organic
rhythm. Spacing between lines varies to suggest temperature density zones.
Occasional subtle shimmer where wave peaks concentrate, like heat distortion.
Minimalist, abstract, scientific elegance. No axis labels, no numbers, no UI.
Pure organic data poetry. Movement is extremely slow — one full wave cycle
every 6-8 seconds. Slight film grain texture. Contemplative, hypnotic.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 16:9 또는 21:9 (울트라와이드 배너 대응) |
| 길이 | 8~10초 루프 |
| 루프 | 무결절 — 파동 주기가 루프 길이와 일치 |
| 용도 | Data Archive 섹션 인라인 비주얼 또는 호버 인터랙션 배경 |

---

### S3-V03. 압력 데이터 맥동 (Pressure Pulse)

> 심해 수압의 미세한 변화를 동심원 맥동으로 시각화. 심장 박동처럼 느리게 뛰는 바다의 맥박.

**프롬프트:**
```
Abstract visualization of deep ocean pressure data. A single point of warm
amber light at center of frame emits slow, concentric circular pulses outward,
like a heartbeat rendered in light. Each pulse ring expands gradually, fading
from bright amber-gold at center to translucent at edges, before dissolving
into the dark background. Rings have slight organic irregularity — not perfect
circles but gently warped by invisible forces. Dark navy-black background
(#080810). Pulse frequency: one beat every 3-4 seconds, matching a resting
heartbeat. Between pulses, the center glows faintly. Minimal, meditative,
alive. No UI, no text. The feeling of measuring something vast and ancient.
Soft film grain. Cinematic depth.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 1:1 (정방형 — 데이터 카드 내 삽입용) 또는 16:9 |
| 길이 | 6~8초 루프 |
| 루프 | 무결절 — 맥동 주기 기반 |
| 용도 | Data Archive 섹션 압력 데이터 카드 내 비주얼 |

---

## S5 — Archive (컬렉션)

### S5-V01. 병 회전 클로즈업 — 범용 (Bottle Rotation — Generic)

> 어두운 배경에서 병이 극도로 천천히 회전하며 빛이 유리 표면을 스치는 클로즈업. 5개 큐베 공통 템플릿.

**프롬프트:**
```
Extreme close-up of a dark glass champagne bottle rotating very slowly against
a completely dark background. The bottle surface shows signs of ocean aging —
faint mineral deposits, tiny salt crystals, and subtle texture variations.
A single warm directional light source (2700K tungsten) from the left creates
a slowly moving highlight across the curved glass surface as the bottle turns.
The highlight reveals the bottle's surface texture — scratches from ocean
sediment, cloudy mineral patina. Only the midsection of the bottle is visible —
no label, no top, no bottom. Rotation is imperceptibly slow — approximately
5 degrees per second. Background: pure black with no reflections. Shallow depth
of field, macro lens quality. 35mm film grain, analog warmth. The feeling of
examining a museum artifact. Elegant, tactile, precious.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 3:4 (세로형 — 컬렉션 카드 내 삽입) 또는 16:9 |
| 길이 | 6~8초 루프 |
| 루프 | 무결절 — 회전 연속 |
| 용도 | Archive 섹션 5개 큐베 카드 공통 비주얼 |
| 참고 | 각 큐베별 조명 색온도/각도 미세 차이로 변형 가능 (아래 참조) |

---

### S5-V02. 큐베별 조명 변형 가이드 (Cuvee Lighting Variations)

> S5-V01 공통 템플릿 기반, 5개 큐베 각각의 성격을 조명 변화로 구분한다.

#### D20 (수심 20m — Core)
```
[S5-V01 base prompt] + Light source: slightly warmer (2500K), creating a soft
golden highlight. Glass surface shows minimal ocean deposits — relatively clean
with light salt haze. The feeling of shallow coastal waters at dawn. Gentle,
approachable, warm.
```

#### D40 (수심 40m — Limited)
```
[S5-V01 base prompt] + Light source: cooler shift (3200K), creating a
silver-amber highlight. Glass surface shows moderate mineral encrustation
and deeper patina. More texture, more history. The feeling of twilight zone
depth. Mysterious, layered, complex.
```

#### Gyre (순환 해류 — Limited)
```
[S5-V01 base prompt] + Light source moves in a subtle circular path as if
the light itself is caught in a current. Warm amber (2700K). Glass surface
shows unique spiral-like mineral deposit patterns suggesting circular water
movement. Dynamic yet controlled. Flowing, eternal, cyclical.
```

#### Kuroshio (쿠로시오 — Collector's Edition)
```
[S5-V01 base prompt] + Light source: deep warm gold (2400K) with very slow
intensity fluctuation, as if filtered through moving deep water. Glass surface
shows rich, dense mineral deposits and distinctive dark patina from warm
current exposure. The feeling of ancient oceanic power. Majestic, dense, rare.
```

#### T18 (18개월 숙성 — Collector's Edition)
```
[S5-V01 base prompt] + Light source: the warmest (2200K), like candlelight.
Glass surface shows the heaviest deposits — thick mineral crust, barnacle
traces, deep scratches. Maximum aging evidence. The highlight moves slowest
of all five — 3 degrees per second. The feeling of deep geological time.
Ancient, weighty, irreplaceable.
```

| 항목 | 스펙 (5개 공통) |
|------|------|
| 비율 | 3:4 |
| 길이 | 6~8초 루프 |
| 루프 | 무결절 |
| 용도 | Archive 섹션 각 큐베 카드 |

---

### S5-V03. 빛이 병 표면을 스치는 추상 (Light Caress — Abstract)

> 병인지 알 수 없을 정도로 극단적 클로즈업. 빛이 곡면 위를 천천히 미끄러지는 추상적 장면.

**프롬프트:**
```
Ultra extreme macro close-up of a curved glass surface — so close that the
object is unrecognizable. A warm beam of light (2700K) slowly glides across
the surface from left to right, revealing micro-textures: tiny scratches,
mineral crystal deposits, salt residue patterns. The glass has a deep
amber-green tint visible where light passes through. Surface condensation
droplets catch light as small bright points. Background transitions from
pure black (unlit side) to deep amber (lit side). Movement: light travels
across frame in approximately 8 seconds. Extreme shallow depth of field —
only a thin band in sharp focus. 35mm macro film look with pronounced grain.
Abstract, tactile, sensual. Like touching light with your eyes.
```

| 항목 | 스펙 |
|------|------|
| 비율 | 21:9 (울트라와이드 — 섹션 구분 배너) 또는 16:9 |
| 길이 | 8~10초 루프 |
| 루프 | 무결절 — 빛이 좌→우 후 암전 전환 |
| 용도 | Archive 섹션 진입 전환 또는 큐베 간 구분 비주얼 |

---

## 기술 납품 스펙 (전체 공통)

| 항목 | 스펙 |
|------|------|
| 해상도 (원본) | 3840 x 2160 (4K UHD) 이상 |
| 해상도 (웹 납품) | 1920 x 1080 (FHD) |
| 프레임레이트 | 24fps (최종 출력) |
| 포맷 (웹) | MP4 (H.264) + WebM (VP9) 이중 납품 |
| 비트레이트 | 8~12 Mbps (화질과 용량 균형) |
| 파일 용량 | 루프 1회 기준 최대 15MB (10MB 이내 목표) |
| 오디오 | 없음 (Muted) |
| 색공간 | sRGB (BT.709) |
| 필름 그레인 | 모든 영상에 ISO 800~1600 수준의 필름 그레인 필수 적용 |
| 루프 | 별도 명시 없는 한 무결절 루프 기본 |

---

## AI 생성 후 후처리 가이드

1. **그레인 보정**: AI 생성 영상은 대부분 과도하게 깨끗하므로, 후처리 단계에서 필름 그레인 오버레이 추가 필수
2. **색보정**: AI 출력물의 채도를 -10~-20% 디새츄레이션 처리. 비비드한 결과물은 브랜드 톤과 불일치
3. **속도 조정**: AI 출력이 의도보다 빠를 경우, 50~70% 추가 감속 후 프레임 보간 적용
4. **루프 편집**: AI 생성 원본은 대부분 루프가 불완전하므로, After Effects / DaVinci Resolve에서 크로스페이드 루프 포인트 수동 편집 필수
5. **해상도 업스케일**: AI 출력 해상도가 부족할 경우 Topaz Video AI 등으로 4K 업스케일 후 납품
6. **아티팩트 제거**: AI 특유의 왜곡(손가락, 비정상 물리 등) 발견 시 해당 프레임 마스킹 처리 또는 재생성

---

## 우선순위

| 순위 | 영상 ID | 섹션 | 설명 | 중요도 |
|------|---------|------|------|--------|
| 1 | S1-V01 | The Void | 히어로 배경 앰비언트 | 필수 |
| 2 | S1-V02 | The Void | 기포 상승 | 필수 |
| 3 | S1-C01 | The Void | 해저 병 시네마그래프 | 필수 |
| 4 | S2-V01 | Observation | 코스틱 라이트 | 필수 |
| 5 | S2-C01 | Observation | 병 표면 미생물 성장 | 높음 |
| 6 | S5-V01~02 | Archive | 5개 큐베 병 회전 | 높음 |
| 7 | S3-V01 | Data Archive | 해류 흐름 시각화 | 높음 |
| 8 | S3-V02 | Data Archive | 수온 변화 파동 | 보통 |
| 9 | S2-V02 | Observation | 압력 하강 시퀀스 | 보통 |
| 10 | S3-V03 | Data Archive | 압력 맥동 | 보통 |
| 11 | S5-V03 | Archive | 빛 추상 클로즈업 | 보통 |

---

*본 문서는 크리에이티브 영상 팀이 작성한 AI 영상 생성 프롬프트 가이드입니다.*
*hero-video-direction.md의 비주얼 원칙과 금지 사항을 준수합니다.*
*프론트엔드 팀(01-frontend-team)과 기술 스펙 정합성을 사전 확인하세요.*
