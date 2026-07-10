import LetterShell from "./LetterShell";
import BrandBookForm from "./BrandBookForm";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

/**
 * 브랜드 소개서 레터 본체. `/brand-book`(ko)·`/en/brand-book`·`/fr/brand-book` 라우트가 locale을 넘겨 재사용한다.
 */
export default async function BrandBookLetter({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  return (
    <LetterShell
      theme="brand"
      image="/images/letter/top-03-brand.webp"
      imageAlt={dict.forms.brandBook.imageAlt}
      locale={locale}
      headerDict={dict.header}
      footerDict={dict.footer}
    >
      <BrandBookForm dict={dict.forms.brandBook} common={dict.forms.common} locale={locale} />
    </LetterShell>
  );
}
