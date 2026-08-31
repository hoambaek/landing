import type { Metadata } from "next";
import AgeExit from "@/components/legal/AgeExit";
import { exitCopy } from "@/content/age-gate";

export const metadata: Metadata = {
  title: exitCopy.ja.metaTitle,
  description: exitCopy.ja.metaDesc,
  alternates: { canonical: "/ja/exit" },
  robots: { index: false, follow: false },
};

export default function ExitPageJa() {
  return <AgeExit locale="ja" />;
}
