import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__inner">
        <span className="not-found__label">coming soon</span>
        <h1 className="not-found__title">준비중입니다.</h1>
        <p className="not-found__desc">
          더 나은 경험을 위해 준비하고 있습니다.
          <br />
          조금만 기다려 주세요.
        </p>
        <Link href="/" className="not-found__back">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
