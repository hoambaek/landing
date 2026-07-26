import HtmlLang from "@/components/HtmlLang";
import Link from "next/link";
import { exitCopy } from "@/content/age-gate";
import { localePrefixMap, type Locale } from "@/i18n/config";

/**
 * 미성년(19세 미만) 안내 페이지 — 연령 게이트에서 "아니요" 선택 시 이동.
 * not-found와 동일한 다크 편집형 언어를 공유한다.
 */
export default function AgeExit({ locale }: { locale: Locale }) {
  const copy = exitCopy[locale];
  const home = localePrefixMap[locale];
  return (
    <div className="age-exit">
      <HtmlLang locale={locale} />
      <div className="age-exit__inner">
        <span className="age-exit__eyebrow">{copy.eyebrow}</span>
        <h1 className="age-exit__title">{copy.title}</h1>
        <p className="age-exit__desc">
          {copy.body.split("\n").map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>
        <Link href={home} className="age-exit__back">
          {copy.back}
        </Link>
      </div>
    </div>
  );
}
