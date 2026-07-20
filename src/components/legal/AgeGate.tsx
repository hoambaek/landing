"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ageGateCopy } from "@/content/age-gate";
import { localePrefixMap, type Locale } from "@/i18n/config";

/**
 * 연령확인(19세) 게이트 — 진입 시 1회 모달.
 *
 * - 루트 layout에 마운트되어 모든 로케일 라우트를 덮는다.
 * - localStorage(`mdm-age-verified`)에 확인 시각을 저장, 90일간 재노출 안 함.
 * - "아니요" → 로케일별 /exit 안내 페이지로 이동. exit 페이지에서는 게이트 미표시(루프 방지).
 * - SSR/hydration 시점에는 "확인됨"으로 간주(null 렌더) → 크롤러가 본문을 그대로 보고,
 *   인증 사용자에겐 플래시 없음. 클라이언트 마운트 후 실제 값으로 동기화.
 *   verified 값은 useSyncExternalStore로 읽어 effect 내 setState를 피한다.
 * - a11y: role=dialog / aria-modal / 포커스 트랩 / 확인 버튼 오토포커스 / 배경 스크롤 잠금.
 */

const STORAGE_KEY = "mdm-age-verified";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 90; // 90일

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readVerified() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < MAX_AGE_MS;
  } catch {
    // private mode 등 접근 불가 — 안전하게 게이트 노출
    return false;
  }
}

/** SSR/hydration: 확인됨으로 간주해 null 렌더(플래시·hydration 불일치 방지) */
function readVerifiedServer() {
  return true;
}

function grantAccess() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // 저장 실패해도 진입은 허용 (세션 한정) — 리스너 통지로 게이트만 닫음
  }
  listeners.forEach((l) => l());
}

function localeFromPath(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  return "ko";
}

export default function AgeGate() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const verified = useSyncExternalStore(subscribe, readVerified, readVerifiedServer);
  const panelRef = useRef<HTMLDivElement>(null);

  const locale = localeFromPath(pathname);
  const copy = ageGateCopy[locale];
  const isExitRoute = pathname === "/exit" || pathname.endsWith("/exit");
  // NFC 병 경험(/b/[code])은 실물 병을 소지한 사용자가 태그로 진입하는 사적 화면 —
  //  연령확인 게이트를 노출하지 않는다.
  const isNfcRoute = pathname === "/b" || pathname.startsWith("/b/");
  const open = !isExitRoute && !isNfcRoute && !verified;

  // 열림: 배경 스크롤 잠금 + 다이얼로그 패널에 포커스 이동
  // (버튼이 아닌 패널에 포커스 → 프로그램적 포커스로 버튼에 focus-visible 링이 생겨
  //  이중 테두리로 보이는 문제 방지. 키보드 Tab 시에만 버튼 링 노출)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleDeny = () => {
    const base = localePrefixMap[locale];
    router.push(base === "/" ? "/exit" : `${base}/exit`);
  };

  // 포커스 트랩 — 패널 내부에서만 순환
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea",
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="age-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      onKeyDown={handleKeyDown}
    >
      <div className="age-gate__panel" ref={panelRef} tabIndex={-1}>
        <Image
          className="age-gate__logo"
          src="/images/logo/logo_all_W_KR.png"
          alt="Muse de Marée"
          width={288}
          height={277}
          priority
        />
        <span className="age-gate__rule" aria-hidden="true" />
        <h2 className="age-gate__title" id="age-gate-title">
          {copy.title}
        </h2>
        <p className="age-gate__desc" id="age-gate-desc">
          {copy.body.split("\n").map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>
        <div className="age-gate__actions">
          <button
            type="button"
            className="age-gate__btn age-gate__btn--confirm"
            onClick={grantAccess}
          >
            {copy.confirm}
          </button>
          <button
            type="button"
            className="age-gate__btn age-gate__btn--deny"
            onClick={handleDeny}
          >
            {copy.deny}
          </button>
        </div>
        <div className="age-gate__warning" role="note">
          <span className="age-gate__warning-label">{copy.warningLabel}</span>
          <span className="age-gate__warning-text">{copy.warning}</span>
        </div>
      </div>
    </div>
  );
}
