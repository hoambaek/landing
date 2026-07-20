import { fetchBottleIdentity } from "../_lib/data";
import { PRODUCT_META } from "../_lib/copy";
import BottleEntry from "../_components/BottleEntry";
import BottleNotFound from "../_components/BottleNotFound";

export const dynamic = "force-dynamic";

/**
 * 입장 페이지 — NFC 태그(musedemaree.com/b/{code})가 가장 먼저 여는 화면.
 * 로고 인트로 → 풀스크린 영상 → 감사·N° → 이름/이메일 등록 → "입장하기"로 기록 페이지(/record) 진입.
 */
export default async function BottleEntryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const identity = await fetchBottleIdentity(code);

  if (!identity) return <BottleNotFound />;

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
