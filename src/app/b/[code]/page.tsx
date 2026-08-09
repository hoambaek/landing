import { cookies } from "next/headers";
import { fetchBottleIdentity, fetchBottleOwner, fetchAgingBatch } from "../_lib/data";
import { PRODUCT_META } from "../_lib/copy";
import { BOTTLE_LANG_COOKIE, parseBottleLocale } from "../_lib/locale";
import BottleEntry from "../_components/BottleEntry";
import BottleNotFound from "../_components/BottleNotFound";

export const dynamic = "force-dynamic";

/**
 * 입장 페이지 — NFC 태그(musedemaree.com/b/{code})가 가장 먼저 여는 화면.
 * 이미 등록된 병이면 각인 화면(BottleInscription)을 먼저 띄운다 — 태그한 사람이
 * 가장 먼저 확인하려는 것은 "이 병이 누구의 것인가"이고, 등록 직후 본 화면과 같아야
 * 같은 문서로 읽힌다. 필름·Identity·Provenance는 그 아래에서 이어서 볼 수 있다.
 * 재등록 차단은 폼을 잠그는 것으로 충분하다(서버 액션에도 같은 가드가 있다).
 */
export default async function BottleEntryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  /* 셋 다 code 하나만 있으면 되므로 순차로 기다릴 이유가 없다.
     identity → owner를 줄줄이 await 하면 왕복이 그대로 더해진다(첫 화면 TTFB에 직결).
     코드가 없는 병이면 owner 질의 한 번이 헛돈다 — 그 대신 정상 진입이 왕복 하나만큼 빨라진다.
     무작위 코드 긁기는 proxy.ts의 코드 수 제한이 막는다. */
  const [identity, owner, jar] = await Promise.all([
    fetchBottleIdentity(code),
    /* 등록 행이 있으면 소유자가 있다. 이름은 등록자가 인증서용으로 정한 공개값이라 그대로 보여준다. */
    fetchBottleOwner(code),
    cookies(),
  ]);

  if (!identity) return <BottleNotFound />;

  const meta = PRODUCT_META[identity.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const initialLocale = parseBottleLocale(jar.get(BOTTLE_LANG_COOKIE)?.value);

  /* 등록 완료 화면의 제품 식별 캡션(입수 연차 · 숙성 기간)용 — 제품 마스터가 아니라
     배치에서 파생한다. 이 질의만 productId에 의존해 위 Promise.all에 넣을 수 없다.
     날짜 자체를 넘긴다: 기간 표기가 로케일을 타는데 언어는 클라이언트에서 바뀐다. */
  const batch = await fetchAgingBatch(identity.productId);

  return (
    <BottleEntry
      code={identity.nfcCode}
      productId={identity.productId}
      serial={identity.serial}
      total={meta.quantity}
      immersion={batch.immersion}
      retrieval={batch.retrieval}
      initialLocale={initialLocale}
      registeredTo={owner?.name ?? null}
      registeredToLatin={owner?.nameLatin ?? null}
      registered={!!owner}
    />
  );
}
