import type { Metadata } from "next";
import { METHOD_COPY } from "@/app/method/copy";
import MethodView from "@/app/method/MethodView";

/* 관측 데이터(Open-Meteo + KHOA)를 1시간 주기로 재생성 */
export const revalidate = 3600;

const t = METHOD_COPY.ja.meta;

export const metadata: Metadata = {
  title: t.title,
  description: t.description,
  alternates: {
    canonical: "/ja/method",
    languages: { ko: "/method", en: "/en/method", fr: "/fr/method", ja: "/ja/method" },
  },
};

export default function MethodPageJa() {
  return <MethodView locale="ja" />;
}
