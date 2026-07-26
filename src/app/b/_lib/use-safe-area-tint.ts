"use client";

import { useEffect } from "react";

/* 안전영역 두 색. globals.css의 html:has(.b-paper) 값과 같아야 한다. */
const VOID = "#0A0908";
const PAPER = "#EDEAE3";

/**
 * 안전영역(상태바·하단바) 색.
 *
 * iOS 사파리는 페이지가 그린 픽셀이 아니라 html 배경색을 샘플링하고,
 * 위아래 두 바에 그 한 색을 같이 쓴다. 시뮬레이터(iOS 26.1)에서 잰 값이다.
 *
 *   html=void  → 상태바 (10,9,8)      하단바 (11,10,9)
 *   html=paper → 상태바 (237,234,227) 하단바 (234,231,225)
 *
 * 위아래를 다르게 하는 방법은 없다. 두 가지를 시도했고 둘 다 실패했다.
 *   - html에 2단 그라디언트: background-image는 무시하고 background-color만 본다
 *   - 배경색 비우기: 내용을 따라가는 게 아니라 흰색으로 떨어진다
 *
 * 그래서 페이지당 한 색이다. 어두운 히어로가 있는 화면(입장 필름·record)은
 * 스크롤 위치와 무관하게 계속 검정으로 두고, 종이 단색 화면(인증서·소유 관리·각인)만
 * 종이로 맞춘다. 스크롤에 따라 바꾸면 히어로가 반쯤 남은 구간에서 위가 틀린다.
 *
 * 안드로이드 크롬은 반대로 theme-color 메타를 따르므로 둘 다 맞춘다.
 * layout.tsx가 심어둔 태그의 content만 바꿔 끼운다 — 새로 만들면 중복된다.
 *
 * @param paper 위아래가 전부 종이인 화면인가. 마크업의 b-paper 클래스와 같은 값을 준다.
 */
export function useSafeAreaTint(paper: boolean) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const previous = meta.getAttribute("content");
    meta.setAttribute("content", paper ? PAPER : VOID);
    /* 클라이언트 네비게이션은 같은 태그를 재사용한다 — 떠날 때 되돌리지 않으면 다음 화면이 물려받는다 */
    return () => {
      if (previous !== null) meta.setAttribute("content", previous);
    };
  }, [paper]);
}
