"use client";

/**
 * 01C — 필름 보기 (Paper "01C-가 · 01C-나"). 01B(이미 등록된 병)에서 "필름 보기"를 누르면
 * 입장 필름을 화면 전체로 한 번 튼다.
 * - 재생 중(01C-가): 좌상단 닫기, 우상단 사운드. 영상 위에는 그 둘만 둔다.
 * - 끝나면(01C-나): 검은 화면 가운데 다시 보기 + "돌아가기". 닫기와 뜻이 겹쳐 ×는 걷는다.
 * 방문자가 직접 눌러 여는 재생이라 소리를 켠 채 시작한다(입장 필름은 자동재생이라 무음 시작).
 * 브라우저가 소리 재생을 거절하면 무음으로 다시 튼다.
 */

import { useEffect, useRef, useState } from "react";
import styles from "./entry.module.css";
import ui from "./ui.module.css";
import type { EntryCopy } from "../_lib/copy";

export default function BottleFilm({
  src,
  copy,
  onClose,
}: {
  src: string;
  copy: EntryCopy;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [ended, setEnded] = useState(false);

  /* 소리를 켠 채 틀고, 거절되면 무음으로 — 둘 다 사용자 탭 직후라 대개 첫 시도가 통한다 */
  const play = (withSound: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = !withSound;
    v.play().catch(() => {
      v.muted = true;
      setSoundOn(false);
      void v.play().catch(() => {});
    });
  };

  useEffect(() => {
    play(true);
  }, []);

  /* Esc 리스너가 매 렌더 새로 걸리지 않게 닫기 함수는 ref로 든다 */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  /* 필름이 떠 있는 동안 뒤의 01B가 스크롤되지 않게, Esc로 닫을 수 있게 */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    const v = videoRef.current;
    if (v) v.muted = !next;
  };

  const replay = () => {
    setEnded(false);
    play(soundOn);
  };

  return (
    <div className={styles.filmOverlay} role="dialog" aria-modal="true" aria-label={copy.claimedFilm}>
      {/* 입장 필름과 같은 폭(최대 430px)에 담는다 — 데스크톱에서 칩이 창 양끝으로 흩어지지 않게 */}
      <div className={styles.filmOverlayFrame}>
        <video
          ref={videoRef}
          className={`${styles.filmVideo} ${ended ? styles.filmOverlayVideoEnded : ""}`}
          src={src}
          playsInline
          preload="auto"
          onEnded={() => setEnded(true)}
        />

        {ended ? (
          <div className={styles.filmEnd}>
            <button type="button" className={styles.filmEndReplay} onClick={replay} aria-label={copy.filmCaption}>
              <span className={styles.playBtn}>
                <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
                  <path d="M2 1.5 L16.5 10 L2 18.5 Z" fill="rgba(241,239,235,0.82)" />
                </svg>
              </span>
            </button>
            <button type="button" className={ui.linkD} onClick={onClose} autoFocus>
              {copy.filmBack}
            </button>
          </div>
        ) : (
          <>
            <button type="button" className={styles.filmClose} onClick={onClose} aria-label={copy.filmBack}>
              <span className={styles.soundChip}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="rgba(241,239,235,0.85)" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className={styles.soundToggle}
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Sound off" : "Sound on"}
            >
              <span className={styles.soundChip}>
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden>
                  <path d="M1 4.2h2.4L6.6 1.5v9L3.4 7.8H1z" fill="rgba(241,239,235,0.85)" />
                  {soundOn ? (
                    <path
                      d="M9 3.6c.8.7 1.2 1.5 1.2 2.4S9.8 7.7 9 8.4M10.8 1.8c1.3 1.1 2 2.6 2 4.2s-.7 3.1-2 4.2"
                      stroke="rgba(241,239,235,0.85)"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path d="M9 4l3.5 4M12.5 4L9 8" stroke="rgba(241,239,235,0.55)" strokeWidth="1" strokeLinecap="round" />
                  )}
                </svg>
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
