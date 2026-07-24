import { createHash } from "node:crypto";
import { fetchBottleRecord, fetchBottleOwner, fetchBottleOwnerRaw } from "../../_lib/data";
import { getOwnerSession } from "../../_lib/owner-auth";
import BottleCertificate from "../../_components/BottleCertificate";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

/** 인증서 ID — MDM-{입수연도}-{병번호 4자리}. 병번호 없으면 코드 앞 4자리. */
function makeCertId(year: string, serial: number | null, code: string): string {
  const tail = serial !== null ? String(serial).padStart(4, "0") : code.slice(0, 4).toUpperCase();
  return `MDM-${year}-${tail}`;
}

/** 콘텐츠 해시(표시용) — 안정 필드의 SHA-256 앞 16자리를 4자리씩 묶어 표기. */
function makeSignature(code: string, serial: number | null, productId: string): string {
  const hex = createHash("sha256").update(`${code}|${serial ?? "-"}|${productId}`).digest("hex").toUpperCase();
  return hex.slice(0, 16).replace(/(.{4})(.{4})(.{4})(.{4})/, "$1 $2 $3 $4");
}

export default async function BottleCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [data, owner, session] = await Promise.all([
    fetchBottleRecord(code),
    fetchBottleOwner(code),
    getOwnerSession(code),
  ]);

  if (!data) return <BottleNotFound />;

  const ownerNameFull = session ? (await fetchBottleOwnerRaw(code))?.name ?? null : null;

  const year = data.aging.immersion ? data.aging.immersion.slice(0, 4) : String(new Date().getFullYear());
  const certId = makeCertId(year, data.bottle.serial, code);
  const signature = makeSignature(code, data.bottle.serial, data.bottle.productId);

  return (
    <BottleCertificate
      code={code}
      data={data}
      owner={owner}
      ownerNameFull={ownerNameFull}
      certId={certId}
      signature={signature}
    />
  );
}
