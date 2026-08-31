import type { Metadata } from "next";
import PartnerLetter from "@/components/forms/PartnerLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("ko", "partner", "/partner");
}

export default function PartnerPage() {
  return <PartnerLetter locale="ko" />;
}
