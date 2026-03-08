import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Build 시점에 env 없으면 null — graceful fallback */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface OceanDataDaily {
  date: string;
  sea_temperature_avg: number | null;
  current_velocity_avg: number | null;
  current_direction_dominant: number | null;
  wave_height_avg: number | null;
  wave_period_avg: number | null;
  surface_pressure_avg: number | null;
  depth: number;
}

export async function fetchOceanData30Days(): Promise<OceanDataDaily[]> {
  if (!supabase) return [];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('ocean_data_daily')
    .select('date, sea_temperature_avg, current_velocity_avg, current_direction_dominant, wave_height_avg, wave_period_avg, surface_pressure_avg, depth')
    .gte('date', startDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching ocean data:', error);
    return [];
  }

  return data || [];
}

/** 수압 계산: depth(m) 기준 */
export function calculateWaterPressure(depth: number, surfacePressure?: number): number {
  const seawaterDensity = 1025;
  const gravity = 9.80665;
  const surfaceAtm = surfacePressure ? surfacePressure / 1013.25 : 1;
  return surfaceAtm + (seawaterDensity * gravity * depth) / 101325;
}
