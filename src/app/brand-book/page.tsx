import type { Metadata } from "next";
import LetterShell from "@/components/forms/LetterShell";
import BrandBookForm from "@/components/forms/BrandBookForm";

export const metadata: Metadata = {
  title: "브랜드 소개서 — Brand Book | Muse de Marée",
  description: "바다가 쓴 시간의 기록. 브랜드 철학과 기록 시스템, 큐베 라인업, 파트너십 안내를 이메일로 보내드립니다.",
  robots: { index: false, follow: true },
};

export default function BrandBookPage() {
  return (
    <LetterShell theme="brand">
      <BrandBookForm />
    </LetterShell>
  );
}
