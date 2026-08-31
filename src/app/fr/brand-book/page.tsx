import type { Metadata } from "next";
import BrandBookLetter from "@/components/forms/BrandBookLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("fr", "brandBook", "/fr/brand-book");
}

export default function BrandBookPageFr() {
  return <BrandBookLetter locale="fr" />;
}
