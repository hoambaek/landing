import type { Metadata } from "next";
import AgeExit from "@/components/legal/AgeExit";
import { exitCopy } from "@/content/age-gate";

export const metadata: Metadata = {
  title: exitCopy.en.metaTitle,
  description: exitCopy.en.metaDesc,
  robots: { index: false, follow: false },
};

export default function ExitPageEn() {
  return <AgeExit locale="en" />;
}
