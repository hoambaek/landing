import { redirect } from "next/navigation";
import { fetchBottleIdentity, isBottleRegistered } from "../_lib/data";
import { PRODUCT_META } from "../_lib/copy";
import BottleEntry from "../_components/BottleEntry";
import BottleNotFound from "../_components/BottleNotFound";

export const dynamic = "force-dynamic";

/**
 * 입장 페이지 — NFC 태그(musedemaree.com/b/{code})가 가장 먼저 여는 화면.
 * 최초 등록 전에만 등록 폼을 보여준다. 이미 등록된 병은 기록 페이지로 바로 이동해
 * 재등록(소유자 덮어쓰기)을 막는다. 소유자 변경은 소유권 이전 흐름으로만 가능.
 */
export default async function BottleEntryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const identity = await fetchBottleIdentity(code);

  if (!identity) return <BottleNotFound />;

  if (await isBottleRegistered(code)) redirect(`/b/${code}/record`);

  const meta = PRODUCT_META[identity.productId] ?? PRODUCT_META.atomes_crochus_1y;

  return (
    <BottleEntry
      code={identity.nfcCode}
      productId={identity.productId}
      serial={identity.serial}
      total={meta.quantity}
    />
  );
}
