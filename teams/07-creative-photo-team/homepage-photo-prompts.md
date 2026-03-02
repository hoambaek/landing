# 홈페이지 사진 AI 생성 프롬프트

**버전**: 1.0
**작성**: 크리에이티브 사진팀 (07)
**기준일**: 2026-02-23
**참고 문서**: [`hero-photo-direction.md`](./hero-photo-direction.md), [`wireframe/homepage-wireframe.html`](../../wireframe/homepage-wireframe.html)

---

## 공통 스타일 지시

모든 프롬프트에 아래 스타일 키워드를 기본 적용한다. 개별 프롬프트에서 별도 명시하지 않는 한 공통으로 포함.

```
Style base: shot on Kodak Portra 400, film grain, warm amber undertones,
muted desaturated palette, natural single-source lighting, 2700K–3200K tungsten warmth,
soft midtone contrast, no HDR, no AI noise reduction, no studio lighting,
no bright saturated colors, no centered composition, no polished commercial look
```

---

## S1 — The Void (Hero)

> 이미지 없음. CSS 그라디언트 + 파티클 기반 히어로. 사진 불필요.

---

## S2 — Observation (Before & After)

관찰 일기 형식. 바다에 들어가기 전과 인양 후의 변화를 3쌍으로 보여준다.
Before = 정제된 고요함, After = 시간이 새긴 흔적.

---

### 01. 병 전체 — Before (입수 전)

**용도**: Observation 섹션 Before/After 비교 — 왼쪽 패널
**비율**: 3:4 (세로)
**프롬프트**:

```
A pristine champagne bottle standing on a raw limestone slab, untouched and immaculate.
Dark green glass catching faint warm light from the left side at 45 degrees.
Gold foil capsule intact, wire cage neat and precise.
The label is crisp, legible only as texture — no brand name readable.
Background: deep charcoal slate, gradually falling into shadow.
Off-center composition, bottle placed in the right third of the frame with generous negative space on the left.
Shallow depth of field, focus on the bottle's shoulder and neck curve.
Shot on Kodak Portra 400, film grain visible, warm amber undertones, muted desaturated tones,
single tungsten light source 2700K, soft contrast, no studio setup, no commercial product photography.
The bottle looks like it's waiting — still, silent, about to begin a journey.

--ar 3:4 --style raw --s 200
```

---

### 02. 병 전체 — After (인양 후)

**용도**: Observation 섹션 Before/After 비교 — 오른쪽 패널
**비율**: 3:4 (세로)
**프롬프트**:

```
A champagne bottle retrieved from the ocean floor after months of underwater aging.
Barnacles, small oyster shells, and calcified marine organisms encrusting the lower half of the bottle.
Thin veins of salt crystals tracing the glass surface. The foil capsule partially corroded,
edges curling and revealing the glass beneath. Wire cage oxidized to a muted bronze-green patina.
The bottle rests on a weathered wooden plank, traces of seawater still glistening in the crevices.
Off-center composition, bottle placed in the left third with dark negative space on the right.
Single raking light from the right at a low angle, emphasizing the three-dimensional texture of every barnacle and salt deposit.
Shot on Kodak Portra 400, heavy film grain, warm amber-green undertones, deeply muted palette,
soft contrast, tactile and intimate. The bottle looks ancient, like an artifact pulled from a shipwreck.
No clean, no polished, no commercial — this is a document of time.

--ar 3:4 --style raw --s 200
```

---

### 03. 라벨 클로즈업 — Before (입수 전)

**용도**: Observation 섹션 Before/After 비교 — 왼쪽 패널
**비율**: 4:5 (세로)
**프롬프트**:

```
Extreme close-up of a champagne bottle label, brand new and untouched.
Embossed gold foil lettering catching warm sidelight — the texture of raised ink and pressed paper fiber visible.
Cotton-weave label paper with subtle tooth texture. Edges of the label perfectly adhered to the glass.
The light rakes across at nearly 90 degrees from the side, creating deep micro-shadows in every embossed letter and line.
Background glass surface dark and clean.
Tight crop — only the center portion of the label visible, no full brand name readable, just fragments of typography and gold leaf.
Shot on macro lens, Kodak Portra 400 simulation, film grain, warm tungsten 2800K light,
muted earth tones, intimate tactile quality. This is about the materiality of paper and metal, not information.

--ar 4:5 --style raw --s 250
```

---

### 04. 라벨 클로즈업 — After (인양 후)

**용도**: Observation 섹션 Before/After 비교 — 오른쪽 패널
**비율**: 4:5 (세로)
**프롬프트**:

```
Extreme close-up of a champagne bottle label after months submerged in the deep ocean.
The paper is swollen and softened by seawater, edges lifting and curling away from the glass.
Salt crystal formations like delicate frost patterns spreading across the label surface.
Micro-algae stains in muted olive and grey-green, tracing organic patterns over the faded gold foil.
The embossed letters are still partially visible beneath the ocean's markings —
a palimpsest of human craft and natural inscription.
Tiny calcium deposits clustered along the label border like mineral jewelry.
Single raking light from the left, revealing every salt crystal and paper fiber in sharp relief.
Macro lens, Kodak Portra 400, heavy grain, warm amber-green tones, deeply desaturated.
Intimate, archaeological, documentary. Time has written its own label over ours.

--ar 4:5 --style raw --s 250
```

---

### 05. 코르크 — Before (입수 전)

**용도**: Observation 섹션 Before/After 비교 — 왼쪽 패널
**비율**: 1:1 (정방형)
**프롬프트**:

```
A champagne cork viewed from the top, freshly removed from a bottle that has never been submerged.
Clean, uniform tan surface with the typical mushroom shape intact.
Fine pore structure of natural cork visible — regular, tight, dry.
The cork sits on a piece of raw chalk stone, off-center in the lower-right of the frame.
Generous negative space fills the upper-left — just the pale stone surface.
Overhead single light source at 45 degrees, casting a soft shadow to one side.
Macro detail: the compression marks from the bottle neck are visible as subtle concentric pressure lines.
Kodak Portra 400, film grain, warm beige and amber palette, soft contrast,
no dramatic lighting, no studio backdrop.
Quiet, still, precise — the cork before the ocean.

--ar 1:1 --style raw --s 200
```

---

### 06. 코르크 — After (인양 후)

**용도**: Observation 섹션 Before/After 비교 — 오른쪽 패널
**비율**: 1:1 (정방형)
**프롬프트**:

```
A champagne cork after 12 months submerged in deep ocean water, viewed in extreme macro close-up.
The cork has swollen and expanded — its mushroom shape distorted, edges rounded and soft.
The surface has darkened unevenly: patches of deep umber, grey-green mineral stains,
and pale salt crusts like frost on winter soil.
The pore structure has opened — each cell swollen with absorbed seawater,
creating a texture that resembles fossil coral or weathered sandstone.
A faint iridescent sheen of dried sea minerals catches the light.
The cork rests on dark slate, positioned off-center to the upper-left of the frame.
Single raking tungsten light from the right, 2700K, emphasizing every swollen pore and mineral deposit.
Heavy film grain, Kodak Portra 400, deeply warm amber-brown palette,
soft contrast, no sharpening, no digital clarity.
This cork has been transformed by pressure and patience — it is now a geological object.

--ar 1:1 --style raw --s 250
```

---

## S4 — The Maker (이중의 떼루아)

2장의 카드 이미지. 왼쪽: 프랑스 샹파뉴 메종, 오른쪽: 한국 남해안 숙성 팀.
두 이미지가 나란히 놓였을 때 대화하는 느낌 — 땅과 바다, 오래된 것과 시작하는 것.

---

### 07. Partner Maison — Champagne Mignon Boulard

**용도**: The Maker 섹션 좌측 카드
**비율**: 3:2 (가로)
**프롬프트**:

```
A small family-run champagne estate in Venteuil, Vallée de la Marne, France.
Late afternoon golden hour, autumn.
Rows of old Pinot Meunier vines on a gentle south-facing slope,
leaves turning amber and copper, some already fallen on the chalky white soil.
In the middle distance, a modest stone maison with a weathered wooden door and shutters —
not grand, not renovated, authentically worn by generations.
No people visible, but signs of human presence: a pruning tool leaning against a post,
a wooden crate half-filled with harvested grapes.
The composition is wide and environmental — the vineyard occupies two-thirds of the frame,
the maison sits in the right third, partially obscured by vine rows.
Warm sidelight from the setting sun, long shadows across the chalk soil.
Shot on medium format film, Kodak Portra 400, visible grain,
deeply warm amber and earth tones, desaturated greens, soft golden light.
No tourist postcard, no drone shot — this is intimate, ground-level, a place of quiet labor.

--ar 3:2 --style raw --s 200
```

---

### 08. Aging Team — Muse de Marée

**용도**: The Maker 섹션 우측 카드
**비율**: 3:2 (가로)
**프롬프트**:

```
An underwater aging operation off the southern coast of South Korea.
A diver in dark wetsuit descending along a guide rope toward a metal cage structure
resting on the ocean floor at approximately 30 meters depth.
Inside the cage, rows of champagne bottles secured in custom racks,
some already showing early signs of marine growth — faint white calcification, tiny barnacle beginnings.
The water is deep blue-green, ambient ocean light filtering from above in soft shafts.
Particulate matter floating in the water column — the image has a documentary, archival quality.
The diver is seen from behind and slightly above, small against the scale of the underwater structure.
Off-center composition, the cage in the lower-right, the diver descending from upper-left.
Color palette: muted teal, deep navy, touches of amber from the diver's equipment light.
Shot on underwater housing with natural available light supplemented by a single dive torch.
Film grain overlay, desaturated, soft contrast, Kodak Portra 400 emulation.
No vibrant tropical reef colors, no crystal-clear resort water — this is deep, cold, working ocean.

--ar 3:2 --style raw --s 200
```

---

## S5 — Archive (5개 큐베 컬렉션)

5장의 제품 카드 이미지. 캐러셀 형태로 배치.
제품 사진이되 상업적 제품 사진이 아니다 — 에디토리얼 스틸 라이프.
각 큐베의 숙성 기간과 희소성에 따라 해양 부착물의 정도가 달라진다.

**공통 구도 원칙**:
- 병은 프레임의 한쪽에 치우침 (중앙 배치 금지)
- 배경은 실제 물질 — 슬레이트, 석회암, 거친 리넨, 풍화된 나무
- 조명: 단일 광원, 측면 또는 45도
- 질감이 주인공: 유리 곡선, 부착물, 빛의 굴절

---

### 09. En Lieu Sûr (Cuvée 01 · Core · Brut)

**용도**: Archive 섹션 첫 번째 카드
**비율**: 3:4 (세로)
**프롬프트**:

```
A standard 750ml champagne bottle after brief ocean aging, standing on a raw limestone surface.
Minimal marine encrustation — a thin film of calcium deposits on the lower third,
a few tiny barnacle spots, subtle salt bloom on the glass.
The bottle retains much of its original form — the label is weathered but legible as texture,
the gold foil capsule shows early patina but is mostly intact.
This is the entry point: the ocean's first touch, gentle and restrained.
The bottle is placed in the right third of the frame, leaning very slightly against a rough chalk block.
Single warm light from the upper left at 45 degrees, casting a long soft shadow to the right.
Background: dark slate transitioning to deep shadow.
Kodak Portra 400, visible film grain, warm amber and stone tones,
muted palette, soft contrast, editorial still life photography.
Quiet elegance — the least transformed, yet already marked by the sea.

--ar 3:4 --style raw --s 200
```

---

### 10. En Lieu Sûr Magnum (Cuvée 02 · Limited · 1500ml)

**용도**: Archive 섹션 두 번째 카드
**비율**: 3:4 (세로)
**프롬프트**:

```
A magnum champagne bottle (1500ml) after ocean aging, commanding presence through sheer scale.
The bottle is noticeably larger — its proportions more sculptural, the glass thicker, the curves more pronounced.
Marine encrustation similar to the standard bottle but spread over a grander surface:
scattered barnacles, calcium veins, a light green-grey patina of dried micro-algae near the punt.
The bottle lies on its side on a piece of weathered driftwood,
positioned in the lower-left of the frame with the neck extending toward the right edge.
Dramatic negative space above — just dark, warm shadow.
Single low-angle raking light from the right, catching the curve of the glass and the texture of every barnacle.
Kodak Portra 400, heavy grain, deep warm amber and umber tones,
desaturated, soft contrast, editorial.
The scale speaks: more glass, more time, more silence.

--ar 3:4 --style raw --s 200
```

---

### 11. Élément de Surprise (Cuvée 03 · Limited · Blanc de Blancs)

**용도**: Archive 섹션 세 번째 카드
**비율**: 3:4 (세로)
**프롬프트**:

```
A champagne bottle of Blanc de Blancs after ocean aging, distinguished by its lighter glass color.
The pale golden-green glass allows more light to pass through,
revealing the wine's straw-gold color as a warm internal glow where backlight catches the liquid.
Marine deposits create a striking contrast on the lighter glass —
white salt crystals appear more vivid, tiny barnacles cast sharper shadows.
The mineral transformation is visually the most dramatic on this lighter surface.
The bottle stands upright, placed off-center to the left,
against a background of rough-textured chalk stone wall — white on white, subtly differentiated by texture.
Single warm backlight from behind and slightly right, creating a luminous halo effect through the glass.
A secondary fill from the front-left, very soft, just enough to read the surface textures.
Kodak Portra 400, grain, warm golden-amber palette lighter than other bottles,
desaturated but with a whisper of pale gold, editorial still life.
Purity transformed: the most transparent bottle reveals the most visible change.

--ar 3:4 --style raw --s 250
```

---

### 12. Atomes Crochus 1yr (Cuvée 04 · Collector's · 12개월 숙성)

**용도**: Archive 섹션 네 번째 카드
**비율**: 3:4 (세로)
**프롬프트**:

```
A champagne bottle after 12 months of deep ocean aging, showing significant marine transformation.
Dense barnacle colonies covering the lower two-thirds of the bottle,
some large enough to cast their own shadows. Calcium deposits forming continuous white veins
that trace the contours of the glass like geological strata.
Patches of dried tube worm casings and small mussel shells adhered to the shoulder.
The label is almost entirely obscured — fragments of gold foil peek through gaps in the encrustation.
The foil capsule is heavily patinated, dark bronze-green with salt crystal edges.
The bottle stands on a slab of dark volcanic stone, positioned in the right third of the frame.
Single hard raking light from the left at a low angle, creating extreme texture emphasis —
every barnacle ridge, every salt crystal facet, every calcium vein casting a micro-shadow.
Kodak Portra 400, heavy grain, warm amber-brown-green palette,
deeply desaturated, almost monochromatic, soft overall contrast but sharp local texture.
One year in the deep — the bottle is becoming part of the reef.

--ar 3:4 --style raw --s 250
```

---

### 13. Atomes Crochus 2yr (Cuvée 05 · Collector's · 24개월 숙성)

**용도**: Archive 섹션 다섯 번째 카드 — 가장 희소하고 가장 오래 숙성된 큐베
**비율**: 3:4 (세로)
**프롬프트**:

```
A champagne bottle after 24 months submerged in the deep ocean — the most transformed object in the collection.
The bottle is almost unrecognizable as a commercial product.
A thick, continuous crust of marine life covers nearly the entire surface:
large mature barnacles, overlapping oyster shell fragments, calcareous tube worm colonies,
patches of coralline algae in muted pink-grey, dried sea moss in olive and umber.
Only a small window of dark glass remains visible near the neck —
a glimpse of the original bottle beneath the ocean's accumulated manuscript.
The cork wire cage is fully encrusted, visible only as a raised texture beneath the growth.
The bottle rests at a slight angle against a rough, salt-stained concrete block —
as if just lifted from the seabed and placed down moments ago, still wet.
Traces of seawater pooling at the base, catching the light.
Positioned off-center to the left, with vast dark negative space on the right —
the darkness suggesting the depth from which it emerged.
Single warm tungsten raking light from the upper right,
casting deep shadows into every crevice of the marine encrustation.
Kodak Portra 400, maximum grain, the warmest and most amber-heavy palette of all five bottles,
deeply desaturated, intimate macro-influenced perspective even in a full-bottle shot.
This is no longer a bottle — it is a geological artifact, a time capsule, a sculpture made by the sea.
40 bottles. 24 months. The deepest record.

--ar 3:4 --style raw --s 300
```

---

## 부록: 이미지 사양 요약

| # | 섹션 | 이미지명 | 비율 | 해상도 (최소) | 웹 포맷 |
|---|------|----------|------|--------------|---------|
| 01 | S2 | 병 전체 — Before | 3:4 | 3000×4000px | WebP |
| 02 | S2 | 병 전체 — After | 3:4 | 3000×4000px | WebP |
| 03 | S2 | 라벨 클로즈업 — Before | 4:5 | 3200×4000px | WebP |
| 04 | S2 | 라벨 클로즈업 — After | 4:5 | 3200×4000px | WebP |
| 05 | S2 | 코르크 — Before | 1:1 | 3000×3000px | WebP |
| 06 | S2 | 코르크 — After | 1:1 | 3000×3000px | WebP |
| 07 | S4 | Partner Maison | 3:2 | 4000×2667px | WebP |
| 08 | S4 | Aging Team | 3:2 | 4000×2667px | WebP |
| 09 | S5 | En Lieu Sûr | 3:4 | 3000×4000px | WebP |
| 10 | S5 | En Lieu Sûr Magnum | 3:4 | 3000×4000px | WebP |
| 11 | S5 | Élément de Surprise | 3:4 | 3000×4000px | WebP |
| 12 | S5 | Atomes Crochus 1yr | 3:4 | 3000×4000px | WebP |
| 13 | S5 | Atomes Crochus 2yr | 3:4 | 3000×4000px | WebP |

**총 13장** (S1: 0장, S2: 6장, S3: 0장, S4: 2장, S5: 5장, S6: 0장, S7: 0장)

---

## 부록: 생성 후 보정 가이드

AI 생성 이미지는 다음 보정을 거친 뒤 사용한다:

1. **그레인 추가**: 생성 이미지가 너무 매끄러울 경우 Lightroom/Capture One에서 Kodak Portra 400 그레인 시뮬레이션 추가
2. **채도 조정**: HSL에서 전체 채도 -15~-20%, 블루/그린 채도 추가 -10%
3. **색온도**: 화이트밸런스를 2800K~3200K 방향으로 워밍
4. **컨트라스트**: 하이라이트 -20, 섀도 +15 → 미드톤 중심 소프트 컨트라스트
5. **비네팅**: 모서리 -15~-25 수준의 자연스러운 비네팅 추가
6. **샤프닝**: 최소한으로. 과도한 디지털 선명도 금지

---

*Muse de Marée — 사진팀 (07) / 2026-02-23*
