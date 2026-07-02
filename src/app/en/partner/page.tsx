import type { Metadata } from "next";
import PartnerLetter from "@/components/forms/PartnerLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("en", "partner");
}

export default function PartnerPageEn() {
  return <PartnerLetter locale="en" />;
}
