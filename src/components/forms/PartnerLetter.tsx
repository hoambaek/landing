import LetterShell from "./LetterShell";
import PartnerForm from "./PartnerForm";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

/**
 * 파트너 문의 레터 본체. `/partner`(ko)·`/en/partner`·`/fr/partner` 라우트가 locale을 넘겨 재사용한다.
 */
export default async function PartnerLetter({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  return (
    <LetterShell
      theme="partner"
      image="/images/letter/top-02-partner.webp"
      imageAlt={dict.forms.partner.imageAlt}
      locale={locale}
      headerDict={dict.header}
      footerDict={dict.footer}
    >
      <PartnerForm dict={dict.forms.partner} common={dict.forms.common} locale={locale} />
    </LetterShell>
  );
}
