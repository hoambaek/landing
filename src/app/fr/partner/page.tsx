import type { Metadata } from "next";
import PartnerLetter from "@/components/forms/PartnerLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("fr", "partner");
}

export default function PartnerPageFr() {
  return <PartnerLetter locale="fr" />;
}
