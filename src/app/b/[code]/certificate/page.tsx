import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchBottleRecord, fetchBottleOwner } from "../../_lib/data";
import { BOTTLE_LANG_COOKIE, parseBottleLocale } from "../../_lib/locale";
import { buildCertCard } from "../../_lib/cert-card";
import BottleCertificate from "../../_components/BottleCertificate";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

export default async function BottleCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [data, owner, jar] = await Promise.all([fetchBottleRecord(code), fetchBottleOwner(code), cookies()]);

  if (!data) return <BottleNotFound />;
  /* 소유자가 없는 소유 인증서는 발급하지 않는다. 이름 자리에 안내 문구를 넣어
     빈 증서를 그리고 있었는데, 서명까지 붙은 문서라 저장하면 그대로 남는다. */
  if (!owner) redirect(`/b/${code}`);
  const initialLocale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);

  /* 이름은 등록자가 인증서용으로 정한 공개값이다 — 소유자 세션 여부와 무관하게 같다
     (예전에는 세션이 있으면 원본을 다시 읽었지만 공개 조회와 같은 값이라 왕복만 늘었다).
     서명은 비밀키 미설정이면 null — 카드가 미세 문자 줄을 숨긴다(없는 보증을 그리지 않는다). */
  const card = buildCertCard(code, data, owner);

  return <BottleCertificate code={code} data={data} card={card} initialLocale={initialLocale} />;
}
