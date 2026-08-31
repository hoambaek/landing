import type { Metadata } from "next";
import InviteLetter from "@/components/forms/InviteLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("en", "invite", "/en/invite");
}

export default function InvitePageEn() {
  return <InviteLetter locale="en" />;
}
