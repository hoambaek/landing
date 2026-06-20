import type { Metadata } from "next";
import MeetupView from "./MeetupView";

export const metadata: Metadata = {
  title: "Muse de Marée — 바다에서 숙성하는 브랜드",
  description:
    "바다의 시간을 기록하는 브랜드. 해저 숙성 샴페인과 전통 수중양법(水中釀法). 유통 파트너를 위한 채널 제안.",
  alternates: { canonical: "/meetup" },
  robots: { index: false, follow: false },
};

export default function MeetupPage() {
  return <MeetupView />;
}
