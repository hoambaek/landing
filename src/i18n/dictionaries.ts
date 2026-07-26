import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries = {
  ko: () => import("./messages/ko.json").then((m) => m.default),
  en: () => import("./messages/en.json").then((m) => m.default),
  fr: () => import("./messages/fr.json").then((m) => m.default),
  ja: () => import("./messages/ja.json").then((m) => m.default),
} as const;

export type { Dictionary };

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]() as Promise<Dictionary>;
}
