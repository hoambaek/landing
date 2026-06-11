import type { Metadata } from "next";
import LetterShell from "@/components/forms/LetterShell";
import InviteForm from "@/components/forms/InviteForm";

export const metadata: Metadata = {
  title: "초대 신청 — Ocean Cellar Privé | Muse de Marée",
  description: "인양을 가장 먼저 지켜보는 사람들. Ocean Cellar Privé 초대 신청.",
  robots: { index: false, follow: true },
};

export default function InvitePage() {
  return (
    <LetterShell theme="invite" image="/images/letter/top-01-invite.webp" imageAlt="빛기둥 속에서 인양되는 병">
      <InviteForm />
    </LetterShell>
  );
}
