import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchBottleRecord, fetchBottleOwner, fetchBottleOwnerRaw } from "../../_lib/data";
import { BOTTLE_LANG_COOKIE, parseBottleLocale } from "../../_lib/locale";
import { getOwnerSession, signCertificate } from "../../_lib/owner-auth";
import { immersionYear } from "../../_lib/duration";
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
  /* 소유자가 없는 소유 인증서는 발급하지 않는다. 이름 자리에 안내 문구를 넣어
     빈 증서를 그리고 있었는데, 서명까지 붙은 문서라 저장하면 그대로 남는다. */
  if (!owner) redirect(`/b/${code}`);
  const initialLocale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);

  const ownerNameFull = session ? (await fetchBottleOwnerRaw(code))?.name ?? null : null;

  const certId = makeCertId(immersionYear(data.aging.immersion), data.bottle.serial, code);
  /* 비밀키 미설정이면 null — 서명 블록을 숨긴다(없는 보증을 그리지 않는다) */
  const signature = signCertificate(code, data.bottle.serial, data.bottle.productId);

  return (
    <BottleCertificate
      code={code}
      data={data}
      owner={owner}
      ownerNameFull={ownerNameFull}
      ownerNameLatin={owner?.nameLatin ?? null}
      certId={certId}
      signature={signature}
      initialLocale={initialLocale}
    />
  );
}
