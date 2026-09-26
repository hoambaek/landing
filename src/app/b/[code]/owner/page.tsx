import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export default async function BottleOwnerPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ verify?: string; otp?: string }>;
}) {
  const [{ code }, sp] = await Promise.all([params, searchParams]);
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
  /* 관리할 소유 정보가 아직 없다 — 등록부터 하도록 진입 화면으로 돌려보낸다 */
  if (!ownerMasked) redirect(`/b/${code}`);

  /* 앞 화면(/b 공통 쿠키)에서 고른 언어를 따른다. 이 화면의 「언어」 행(03D)도 같은 쿠키를 쓴다 */
  const locale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);

  const authed = !!session;
  /* 확인 링크(메일 「본인 인증하기」) — 03B를 열고 화면이 스스로 인증한다(BottleOwnerManage).
     여기(서버 GET)서는 인증하지 않는다: 메일 보안 검사기가 링크를 미리 열어도 코드가 소모되지 않게.
     여섯 자리 숫자만 받는다 */
  const prefillCode = !authed && /^\d{6}$/.test(sp.otp ?? "") ? sp.otp! : null;

  /* 소장품 목록은 인증 없이 보인다. 여기 실리는 값은 병 번호·제품·수심·기간뿐으로,
     각 병의 인증서가 이미 공개하는 범위와 같다. 이메일 원본은 계속 인증 뒤에만 열린다. */
  const ownedBottles = ownerRaw?.email ? await fetchOwnedBottles(ownerRaw.email) : [];

  return (
    <BottleOwnerManage
      code={code}
      data={data}
      ownerMasked={ownerMasked}
      authed={authed}
      ownerFull={
        authed && ownerRaw
          ? {
              name: ownerRaw.name,
              email: ownerRaw.email,
              givenLatin: ownerRaw.givenLatin,
              familyLatin: ownerRaw.familyLatin,
            }
          : null
      }
      ownedBottles={ownedBottles}
      locale={locale}
      /* ?verify=1 — 본인 인증(03B)부터 연다. 인증된 세션이면 열 이유가 없다.
         코드는 자동으로 보내지 않는다(누르면 보낸다). 확인 링크(prefillCode)는 받은 코드로 스스로 인증한다 */
      startVerify={(sp.verify === "1" || !!prefillCode) && !authed}
      prefillCode={prefillCode}
    />
  );
}
