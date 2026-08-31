import type { Metadata } from "next";
import InviteLetter from "@/components/forms/InviteLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("ja", "invite", "/ja/invite");
}

export default function InvitePageJa() {
  return <InviteLetter locale="ja" />;
}
