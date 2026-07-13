import { NextResponse } from "next/server";
import { getOceanObservations } from "@/lib/ocean-observations";

/** 메뉴 오버레이 REC 라인용 실측 수온 — 랜딩 Living Record와 동일 소스(getOceanObservations, 1시간 캐시) */
export async function GET() {
  const ocean = await getOceanObservations().catch(() => null);
  return NextResponse.json(
    { seaTemp: ocean?.seaTemp?.latest ?? null },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
