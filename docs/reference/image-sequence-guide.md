# Observation 섹션 — 이미지 시퀀스 애니메이션 가이드

> 레퍼런스: https://codepen.io/GreenSock/pen/VwgevYW (Apple AirPods Pro 스타일)

## 원리

스크롤에 따라 **100~150장의 연속 이미지(프레임)**를 Canvas에 순서대로 그려서, 마치 영상이 스크롤에 반응하는 것처럼 보이게 하는 기법.

- Canvas 고정 (`position: fixed`)
- GSAP ScrollTrigger `scrub: true`로 스크롤 위치 ↔ 프레임 번호 매핑
- 프리로더로 전체 이미지 미리 로드 후 재생

---

## 에셋 준비

### 방법 1: 영상 → 이미지 시퀀스 변환 (권장)

1. **영상 준비**: 원하는 장면 촬영/제작
2. **프레임 추출**:

```bash
# FFmpeg로 영상을 이미지 시퀀스로 변환
ffmpeg -i input.mp4 -vf "fps=30,scale=1920:-1" frames/frame-%04d.jpg
```

- `fps=30` → 30fps 기준 약 5초 영상 = 150장
- `scale=1920:-1` → 가로 1920px, 세로 비율 유지
- 출력: `frame-0001.jpg` ~ `frame-0150.jpg`

3. **WebP 변환 (용량 70% 절감)**:

```bash
for f in frames/*.jpg; do
  cwebp -q 80 "$f" -o "${f%.jpg}.webp"
done
```

### 방법 2: 3D 렌더링 시퀀스

Blender, Cinema 4D 등에서 카메라 애니메이션을 렌더링 → 프레임 시퀀스 내보내기.

### 방법 3: 기존 영상에서 추출

이미 보유한 영상(해저 촬영, 숙성 과정 등)에서 추출.

---

## 에셋 스펙

| 항목 | 권장값 |
|------|--------|
| 프레임 수 | 100~150장 |
| 해상도 | 1920x1080 (16:9) |
| 포맷 | WebP (용량 우선) 또는 JPG |
| 개당 용량 | 50~100KB |
| 총 용량 | 5~15MB |
| FPS | 24~30 |
| 파일명 | `seq-0001.webp` ~ `seq-0150.webp` |

---

## 프로젝트 파일 구조

```
public/images/observation-seq/
├── seq-0001.webp
├── seq-0002.webp
├── ...
└── seq-0147.webp
```

---

## 구현 핵심 코드 (CodePen 기준)

```javascript
// Canvas 설정
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// 프레임 수
const frameCount = 147;

// 이미지 URL 생성
const images = [];
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = `path/to/seq-${String(i + 1).padStart(4, "0")}.webp`;
  images.push(img);
}

// ScrollTrigger로 프레임 제어
const obj = { frame: 0 };
gsap.to(obj, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.5,
    start: 0,
    end: "max",
  },
  onUpdate: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[obj.frame], 0, 0);
  },
});
```

---

## 콘텐츠 후보 (Observation 섹션용)

- 해저 하강 장면 (수면 → 심해)
- 샴페인 병 숙성 과정 타임랩스
- 기포가 변화하는 과정
- 해저 환경 (빛 변화, 수압, 온도)

---

## 참고

- Apple 제품 페이지에서 자주 사용하는 기법
- 이미지 프리로딩 필수 (로딩 인디케이터 권장)
- 모바일: 프레임 수를 줄이거나 (60~80장) 해상도를 낮춰 대응
- `prefers-reduced-motion` 사용자: 정적 이미지 1장으로 대체
