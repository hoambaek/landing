import type ko from "./messages/ko.json";

/** ko.json 구조를 카피 딕셔너리의 단일 진실 원천으로 삼는다 (클라이언트/서버 공용 타입) */
export type Dictionary = typeof ko;
