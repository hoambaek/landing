import LetterShell from "./LetterShell";
import InviteForm from "./InviteForm";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

/**
 * 초대 신청 레터 본체. `/invite`(ko)·`/en/invite`·`/fr/invite` 라우트가 locale을 넘겨 재사용한다.
 * 딕셔너리를 서버에서 로드해 셸·폼에 조각으로 전달한다.
 */
export default async function InviteLetter({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  return (
    <LetterShell
      theme="invite"
      image="/images/letter/top-01-invite.webp"
      imageAlt={dict.forms.invite.imageAlt}
      locale={locale}
      headerDict={dict.header}
      footerDict={dict.footer}
    >
      <InviteForm dict={dict.forms.invite} common={dict.forms.common} />
    </LetterShell>
  );
}
