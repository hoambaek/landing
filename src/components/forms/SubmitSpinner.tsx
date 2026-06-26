/** lottie.host 임베드 URL — 원본 모션 그대로 렌더 */
const LOTTIE_EMBED =
  "https://lottie.host/embed/7d9b8c5d-a26d-4f7d-a06c-d3dc3241a0c3/1l1wvcwHTt.lottie";

interface SubmitSpinnerProps {
  /** 애니메이션 렌더 크기(px). 프레임 여백 때문에 크게 잡고 버튼으로 크롭. 기본 96 */
  size?: number;
  /** 레이아웃 가로 폭(px) — 버튼 너비에 미치는 영향. 기본 44 */
  boxWidth?: number;
  /** 어두운 배경 위에서 밝게 보이도록 흰색 변환 (기본 true) */
  invert?: boolean;
}

/**
 * 제출 버튼 "전송 중" 스피너 (lottie.host embed).
 * 레이아웃 높이는 18px로 고정해 버튼 크기를 키우지 않고,
 * 애니메이션은 절대배치로 크게 렌더한 뒤 버튼 영역(overflow:hidden)으로 크롭한다.
 */
export default function SubmitSpinner({
  size = 96,
  boxWidth = 44,
  invert = true,
}: SubmitSpinnerProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        display: "inline-block",
        width: boxWidth,
        height: 18,
        verticalAlign: "middle",
      }}
    >
      <iframe
        src={LOTTIE_EMBED}
        title=""
        scrolling="no"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
          border: "none",
          background: "transparent",
          pointerEvents: "none",
          filter: invert ? "brightness(0) invert(1)" : undefined,
        }}
      />
    </span>
  );
}
