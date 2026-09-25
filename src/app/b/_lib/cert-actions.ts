"use server";

/**
 * 등록 완료(Paper 02)에서 발급된 인증서 카드를 받아오는 서버 액션.
 *
 * 입장 페이지는 첫 화면이 가벼워야 해서(TTFB) 해양 관측 질의를 하지 않는다.
 * 카드의 문양은 그 관측(주간 수온)으로 그려지므로, 등록이 끝난 뒤 이 액션으로 받는다.
 * 카드가 떠오르는 연출(1.2s)이 이 왕복을 덮는다.
 *
 * 소유 등록이 없는 병에는 카드를 주지 않는다 — 인증서 페이지와 같은 조건이다
 * (소유자 없는 증서를 그리지 않는다). 이름은 공개값이고 이메일은 싣지 않는다.
 */

import { fetchBottleOwner, fetchBottleRecord } from "./data";
import { buildCertCard, type CertCardData } from "./cert-card";

const NFC_RE = /^[A-Za-z0-9]{4,12}$/;

export async function fetchIssuedCertificate(code: string): Promise<CertCardData | null> {
  if (!NFC_RE.test(code ?? "")) return null;
  const [data, owner] = await Promise.all([fetchBottleRecord(code), fetchBottleOwner(code)]);
  if (!data || !owner) return null;
  return buildCertCard(code, data, owner);
}
