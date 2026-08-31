import type { Metadata } from "next";
import BrandBookLetter from "@/components/forms/BrandBookLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("en", "brandBook", "/en/brand-book");
}

export default function BrandBookPageEn() {
  return <BrandBookLetter locale="en" />;
}
