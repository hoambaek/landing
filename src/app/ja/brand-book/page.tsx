import type { Metadata } from "next";
import BrandBookLetter from "@/components/forms/BrandBookLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("ja", "brandBook", "/ja/brand-book");
}

export default function BrandBookPageJa() {
  return <BrandBookLetter locale="ja" />;
}
