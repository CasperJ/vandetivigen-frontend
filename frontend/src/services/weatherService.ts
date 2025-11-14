
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
  let history: HistoricalData[] = [];


  let tempData : { RecordedOn: string, Temperature: number, Temperature2: number }[] = [];

  if(document.URL.includes("localhost")) {
    tempData = JSON.parse('[{"Temperature":10,"Temperature2":12.5,"RecordedOn":"2025-11-09T08:50:07.038Z"},{"Temperature":9.8,"Temperature2":12.5,"RecordedOn":"2025-11-09T07:50:06.981Z"},{"Temperature":9.9,"Temperature2":12.5,"RecordedOn":"2025-11-09T06:50:06.924Z"},{"Temperature":9.8,"Temperature2":12.5,"RecordedOn":"2025-11-09T05:50:06.861Z"},{"Temperature":9.7,"Temperature2":12.5,"RecordedOn":"2025-11-09T04:50:06.804Z"},{"Temperature":9.8,"Temperature2":12.5,"RecordedOn":"2025-11-09T03:50:06.753Z"},{"Temperature":9.9,"Temperature2":12.5,"RecordedOn":"2025-11-09T02:50:06.703Z"},{"Temperature":10,"Temperature2":12.5,"RecordedOn":"2025-11-09T01:50:06.64Z"},{"Temperature":10.2,"Temperature2":12.5,"RecordedOn":"2025-11-09T00:50:06.572Z"},{"Temperature":10.5,"Temperature2":12.5,"RecordedOn":"2025-11-08T23:50:06.517Z"},{"Temperature":10.7,"Temperature2":12.5,"RecordedOn":"2025-11-08T22:50:06.474Z"},{"Temperature":10.8,"Temperature2":12.5,"RecordedOn":"2025-11-08T21:50:06.405Z"},{"Temperature":10.7,"Temperature2":12.5,"RecordedOn":"2025-11-08T20:50:06.356Z"},{"Temperature":10.6,"Temperature2":null,"RecordedOn":"2025-11-08T19:50:06.292Z"},{"Temperature":10.6,"Temperature2":12.5,"RecordedOn":"2025-11-08T19:50:06.292Z"},{"Temperature":10.7,"Temperature2":null,"RecordedOn":"2025-11-08T18:50:06.237Z"},{"Temperature":10.7,"Temperature2":null,"RecordedOn":"2025-11-08T17:50:06.197Z"},{"Temperature":10.6,"Temperature2":null,"RecordedOn":"2025-11-08T16:50:06.138Z"},{"Temperature":10.6,"Temperature2":null,"RecordedOn":"2025-11-08T15:50:06.083Z"},{"Temperature":10.4,"Temperature2":null,"RecordedOn":"2025-11-08T14:50:06.016Z"},{"Temperature":10.2,"Temperature2":null,"RecordedOn":"2025-11-08T13:50:05.975Z"},{"Temperature":10.5,"Temperature2":null,"RecordedOn":"2025-11-08T12:50:05.907Z"},{"Temperature":10.7,"Temperature2":null,"RecordedOn":"2025-11-08T11:50:05.851Z"},{"Temperature":10.8,"Temperature2":null,"RecordedOn":"2025-11-08T10:50:05.805Z"},{"Temperature":10.7,"Temperature2":null,"RecordedOn":"2025-11-08T09:50:05.745Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-08T08:50:05.699Z"},{"Temperature":10.4,"Temperature2":8.9,"RecordedOn":"2025-11-08T07:50:11.904Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-08T06:50:05.569Z"},{"Temperature":10.5,"Temperature2":8.9,"RecordedOn":"2025-11-08T05:50:05.512Z"},{"Temperature":10.4,"Temperature2":8.9,"RecordedOn":"2025-11-08T04:50:05.469Z"},{"Temperature":10.5,"Temperature2":8.9,"RecordedOn":"2025-11-08T03:50:05.396Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-08T02:50:05.345Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-08T01:50:05.291Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-08T00:50:05.227Z"},{"Temperature":10.3,"Temperature2":8.9,"RecordedOn":"2025-11-07T23:50:05.177Z"},{"Temperature":10.3,"Temperature2":8.9,"RecordedOn":"2025-11-07T22:50:05.116Z"},{"Temperature":10.4,"Temperature2":8.9,"RecordedOn":"2025-11-07T21:50:05.065Z"},{"Temperature":10.5,"Temperature2":8.9,"RecordedOn":"2025-11-07T20:50:05.005Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-07T19:50:04.946Z"},{"Temperature":10.5,"Temperature2":8.9,"RecordedOn":"2025-11-07T18:50:04.897Z"},{"Temperature":10.3,"Temperature2":8.9,"RecordedOn":"2025-11-07T17:50:04.835Z"},{"Temperature":10.4,"Temperature2":8.9,"RecordedOn":"2025-11-07T16:50:04.782Z"},{"Temperature":10.7,"Temperature2":8.9,"RecordedOn":"2025-11-07T15:50:04.737Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-07T14:50:04.677Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-07T13:50:04.634Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-07T12:50:04.583Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-07T11:50:04.543Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-07T10:50:04.482Z"},{"Temperature":10.5,"Temperature2":8.9,"RecordedOn":"2025-11-07T09:50:04.431Z"},{"Temperature":10.2,"Temperature2":8.9,"RecordedOn":"2025-11-07T08:50:04.376Z"},{"Temperature":10.3,"Temperature2":8.9,"RecordedOn":"2025-11-07T07:50:04.337Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-07T06:50:04.269Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-07T05:50:04.213Z"},{"Temperature":10.9,"Temperature2":8.9,"RecordedOn":"2025-11-07T04:50:04.162Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-07T03:50:04.095Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-07T02:50:04.024Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-07T01:50:03.963Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-07T00:50:03.911Z"},{"Temperature":11.4,"Temperature2":8.9,"RecordedOn":"2025-11-06T23:50:03.834Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T22:50:03.788Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T21:50:03.726Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T20:50:03.655Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-06T19:50:03.61Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T18:50:03.543Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-06T17:50:03.488Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T16:50:03.446Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T15:50:03.398Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T14:50:03.352Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T13:50:03.296Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T12:50:03.258Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-06T11:50:03.219Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-06T10:50:03.181Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-06T09:50:03.125Z"},{"Temperature":11.5,"Temperature2":8.9,"RecordedOn":"2025-11-06T08:50:03.075Z"},{"Temperature":11.4,"Temperature2":8.9,"RecordedOn":"2025-11-06T07:50:03.03Z"},{"Temperature":11.3,"Temperature2":8.9,"RecordedOn":"2025-11-06T06:50:02.981Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-06T05:50:02.936Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-06T04:50:02.886Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-06T03:50:02.83Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-06T02:50:02.766Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-06T01:50:02.73Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-06T00:50:02.668Z"},{"Temperature":11.2,"Temperature2":8.9,"RecordedOn":"2025-11-05T23:50:02.618Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-05T22:50:02.568Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-05T21:50:02.606Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-05T20:50:02.469Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-05T19:50:02.413Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-05T18:50:02.366Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-05T17:50:02.312Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-05T16:50:02.272Z"},{"Temperature":11.1,"Temperature2":8.9,"RecordedOn":"2025-11-05T15:50:02.226Z"},{"Temperature":11,"Temperature2":8.9,"RecordedOn":"2025-11-05T14:50:02.174Z"},{"Temperature":10.9,"Temperature2":8.9,"RecordedOn":"2025-11-05T13:50:02.124Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-05T12:50:02.08Z"},{"Temperature":10.7,"Temperature2":8.9,"RecordedOn":"2025-11-05T11:50:02.018Z"},{"Temperature":10.7,"Temperature2":8.9,"RecordedOn":"2025-11-05T10:50:01.98Z"},{"Temperature":10.7,"Temperature2":8.9,"RecordedOn":"2025-11-05T09:50:01.931Z"},{"Temperature":10.7,"Temperature2":8.9,"RecordedOn":"2025-11-05T08:50:01.89Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-05T07:50:01.824Z"},{"Temperature":11,"Temperature2":8.9,"RecordedOn":"2025-11-05T06:50:01.778Z"},{"Temperature":10.9,"Temperature2":8.9,"RecordedOn":"2025-11-05T05:50:01.735Z"},{"Temperature":11,"Temperature2":8.9,"RecordedOn":"2025-11-05T04:50:01.685Z"},{"Temperature":10.9,"Temperature2":8.9,"RecordedOn":"2025-11-05T03:50:01.622Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-05T02:50:01.575Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-05T01:50:01.527Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-05T00:50:01.471Z"},{"Temperature":10.7,"Temperature2":8.9,"RecordedOn":"2025-11-04T23:50:01.432Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-04T22:50:01.381Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-04T21:50:01.338Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-04T20:50:01.291Z"},{"Temperature":10.8,"Temperature2":8.9,"RecordedOn":"2025-11-04T19:50:01.225Z"},{"Temperature":10.7,"Temperature2":8.9,"RecordedOn":"2025-11-04T18:50:01.192Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-04T17:50:01.133Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-04T16:50:01.088Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-04T15:50:01.042Z"},{"Temperature":10.7,"Temperature2":8.9,"RecordedOn":"2025-11-04T14:50:00.997Z"},{"Temperature":10.6,"Temperature2":8.9,"RecordedOn":"2025-11-04T13:50:00.943Z"},{"Temperature":10.5,"Temperature2":8.9,"RecordedOn":"2025-11-04T12:50:00.897Z"},{"Temperature":10.5,"Temperature2":8.9,"RecordedOn":"2025-11-04T11:50:00.852Z"},{"Temperature":10.5,"Temperature2":8.9,"RecordedOn":"2025-11-04T10:50:00.81Z"}]')
  } else {
  const data = await fetch("/api/temperature");
   tempData = await data.json();
  }
  history = tempData.map(record => ({
    waterTempShallow: record.Temperature,
    waterTempDeep: record.Temperature2,
    timestamp: record.RecordedOn
  }));

  history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

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

  const trend = calculateTrend(history);

  return {
    current,
    history,
    trend
  };
}


function calculateTrend(history: HistoricalData[]): number {

if (!history || history.length === 0) return 0;

// parse timestamps and filter out invalid dates
const parsed = history
  .map(h => ({ ...h, ts: Date.parse(h.timestamp) }))
  .filter(h => !Number.isNaN(h.ts));

if (parsed.length === 0) return 0;

// find newest record
const newest = parsed.reduce((a, b) => (a.ts > b.ts ? a : b));

const targetTs = newest.ts - 24 * 60 * 60 * 1000; // 24 hours earlier

// find record closest to target timestamp
const closest = parsed.reduce((best, cur) =>
  Math.abs(cur.ts - targetTs) < Math.abs(best.ts - targetTs) ? cur : best
);

console.log(`Newest: ${new Date(newest.ts).toISOString()} (${newest.waterTempShallow}/${newest.waterTempDeep}), Closest: ${new Date(closest.ts).toISOString()} (${closest.waterTempShallow}/${closest.waterTempDeep})`);

return (newest.waterTempShallow + newest.waterTempDeep)/2 - (closest.waterTempShallow + closest.waterTempDeep)/2;

}