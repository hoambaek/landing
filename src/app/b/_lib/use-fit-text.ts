"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * 한 줄에 맞을 때까지 글자 크기를 줄인다 — 소유자 이름 서명체 전용.
 *
 * 이름 길이는 우리가 정하지 못한다(등록자가 입력한다). 줄바꿈을 허용하면
 * "Hoam / Baek"처럼 갈려 서명이 두 덩이가 되므로 nowrap으로 묶고, 넘치는 만큼 크기를 내린다.
 * 폰트가 늦게 오면 폭이 달라지므로 fonts.ready에서 다시 잰다.
 *
 * 크기는 state가 아니라 DOM에 직접 쓴다 — 렌더를 한 번 더 돌리지 않아 첫 페인트에서
 * 큰 글씨가 번쩍였다가 줄어드는 일이 없고, effect 안에서 setState를 부르지도 않는다.
 * style prop을 주지 않으므로 React가 이 속성을 되돌리지 않는다.
 *
 * 커시브는 글리프가 레이아웃 박스 밖으로 뻗어(스원시·디센더) scrollWidth가 실제보다
 * 좁게 잡힌다. SAFE로 여유를 두지 않으면 가장자리에서 획이 잘린다.
 */
const SAFE = 0.94;

export function useFitText<T extends HTMLElement>(text: string, max: number, min: number) {
  const ref = useRef<T>(null);

  const fit = useCallback(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const pcs = getComputedStyle(parent);
    const avail =
      (parent.clientWidth - parseFloat(pcs.paddingLeft) - parseFloat(pcs.paddingRight)) * SAFE;
    if (avail <= 0) return;

    /* 항상 최대 크기에서 재기 시작한다 — 직전 축소값에서 재면 한 번 줄어든 뒤
       원래 크기로 돌아오지 못한다(이름이 짧게 바뀌었을 때) */
    el.style.fontSize = `${max}px`;
    const w = el.scrollWidth;
    if (w > avail) el.style.fontSize = `${Math.max(min, Math.floor(max * (avail / w)))}px`;
  }, [max, min]);

  useLayoutEffect(() => {
    fit();
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) fit();
    });
    window.addEventListener("resize", fit);
    return () => {
      alive = false;
      window.removeEventListener("resize", fit);
    };
  }, [fit, text]);

  return ref;
}
