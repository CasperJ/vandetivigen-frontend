import { Waves, Wind, Droplets, TrendingUp, TrendingDown, Minus, AlertTriangle, MousePointer2, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import WaterTempChart from './components/WaterTempChart';
import { fetchWeatherData, type WeatherData } from './services/weatherService';
import { fetchAtmosphericConditions, type WindConditions, type UvConditions } from './services/realtimeWeatherService';

function App() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [wind, setWind] = useState<WindConditions | null>(null);
  const [uv, setUv] = useState<UvConditions | null>(null);
  const [atmosphericError, setAtmosphericError] = useState<string | null>(null);


  const enableAir = false;
  const enableWaterQuality = false;

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadAtmospheric() {
      try {
        const realtime = await fetchAtmosphericConditions();
        if (!isMounted) return;
        setWind(realtime.wind);
        setUv(realtime.uv);
        setAtmosphericError(null);
      } catch (error) {
        console.error('Failed to load atmospheric conditions', error);
        if (!isMounted) return;
        setWind(null);
        setUv(null);
        setAtmosphericError('Unable to load live atmospheric data');
      }
    }

    loadAtmospheric();
    const interval = setInterval(loadAtmospheric, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  async function loadData() {
    const weatherData = await fetchWeatherData();
    setData(weatherData);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-200 to-cyan-300 flex items-center justify-center">
        <div className="text-gray-700 text-2xl">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-200 to-cyan-300 flex items-center justify-center">
        <div className="text-gray-700 text-2xl">No data available</div>
      </div>
    );
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0.5) return <TrendingUp className="w-5 h-5 text-orange-600" />;
    if (trend < -0.5) return <TrendingDown className="w-5 h-5 text-blue-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getTrendText = (trend: number) => {
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}°C vs. 24h ago`;
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getUvLevelStyles = (level: UvConditions['level'] | 'safe') => {
    const mapping = {
      safe: {
        background: 'from-emerald-50 to-green-50',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        badge: 'bg-emerald-100 text-emerald-800',
        iconBg: 'bg-emerald-100 text-emerald-700',
        label: 'Low (0-2)',
      },
      aware: {
        background: 'from-amber-50 to-yellow-50',
        border: 'border-amber-200',
        text: 'text-amber-900',
        badge: 'bg-amber-100 text-amber-800',
        iconBg: 'bg-amber-100 text-amber-700',
        label: 'Moderate / High (3-7)',
      },
      extreme: {
        background: 'from-rose-50 to-red-50',
        border: 'border-rose-200',
        text: 'text-rose-900',
        badge: 'bg-rose-100 text-rose-800',
        iconBg: 'bg-rose-100 text-rose-700',
        label: 'Very High (8+)',
      },
    } as const;

    return mapping[level] ?? mapping.safe;
  };

  const windDirectionDegrees = wind?.bearingDegrees ?? data.current.windDirection;
  const windDirectionText = wind?.direction ?? getWindDirection(data.current.windDirection);
  const windSpeedDisplay = wind ? `${wind.speedMs.toFixed(1)} m/s` : '—';
  const windGustDisplay = wind && wind.gustMs !== null ? `${wind.gustMs.toFixed(1)} m/s` : '—';
  const uvIndexDisplay = uv ? uv.index.toFixed(1) : '—';
  const uvStyles = getUvLevelStyles(uv?.level ?? 'safe');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-200 to-cyan-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2 tracking-tight">Vandet i Vigen</h1>
          {/* <p className="text-gray-700 text-lg">Real-time conditions at your local beach</p> */}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative h-80 bg-cover bg-center p-8" style={{
              backgroundImage: 'url("background.jpg")',
              backgroundPosition: 'center bottom'
            }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Waves className="w-6 h-6 text-white drop-shadow-lg" />
                  <span className="text-white font-medium text-lg drop-shadow-lg">Water Temperature</span>
                </div>

                <div className="mb-6">
                  <div className="text-white/90 text-sm font-medium mb-1 drop-shadow-lg">Shallow End</div>
                  <div className="text-6xl font-bold text-white mb-1 drop-shadow-lg">{data.current.waterTempShallow}°C</div>
                </div>

                <div>
                  <div className="text-white/90 text-sm font-medium mb-1 drop-shadow-lg">Deep End</div>
                  <div className="text-5xl font-bold text-white drop-shadow-lg">{data.current.waterTempDeep}°C</div>
                </div>
              </div>
            </div>

            {enableWaterQuality && <>
              <div className="p-6">
                {data.current.waterQualityBad ? (
                  <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-4 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-red-900 text-lg">Water Quality Alert</div>
                      <div className="text-red-700 text-sm">Swimming not recommended. Water quality testing shows elevated levels.</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900 text-lg">Water Quality: Good</div>
                      <div className="text-emerald-700 text-sm">Safe for swimming with low levels of bacteria and pollutants.</div>
                    </div>
                  </div>
                )}
              </div>
            </>
            }
          </div>
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Water Temperature Trend
            </h2>
            {data.history.length === 0 ?
              <div className="text-gray-500 text-center py-8">No data available</div> : <WaterTempChart data={data.history} />}

            <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTrendIcon(data.trend)}
                  <span className="text-lg font-semibold text-gray-700">
                    {getTrendText(data.trend)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {data.trend > 0.5 ? 'Warming' : data.trend < -0.5 ? 'Cooling' : 'Stable'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enableAir &&
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Air Conditions</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                  <div className="text-orange-700 text-sm font-medium mb-2">Temperature</div>
                  <div className="text-4xl font-bold text-gray-800">{data.current.airTemp}°C</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-2">
                    <Droplets className="w-4 h-4" />
                    <span>Humidity</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-800">{data.current.humidity}%</div>
                </div>
              </div>
            </div>
          }
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Wind className="w-6 h-6 text-blue-600" />
                Wind Conditions
              </h2>

              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full border-4 border-blue-300"></div>
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
                    style={{ transform: `rotate(${windDirectionDegrees + 45}deg)` }}
                  >
                    <MousePointer2 className="w-16 h-16 text-blue-300" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-gray-600 text-sm font-medium mb-1">Direction</div>
                      <div className="text-3xl font-bold text-gray-800">{windDirectionText}</div>
                    </div>
                    {wind && (
                      <div className="text-right">
                        <div className="text-gray-600 text-sm font-medium mb-1">Bearing</div>
                        <div className="text-xl font-semibold text-gray-800">{windDirectionDegrees.toFixed(0)}°</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-gray-600 text-sm font-medium mb-1">Speed</div>
                      <div className="text-3xl font-bold text-gray-800">{windSpeedDisplay}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600 text-sm font-medium mb-1">Gust</div>
                      <div className="text-2xl font-semibold text-gray-800">{windGustDisplay}</div>
                    </div>
                  </div>
                  {atmosphericError && <div className="text-sm text-red-500">{atmosphericError}</div>}
                </div>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6 text-amber-500" />
                UV Index
              </h2>

              <div className={`rounded-3xl border ${uvStyles.border} bg-gradient-to-br ${uvStyles.background} p-6 flex flex-col gap-6`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${uvStyles.iconBg}`}>
                    <Sun className="w-10 h-10" />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold uppercase tracking-wide ${uvStyles.badge} inline-flex px-3 py-1 rounded-full`}>
                      {uvStyles.label}
                    </div>
                    <div className="text-5xl font-bold text-gray-900 mt-3">{uvIndexDisplay}</div>
                  </div>
                </div>
                {atmosphericError && (
                  <div className="text-sm text-red-500">{atmosphericError}</div>
                )}
              </div>
            </div>
        </div>

        <footer className="mt-8 text-center text-gray-700 text-sm">
          <p>Water temperature updated every 60 minutes, Wind, UV, etc is realtime • Last update: {new Date(data.current.timestamp).toLocaleTimeString()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
