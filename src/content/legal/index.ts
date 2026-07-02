import type { LegalDoc } from "./types";
import { termsDoc } from "./terms";
import { privacyDoc } from "./privacy";
import { cookiesDoc } from "./cookies";

export type { LegalDoc } from "./types";

export const legalDocs = {
  terms: termsDoc,
  privacy: privacyDoc,
  cookies: cookiesDoc,
} satisfies Record<string, LegalDoc>;

export type LegalSlug = keyof typeof legalDocs;
