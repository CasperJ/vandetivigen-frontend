export interface CurrentData {
  waterTempShallow: number;
  waterTempDeep: number;
  airTemp: number;
  humidity: number;
  windDirection: number;
  windSpeed: number;
  waterQualityBad: boolean;
  timestamp: string;
}

export interface HistoricalData {
  waterTempShallow: number;
  waterTempDeep: number;
  timestamp: string;
}

export interface WeatherData {
  current: CurrentData;
  history: HistoricalData[];
  trend: number;
}

export async function fetchWeatherData(): Promise<WeatherData> {
  const now = new Date();
  const history: HistoricalData[] = [];

  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const baseShallow = 18 + Math.sin(i * 0.5) * 2;
    const baseDeep = 16 + Math.sin(i * 0.5) * 2;

    history.push({
      waterTempShallow: parseFloat((baseShallow + Math.random() * 0.5).toFixed(1)),
      waterTempDeep: parseFloat((baseDeep + Math.random() * 0.5).toFixed(1)),
      timestamp: date.toISOString()
    });
  }

  const current: CurrentData = {
    waterTempShallow: history[history.length - 1].waterTempShallow,
    waterTempDeep: history[history.length - 1].waterTempDeep,
    airTemp: parseFloat((20 + Math.random() * 4).toFixed(1)),
    humidity: Math.floor(60 + Math.random() * 20),
    windDirection: Math.floor(Math.random() * 360),
    windSpeed: parseFloat((5 + Math.random() * 20).toFixed(1)),
    waterQualityBad: Math.random() < 0.1,
    timestamp: now.toISOString()
  };

  const dayAgoTemp = history[history.length - 2].waterTempShallow;
  const trend = current.waterTempShallow - dayAgoTemp;

  return {
    current,
    history,
    trend
  };
}
