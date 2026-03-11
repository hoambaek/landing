/** DataArchiveSection — Server Component with cached data fetch */
import { unstable_cache } from "next/cache";
import {
  fetchOceanData30Days,
  calculateWaterPressure,
  type OceanDataDaily,
} from "@/lib/supabase";
import CTALink from "@/components/ui/CTALink";
import DataArchiveClient from "./DataArchiveClient";
import DataMetricsClient from "./DataMetricsClient";

const METRICS = [
  { key: "sea_temperature_avg", label: "수온", unit: "°C", color: "#E8E5E1", decimals: 1 },
  { key: "current_velocity_avg", label: "해류 속도", unit: "m/s", color: "#DDDAD5", decimals: 2 },
  { key: "current_direction_dominant", label: "해류 방향", unit: "°", color: "#C8C4BE", decimals: 0 },
  { key: "wave_height_avg", label: "파고", unit: "m", color: "#F0EDE8", decimals: 1 },
  { key: "wave_period_avg", label: "파주기", unit: "s", color: "#D2CFC9", decimals: 1 },
  { key: "water_pressure", label: "수압", unit: "atm", color: "#B8B4AE", decimals: 2 },
] as const;

function getLatestValue(
  data: OceanDataDaily[],
  key: string,
  depth: number,
): number | null {
  if (data.length === 0) return null;
  const latest = data[data.length - 1];
  if (key === "water_pressure") {
    return calculateWaterPressure(
      depth,
      latest.surface_pressure_avg ?? undefined,
    );
  }
  return (latest as unknown as Record<string, number | null>)[key] ?? null;
}

const getCachedOceanData = unstable_cache(
  fetchOceanData30Days,
  ["ocean-data-30days"],
  { revalidate: 3600 },
);

export default async function DataArchiveSection() {
  const data = await getCachedOceanData();
  const depth = 30;
  const lastUpdate = data.length > 0 ? data[data.length - 1].date : null;

  return (
    <section id="data-archive" className="s-data" aria-labelledby="data-label">
      <div className="container">
        <h2
          className="s-data__title reveal reveal-delay-1"
          id="data-label"
        >
          living data<span className="dot">.</span>
        </h2>
        <div className="s-data__statements reveal reveal-delay-1">
          <p className="s-data__statement-block">
            <mark className="s-data__highlight">바다를 읽고, 시간을 설계합니다.</mark>
          </p>
          <p className="s-data__statement-block">
            온도, 해류, 파도, 수압.
            <br />
            바다가 보내는 모든 신호를 기록합니다.
          </p>
          <p className="s-data__statement-block">
            그 기록 위에서
            <br />
            숙성의 시간을 예측합니다.
          </p>
        </div>

        <p className="s-data__section-note reveal reveal-delay-2">
          지금, 바다의 기록
        </p>
        <DataMetricsClient
          metrics={METRICS.map((m) => ({
            key: m.key,
            label: m.label,
            unit: m.unit,
            color: m.color,
            decimals: m.decimals,
            value: getLatestValue(data, m.key, depth),
          }))}
        />

        {data.length > 1 && (
          <DataArchiveClient
            data={data}
            depth={depth}
            lastUpdate={lastUpdate}
          />
        )}

        <div className="s-data__cta reveal">
          <CTALink href="/data" variant="dark">
            바다의 기록 보기
          </CTALink>
        </div>
      </div>
    </section>
  );
}
