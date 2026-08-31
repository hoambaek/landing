import type { Metadata } from "next";
import BrandBookLetter from "@/components/forms/BrandBookLetter";
import { buildFormMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildFormMetadata("ko", "brandBook", "/brand-book");
}

export default function BrandBookPage() {
  return <BrandBookLetter locale="ko" />;
}
