import type { Metadata } from "next";
import PartnerLetter from "@/components/forms/PartnerLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("ja", "partner", "/ja/partner");
}

export default function PartnerPageJa() {
  return <PartnerLetter locale="ja" />;
}
