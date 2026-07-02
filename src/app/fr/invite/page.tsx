import type { Metadata } from "next";
import InviteLetter from "@/components/forms/InviteLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("fr", "invite");
}

export default function InvitePageFr() {
  return <InviteLetter locale="fr" />;
}
