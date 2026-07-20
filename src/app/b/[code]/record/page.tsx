import { fetchBottleRecord } from "../../_lib/data";
import BottleRecord from "../../_components/BottleRecord";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

export default async function BottleRecordPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await fetchBottleRecord(code);

  if (!data) return <BottleNotFound />;
  return <BottleRecord data={data} />;
}
