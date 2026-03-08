/** DataArchiveSection — Server Component with cached data fetch */
import { unstable_cache } from "next/cache";
import {
  fetchOceanData30Days,
  calculateWaterPressure,
  type OceanDataDaily,
} from "@/lib/supabase";
import CTALink from "@/components/ui/CTALink";
import DataArchiveClient from "./DataArchiveClient";

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
            단순히 바다에 넣은 것이 아니다.
            <br />
            <mark className="s-data__highlight">설계된 것이다.</mark>
          </p>
          <p className="s-data__statement-block">
            지상의 셀러가 만들 수 없는 조건을
            <br />
            바다가 만든다.
          </p>
        </div>

        <p className="s-data__section-note reveal reveal-delay-2">
          현재 바다의 실측값
        </p>
        <div className="s-data__grid reveal reveal-delay-2">
          {METRICS.map((m, i) => {
            const val = getLatestValue(data, m.key, depth);
            return (
              <div
                key={m.key}
                className="s-data__point"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <p className="s-data__number" style={{ color: m.color }}>
                  {val !== null ? val.toFixed(m.decimals) : "—"}
                  <span className="s-data__unit">{m.unit}</span>
                </p>
                <p className="s-data__metric-label">{m.label}</p>
              </div>
            );
          })}
        </div>

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
