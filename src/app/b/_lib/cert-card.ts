import "server-only";
import type { BottleOwner, BottleRecordData } from "./data";
import { PRODUCT_META } from "./copy";
import { agingMonths, immersionYear } from "./duration";
import { signCertificate } from "./owner-auth";
import { patternTemps } from "./cert-pattern";

/**
 * 인증서 카드 한 장에 필요한 값 — 화면(04)·발급(02)·기록 미리보기(03)·저장 PNG가
 * 모두 이 한 벌로 같은 카드를 그린다. 값은 전부 서버에서 확정해 내려보낸다.
 *
 * 이름은 등록자가 인증서용으로 정한 공개값이라 그대로 싣는다. 이메일은 싣지 않는다.
 */
export interface CertCardData {
  serial: number | null;
  total: number;
  productName: string;
  /** 입수 연도 — 배치가 없는 병은 null(없는 연도를 지어내지 않는다) */
  year: string | null;
  immersion: string | null;
  retrieval: string | null;
  depth: number;
  months: number;
  ownerName: string;
  ownerLatin: string | null;
  /** KST 달력 날짜 YYYY-MM-DD */
  registeredAt: string | null;
  certId: string;
  /** HMAC 서명(64자 hex). 비밀키 미설정이면 null — 미세 문자 줄을 숨긴다 */
  signature: string | null;
  /** 문양용 주간 수온. 관측이 없으면 코드로 시드한 대체 계열(항상 2점 이상) */
  temps: number[];
}

/** 인증서 번호 — MDM-{입수연도}-{병번호 4자리}. 병번호 없으면 코드 앞 4자리. */
export function makeCertId(immersion: string | null, serial: number | null, code: string): string {
  const tail = serial !== null ? String(serial).padStart(4, "0") : code.slice(0, 4).toUpperCase();
  return `MDM-${immersionYear(immersion)}-${tail}`;
}

export function buildCertCard(
  code: string,
  data: BottleRecordData,
  owner: Pick<BottleOwner, "name" | "nameLatin" | "registeredAt">,
): CertCardData {
  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  return {
    serial: data.bottle.serial,
    total: meta.quantity,
    productName: meta.name,
    year: data.aging.immersion ? immersionYear(data.aging.immersion) : null,
    immersion: data.aging.immersion,
    retrieval: data.aging.retrieval,
    depth: data.aging.depth,
    months: agingMonths(data.aging.immersion, data.aging.retrieval),
    ownerName: owner.name,
    ownerLatin: owner.nameLatin?.trim() || null,
    registeredAt: owner.registeredAt,
    certId: makeCertId(data.aging.immersion, data.bottle.serial, code),
    signature: signCertificate(code, data.bottle.serial, data.bottle.productId),
    temps: patternTemps(data.weeklyTemps, code),
  };
}
