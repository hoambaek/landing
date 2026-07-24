import { fetchBottleRecord, fetchBottleOwner, fetchBottleOwnerRaw } from "../../_lib/data";
import { getOwnerSession } from "../../_lib/owner-auth";
import BottleOwnerManage from "../../_components/BottleOwnerManage";
import BottleNotFound from "../../_components/BottleNotFound";

export const dynamic = "force-dynamic";

export default async function BottleOwnerPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [data, ownerMasked, session] = await Promise.all([
    fetchBottleRecord(code),
    fetchBottleOwner(code),
    getOwnerSession(code),
  ]);

  if (!data) return <BottleNotFound />;

  const authed = !!session;
  const ownerFull = authed ? await fetchBottleOwnerRaw(code) : null;

  return (
    <BottleOwnerManage
      code={code}
      data={data}
      ownerMasked={ownerMasked}
      authed={authed}
      ownerFull={ownerFull ? { name: ownerFull.name, email: ownerFull.email } : null}
    />
  );
}
