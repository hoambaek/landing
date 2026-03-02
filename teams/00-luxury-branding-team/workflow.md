# 팀 작업 워크플로우

> 모든 기획 작업은 이 방식으로 진행한다.

---

## 프로세스

```
CEO 요청
    ↓
각 팀 에이전트 병렬 작업 (독립적)
    ↓
00-luxury-branding-team 리더가 전체 검토
    ↓
팀들과 토론 → 조율
    ↓
리더가 최종안 문서 작성
    ↓
CEO에게 보고
```

---

## 각 팀 역할 및 산출물 위치

| 팀 | 폴더 | 작업 내용 |
|----|------|-----------|
| 럭셔리 브랜딩 (총괄) | `00-luxury-branding-team/` | 검토, 조율, 최종안 |
| 프론트엔드 | `01-frontend-team/` | 기술 스펙, 컴포넌트 구조 |
| 디자인 | `02-design-team/` | 비주얼 시스템, 모션 원칙 |
| UX | `03-ux-team/` | 플로우, 인터랙션, 와이어프레임 |
| 카피라이팅 | `04-copywriting-team/` | 카피 초안, 톤앤매너 |
| 마케팅 | `05-marketing-team/` | 포지셔닝, 메시지 전략 |
| 크리에이티브 영상 | `06-creative-video-team/` | 영상 디렉션, 촬영 스펙 |
| 크리에이티브 사진 | `07-creative-photo-team/` | 사진 디렉션, 에셋 가이드 |

---

## 팀별 사용 스킬

각 팀 에이전트가 작업 시 반드시 호출해야 하는 스킬 목록.

| 팀 | 폴더 | 필수 스킬 |
|----|------|-----------|
| 럭셔리 브랜딩 (총괄) | `00-luxury-branding-team/` | `superpowers:brainstorming` (방향 수립 시) |
| 프론트엔드 | `01-frontend-team/` | `react-best-practices`, `vercel-react-best-practices`, `tailwind-design-system` |
| 디자인 | `02-design-team/` | `ui-ux-pro-max`, `visual-design-foundations` |
| UX | `03-ux-team/` | `ui-ux-pro-max`, `web-design-guidelines` |
| 카피라이팅 | `04-copywriting-team/` | `copywriting` |
| 마케팅 | `05-marketing-team/` | `marketing-psychology`, `marketing-ideas` |
| 크리에이티브 영상 | `06-creative-video-team/` | `ui-ux-pro-max` (레퍼런스 분석 시) |
| 크리에이티브 사진 | `07-creative-photo-team/` | `ui-ux-pro-max` (레퍼런스 분석 시) |

> 스킬은 작업 시작 전 `Skill` 도구로 호출해야 한다. 스킬 목록은 Claude Code의 사용 가능 스킬에 따라 변동될 수 있다.

---

## 최종안 문서 형식

리더가 작성하는 최종 보고 문서는 `00-luxury-branding-team/final-[주제].md` 로 저장.

### 구조
```
# [주제] — 최종안

## 핵심 결론
## 팀별 산출물 요약
## 럭셔리 기준 검토 결과
## 최종 승인 내용
## 다음 단계
```

---

## 파일 네이밍

```
[팀폴더]/[주제]-[타입].md

예시:
  03-ux-team/hero-flow.md
  04-copywriting-team/hero-copy.md
  00-luxury-branding-team/final-hero.md
```
