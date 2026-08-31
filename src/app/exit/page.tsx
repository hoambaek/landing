import type { Metadata } from "next";
import AgeExit from "@/components/legal/AgeExit";
import { exitCopy } from "@/content/age-gate";

export const metadata: Metadata = {
  title: exitCopy.ko.metaTitle,
  description: exitCopy.ko.metaDesc,
  alternates: { canonical: "/exit" },
  robots: { index: false, follow: false },
};

export default function ExitPage() {
  return <AgeExit locale="ko" />;
}
