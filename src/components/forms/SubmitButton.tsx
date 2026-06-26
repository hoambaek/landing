"use client";

import SubmitSpinner from "./SubmitSpinner";

interface SubmitButtonProps {
  /** 기본 라벨 (예: "소개서 받기") */
  label: string;
  /** 전송 중 라벨 (기본 "전송 중") */
  sendingLabel?: string;
  /** 전송 중 여부 */
  sending: boolean;
  /** 스피너 크기(px) */
  spinnerSize?: number;
}

/**
 * 레터 폼 공용 제출 버튼.
 * idle 상태: 라벨 + 브래스 화살표 / 전송 중: 라벨 + Lottie 스피너.
 */
export default function SubmitButton({
  label,
  sendingLabel = "전송 중",
  sending,
  spinnerSize,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="s-letter__submit"
      disabled={sending}
      // 크게 렌더한 스피너 애니메이션을 버튼 영역으로 크롭 (버튼 크기 불변)
      style={{ overflow: "hidden" }}
    >
      <span className="s-letter__submit-label">{sending ? sendingLabel : label}</span>
      {sending ? (
        <SubmitSpinner size={spinnerSize} />
      ) : (
        <span className="s-letter__submit-arrow">›</span>
      )}
    </button>
  );
}
