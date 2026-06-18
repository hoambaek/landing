import type { Metadata } from "next";
import LetterShell from "@/components/forms/LetterShell";
import PartnerForm from "@/components/forms/PartnerForm";

export const metadata: Metadata = {
  title: "파트너 문의 | Partnership | Muse de Marée",
  description: "바다가 기록한 시간을, 당신의 식탁이 잇는다. 파인다이닝·럭셔리 호텔 바·프라이빗 셀러 파트너 문의.",
  robots: { index: false, follow: true },
};

export default function PartnerPage() {
  return (
    <LetterShell theme="partner" image="/images/letter/top-02-partner.webp" imageAlt="흰 장갑으로 따개비 병에 택을 다는 손">
      <PartnerForm />
    </LetterShell>
  );
}
