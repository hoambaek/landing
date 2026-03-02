export interface Section {
  id: string;
  title: string;
  titleKo: string;
}

export const SECTIONS: Section[] = [
  { id: "the-void", title: "The Void", titleKo: "공허" },
  { id: "observation", title: "Observation", titleKo: "관찰" },
  { id: "data-archive", title: "Data Archive", titleKo: "데이터 기록" },
  { id: "the-maker", title: "The Maker", titleKo: "만든 이" },
  { id: "archive", title: "Archive", titleKo: "기록 보관소" },
  { id: "ocean-circle", title: "Ocean Circle", titleKo: "바다의 원" },
  { id: "professionals", title: "For Professionals", titleKo: "전문가" },
];
