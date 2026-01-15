const REAL_TIME_ENDPOINT = 'https://realtime.vandetivigen.dk/api/real-time';
const KMH_TO_MS = 1000 / 3600;

export const SENSOR_IDS = {
  STATION_PRESSURE: 'sensor.gw2000a_relative_pressure',
  UV_INDEX: 'sensor.gw2000a_uv_index',
  WIND_BEARING_AVG: 'sensor.gw2000a_wind_direction_10m_avg',
  WIND_DIRECTION_AVG: 'sensor.tempest_st_00023723_wind_direction_avg',
  WIND_GUST: 'sensor.gw2000a_wind_gust',
  WIND_SPEED_AVG: 'sensor.gw2000a_wind_speed',
  AIR_TEMP: 'sensor.gw2000a_outdoor_temperature',
  AIR_HUMIDITY: 'sensor.gw2000a_humidity',
  AIR_TEMP_FEELS_LIKE: 'sensor.gw2000a_feels_like_temperature'
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

export interface AirConditions {
  temp: number;
  temp_feels_like: number;
  humidity: number;
}

export interface AtmosphericConditions {
  wind: WindConditions;
  uv: UvConditions;
  air: AirConditions;
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
  const speedKmh = parseNumberSensor(sensors[SENSOR_IDS.WIND_SPEED_AVG]);
  const gustKmh = parseNumberSensor(sensors[SENSOR_IDS.WIND_GUST]);
  const uvIndex = parseNumberSensor(sensors[SENSOR_IDS.UV_INDEX]);
  const airTemp = parseNumberSensor(sensors[SENSOR_IDS.AIR_TEMP]);
  const airTempFeelsLike = parseNumberSensor(sensors[SENSOR_IDS.AIR_TEMP_FEELS_LIKE]);
  const airHumidity = parseNumberSensor(sensors[SENSOR_IDS.AIR_HUMIDITY]);

  if (bearing === null || speedKmh === null) {
    throw new Error('Wind data missing required sensors');
  }

  if (uvIndex === null) {
    throw new Error('UV index sensor missing');
  }

  if (airTemp === null || airTempFeelsLike === null || airHumidity === null) {
    throw new Error('Air sensor missing');
  }

  return {
    wind: {
      direction: bearingToCompass8(bearing),
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
    air:{
      temp: airTemp,
      temp_feels_like: airTempFeelsLike,
      humidity: airHumidity
    }
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

function bearingToCompass8(bearing: number): "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

  // Normalize to [0, 360)
  const b = ((bearing % 360) + 360) % 360;

  // 8 sectors of 45°, centered on the cardinals/intercardinals
  const index = Math.round(b / 45) % 8;

  return directions[index];
}
