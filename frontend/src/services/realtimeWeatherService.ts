const REAL_TIME_ENDPOINT = 'https://realtime.vandetivigen.dk/api/real-time';
const KMH_TO_MS = 1000 / 3600;

export const SENSOR_IDS = {
  BEAUFORT_SCALE: 'sensor.tempest_st_00023723_beaufort_scale',
  SEA_LEVEL_PRESSURE: 'sensor.tempest_st_00023723_sea_level_pressure',
  STATION_PRESSURE: 'sensor.tempest_st_00023723_station_pressure',
  UV_INDEX: 'sensor.tempest_st_00023723_uv_index',
  WIND_BEARING_AVG: 'sensor.tempest_st_00023723_wind_bearing_avg',
  WIND_DIRECTION_AVG: 'sensor.tempest_st_00023723_wind_direction_avg',
  WIND_GUST: 'sensor.tempest_st_00023723_wind_gust',
  WIND_SPEED_AVG: 'sensor.tempest_st_00023723_wind_speed_avg',
} as const;

export type SensorId = typeof SENSOR_IDS[keyof typeof SENSOR_IDS];

export interface SensorAttributes {
  state_class?: string;
  attribution?: string;
  description?: string;
  icon?: string;
  friendly_name?: string;
  device_class?: string;
  unit_of_measurement?: string;
  max_day?: string;
  max_day_time?: string;
  max_month?: string;
  max_month_time?: string;
  max_all?: string;
  max_all_time?: string;
  min_day?: string;
  min_day_time?: string;
  min_month?: string;
  min_month_time?: string;
  min_all?: string;
  min_all_time?: string;
  [key: string]: string | undefined;
}

export interface RealTimeSensor {
  id: string;
  state: string;
  lastChanged: string;
  lastUpdated: string;
  attributes: SensorAttributes;
  friendlyName: string;
}

export interface RealTimeResponse {
  refreshedAt: string;
  sensors: RealTimeSensor[];
  total: number;
}

export type SensorMap = Partial<Record<SensorId, RealTimeSensor>>;

export interface WindConditions {
  direction: string;
  bearingDegrees: number;
  speedMs: number;
  gustMs: number | null;
  refreshedAt: string;
}

export type UvLevel = 'safe' | 'aware' | 'extreme';

export interface UvConditions {
  index: number;
  level: UvLevel;
  refreshedAt: string;
}

export interface AtmosphericConditions {
  wind: WindConditions;
  uv: UvConditions;
}

export async function fetchRealTimeData(): Promise<RealTimeResponse> {
  const response = await fetch(REAL_TIME_ENDPOINT, {
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Wind API responded with ${response.status}`);
  }

  return response.json();
}

export async function fetchAtmosphericConditions(): Promise<AtmosphericConditions> {
  const payload = await fetchRealTimeData();
  const sensors = indexSensors(payload.sensors);

  const bearing = parseNumberSensor(sensors[SENSOR_IDS.WIND_BEARING_AVG]);
  const direction = sensors[SENSOR_IDS.WIND_DIRECTION_AVG]?.state;
  const speedKmh = parseNumberSensor(sensors[SENSOR_IDS.WIND_SPEED_AVG]);
  const gustKmh = parseNumberSensor(sensors[SENSOR_IDS.WIND_GUST]);
  const uvIndex = parseNumberSensor(sensors[SENSOR_IDS.UV_INDEX]);

  if (bearing === null || !direction || speedKmh === null) {
    throw new Error('Wind data missing required sensors');
  }

  if (uvIndex === null) {
    throw new Error('UV index sensor missing');
  }

  return {
    wind: {
      direction,
      bearingDegrees: bearing,
      speedMs: Number((speedKmh * KMH_TO_MS).toFixed(2)),
      gustMs: gustKmh === null ? null : Number((gustKmh * KMH_TO_MS).toFixed(2)),
      refreshedAt: payload.refreshedAt,
    },
    uv: {
      index: Number(uvIndex.toFixed(1)),
      level: classifyUvIndex(uvIndex),
      refreshedAt: payload.refreshedAt,
    },
  };
}

function indexSensors(sensors: RealTimeSensor[]): SensorMap {
  return sensors.reduce<SensorMap>((acc, sensor) => {
    if (isSensorId(sensor.id)) {
      acc[sensor.id] = sensor;
    }
    return acc;
  }, {});
}

function isSensorId(id: string): id is SensorId {
  return (Object.values(SENSOR_IDS) as string[]).includes(id);
}

function parseNumberSensor(sensor?: RealTimeSensor): number | null {
  if (!sensor) return null;
  const value = Number(sensor.state);
  return Number.isFinite(value) ? value : null;
}

function classifyUvIndex(index: number): UvLevel {
  if (index <= 2) return 'safe';
  if (index <= 7) return 'aware';
  return 'extreme';
}
