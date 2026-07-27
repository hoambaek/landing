import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchBottleRecord, fetchBottleOwner } from "../../_lib/data";
import { BOTTLE_LANG_COOKIE, parseBottleLocale } from "../../_lib/locale";
import BottleRecord from "../../_components/BottleRecord";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

export default async function BottleRecordPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [data, owner, jar] = await Promise.all([
    fetchBottleRecord(code),
    fetchBottleOwner(code),
    cookies(),
  ]);

  if (!data) return <BottleNotFound />;
  /* 소유 등록 전에는 기록을 열지 않는다 — 진입 화면이 "전체 숙성 기록은 소유 등록 후
     열립니다"라고 약속한 자리다. 주소를 직접 쳐서 들어오면 그 약속이 무너지고,
     등록할 이유도 함께 사라진다. 코드는 맞으므로 404가 아니라 등록할 수 있는
     진입 화면으로 돌려보낸다. */
  if (!owner) redirect(`/b/${code}`);
  /* 앞 화면에서 고른 언어를 서버에서 읽어 첫 렌더부터 맞춘다 */
  const initialLocale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);
  return <BottleRecord data={data} ownerName={owner?.name ?? null} initialLocale={initialLocale} />;
}
