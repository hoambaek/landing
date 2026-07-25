import { cookies } from "next/headers";
import { fetchBottleRecord, fetchBottleOwner, fetchBottleOwnerRaw } from "../../_lib/data";
import { BOTTLE_LANG_COOKIE, parseBottleLocale } from "../../_lib/locale";
import { getOwnerSession, signCertificate } from "../../_lib/owner-auth";
import BottleCertificate from "../../_components/BottleCertificate";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

/** 인증서 ID — MDM-{입수연도}-{병번호 4자리}. 병번호 없으면 코드 앞 4자리. */
function makeCertId(year: string, serial: number | null, code: string): string {
  const tail = serial !== null ? String(serial).padStart(4, "0") : code.slice(0, 4).toUpperCase();
  return `MDM-${year}-${tail}`;
}

export default async function BottleCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [data, owner, session, jar] = await Promise.all([
    fetchBottleRecord(code),
    fetchBottleOwner(code),
    getOwnerSession(code),
    cookies(),
  ]);

  if (!data) return <BottleNotFound />;
  const initialLocale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);

  const ownerNameFull = session ? (await fetchBottleOwnerRaw(code))?.name ?? null : null;

  const year = data.aging.immersion ? data.aging.immersion.slice(0, 4) : String(new Date().getFullYear());
  const certId = makeCertId(year, data.bottle.serial, code);
  /* 비밀키 미설정이면 null — 서명 블록을 숨긴다(없는 보증을 그리지 않는다) */
  const signature = signCertificate(code, data.bottle.serial, data.bottle.productId);

  return (
    <BottleCertificate
      code={code}
      data={data}
      owner={owner}
      ownerNameFull={ownerNameFull}
      certId={certId}
      signature={signature}
      initialLocale={initialLocale}
    />
  );
}
