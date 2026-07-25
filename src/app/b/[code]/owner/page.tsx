import { cookies } from "next/headers";
import { fetchBottleRecord, fetchBottleOwner, fetchBottleOwnerRaw } from "../../_lib/data";
import { BOTTLE_LANG_COOKIE, parseBottleLocale } from "../../_lib/locale";
import { getOwnerSession } from "../../_lib/owner-auth";
import BottleOwnerManage from "../../_components/BottleOwnerManage";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

export default async function BottleOwnerPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [data, ownerMasked, session, jar] = await Promise.all([
    fetchBottleRecord(code),
    fetchBottleOwner(code),
    getOwnerSession(code),
    cookies(),
  ]);

  if (!data) return <BottleNotFound />;

  /* 언어 선택기가 없는 화면 — 앞 화면(/b 공통 쿠키)에서 고른 언어를 그대로 따른다 */
  const locale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);

  const authed = !!session;
  const ownerFull = authed ? await fetchBottleOwnerRaw(code) : null;

  return (
    <BottleOwnerManage
      code={code}
      data={data}
      ownerMasked={ownerMasked}
      authed={authed}
      ownerFull={ownerFull ? { name: ownerFull.name, email: ownerFull.email } : null}
      locale={locale}
    />
  );
}
