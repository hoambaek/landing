import { fetchBottleRecord } from "../../_lib/data";
import BottleTransferAccept from "../../_components/BottleTransferAccept";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

export default async function BottleTransferPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { code } = await params;
  const { token } = await searchParams;
  const data = await fetchBottleRecord(code);

  if (!data) return <BottleNotFound />;
  return <BottleTransferAccept code={code} token={token ?? ""} serial={data.bottle.serial} />;
}
