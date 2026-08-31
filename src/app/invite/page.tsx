import type { Metadata } from "next";
import InviteLetter from "@/components/forms/InviteLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("ko", "invite", "/invite");
}

export default function InvitePage() {
  return <InviteLetter locale="ko" />;
}
