import type { Metadata } from "next";
import AgeExit from "@/components/legal/AgeExit";
import { exitCopy } from "@/content/age-gate";

export const metadata: Metadata = {
  title: exitCopy.fr.metaTitle,
  description: exitCopy.fr.metaDesc,
  alternates: { canonical: "/fr/exit" },
  robots: { index: false, follow: false },
};

export default function ExitPageFr() {
  return <AgeExit locale="fr" />;
}
