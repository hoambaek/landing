import { cookies } from "next/headers";
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
  /* 앞 화면에서 고른 언어를 서버에서 읽어 첫 렌더부터 맞춘다 */
  const initialLocale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);
  return <BottleRecord data={data} ownerName={owner?.name ?? null} initialLocale={initialLocale} />;
}
