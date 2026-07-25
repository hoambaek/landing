import { cookies } from "next/headers";
import { fetchBottleIdentity, fetchBottleOwner } from "../_lib/data";
import { PRODUCT_META } from "../_lib/copy";
import { BOTTLE_LANG_COOKIE, parseBottleLocale } from "../_lib/locale";
import BottleEntry from "../_components/BottleEntry";
import BottleNotFound from "../_components/BottleNotFound";

export const dynamic = "force-dynamic";

/**
 * 입장 페이지 — NFC 태그(musedemaree.com/b/{code})가 가장 먼저 여는 화면.
 * 등록 여부와 무관하게 늘 이 화면을 보여준다. 병은 선물·접대 자리에 놓여 여러 사람이 태그하는데,
 * 등록됐다고 바로 기록표로 넘겨버리면 필름·Identity·Provenance를 병당 한 번만 볼 수 있게 된다.
 * 재등록 차단은 폼을 잠그는 것으로 충분하다(서버 액션에도 같은 가드가 있다).
 */
export default async function BottleEntryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const identity = await fetchBottleIdentity(code);

  if (!identity) return <BottleNotFound />;

  /* 등록 행이 있으면 소유자가 있다 — 질의 한 번으로 둘 다 얻는다.
     이름은 등록자가 인증서용으로 정한 공개값이라 그대로 보여준다. */
  const owner = await fetchBottleOwner(code);

  const meta = PRODUCT_META[identity.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const initialLocale = parseBottleLocale((await cookies()).get(BOTTLE_LANG_COOKIE)?.value);

  return (
    <BottleEntry
      code={identity.nfcCode}
      productId={identity.productId}
      serial={identity.serial}
      total={meta.quantity}
      initialLocale={initialLocale}
      registeredTo={owner?.name ?? null}
      registered={!!owner}
    />
  );
}
