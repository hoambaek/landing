import { cookies } from "next/headers";
import {
  fetchBottleRecord,
  fetchBottleOwner,
  fetchBottleOwnerRaw,
  fetchOwnedBottles,
} from "../../_lib/data";
import { BOTTLE_LANG_COOKIE, parseBottleLocale } from "../../_lib/locale";
import { getOwnerSession } from "../../_lib/owner-auth";
import BottleOwnerManage from "../../_components/BottleOwnerManage";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

export default async function BottleOwnerPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  /* ownerRaw는 서버 안에서만 쓴다 — 소장품을 묶는 기준 이메일이 필요해서다.
     클라이언트로 내려가는 것은 인증을 통과했을 때의 ownerFull뿐이다. */
  const [data, ownerMasked, ownerRaw, session, jar] = await Promise.all([
    fetchBottleRecord(code),
    fetchBottleOwner(code),
    fetchBottleOwnerRaw(code),
    getOwnerSession(code),
    cookies(),
  ]);

  if (!data) return <BottleNotFound />;

  /* 언어 선택기가 없는 화면 — 앞 화면(/b 공통 쿠키)에서 고른 언어를 그대로 따른다 */
  const locale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);

  const authed = !!session;

  /* 소장품 목록은 인증 없이 보인다. 여기 실리는 값은 병 번호·제품·수심·기간뿐으로,
     각 병의 인증서가 이미 공개하는 범위와 같다. 이메일 원본은 계속 인증 뒤에만 열린다. */
  const ownedBottles = ownerRaw?.email ? await fetchOwnedBottles(ownerRaw.email) : [];

  return (
    <BottleOwnerManage
      code={code}
      data={data}
      ownerMasked={ownerMasked}
      authed={authed}
      ownerFull={authed && ownerRaw ? { name: ownerRaw.name, email: ownerRaw.email } : null}
      ownedBottles={ownedBottles}
      locale={locale}
    />
  );
}
