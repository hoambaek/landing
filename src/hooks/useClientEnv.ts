"use client";

import { useSyncExternalStore } from "react";

/**
 * 클라이언트에서만 정해지는 값을 읽는 훅 모음.
 *
 * 이런 값을 useState + useEffect로 잡으면 이펙트 본문에서 동기 setState를 하게 되고,
 * 같은 커밋 안에서 연쇄 렌더가 일어난다(react-hooks/set-state-in-effect).
 * useSyncExternalStore는 서버 스냅샷과 클라이언트 스냅샷을 따로 받으므로
 * setState 없이 같은 일을 한다 — 하이드레이션 불일치도 React가 직접 처리한다.
 */

/** 구독할 외부 소스가 없다 — 두 스냅샷이 다르기만 하면 된다 */
const noopSubscribe = () => () => {};

/** 서버에서는 false, 하이드레이션 이후에는 true. createPortal처럼 document가 필요한 것에 쓴다 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* 계산 결과는 키마다 한 번만 붙잡아 둔다. useSyncExternalStore는 getSnapshot이
   매번 다른 값을 돌려주면 무한 렌더로 보기 때문에, 같은 키에는 같은 값이 나와야 한다.
   세션 동안 고정되는 것(오늘 날짜, 경과일)에만 쓴다. */
const snapshots = new Map<string, unknown>();

/**
 * 브라우저에서만 계산할 수 있는 값. 서버에서는 fallback을 그린다.
 *
 * 현재 시각처럼 서버·클라이언트 값이 갈리는 것에 쓴다. 서버에서 계산하면
 * 하이드레이션 때 글자가 바뀌고, 렌더 중에 계산하면 순수하지 않다(react-hooks/purity).
 *
 * @param key   값을 구분하는 이름. 같은 키에는 세션 내내 같은 값이 돌아온다
 * @param compute 클라이언트에서 한 번 실행할 계산
 * @param fallback 서버에서 쓸 값
 */
export function useClientValue<T>(key: string, compute: () => T, fallback: T): T {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      if (!snapshots.has(key)) snapshots.set(key, compute());
      return snapshots.get(key) as T;
    },
    () => fallback,
  );
}
