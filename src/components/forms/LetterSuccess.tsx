import Link from "next/link";
import { localePrefixMap, type Locale } from "@/i18n/config";

/**
 * 레터 폼 완료 상태 (Paper R3 "· 완료 상태" 3종 공용).
 * 혜택 블록은 그대로 두고 폼 자리만 금색 헤어라인 + 한 줄 + 안내 + "처음으로 돌아가기" 링크로 바꾼다.
 */
export default function LetterSuccess({
  line,
  note,
  backLabel,
  locale,
}: {
  line: string;
  note: string;
  backLabel: string;
  locale: Locale;
}) {
  return (
    <div className="s-letter__success" role="status">
      <span className="s-letter__success-rule" aria-hidden="true" />
      <p className="s-letter__success-line">{line}</p>
      <p className="s-letter__success-note">{note}</p>
      <Link href={localePrefixMap[locale]} className="s-letter__success-link">
        {backLabel}
      </Link>
    </div>
  );
}
