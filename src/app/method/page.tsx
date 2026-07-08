import type { Metadata } from "next";
import { METHOD_COPY } from "./copy";
import MethodView from "./MethodView";

/* 관측 데이터(Open-Meteo + KHOA)를 1시간 주기로 재생성 */
export const revalidate = 3600;

const t = METHOD_COPY.ko.meta;

export const metadata: Metadata = {
  title: t.title,
  description: t.description,
  alternates: {
    canonical: "/method",
    languages: { ko: "/method", en: "/en/method", fr: "/fr/method" },
  },
};

export default function MethodPage() {
  return <MethodView locale="ko" />;
}
