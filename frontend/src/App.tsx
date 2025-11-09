import { Waves, Wind, Droplets, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import WaterTempChart from './components/WaterTempChart';
import { fetchWeatherData, type WeatherData } from './services/weatherService';

function App() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);


  const enableWind = false;
  const enableAir = false;
  const enableWaterQuality = false;

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 600000);
    return () => clearInterval(interval);
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
          {enableWind &&

            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Wind className="w-6 h-6 text-blue-600" />
                Wind Conditions
              </h2>

              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full border-4 border-blue-300"></div>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${data.current.windDirection}deg)` }}
                  >
                    <div className="text-4xl">↑</div>
                  </div>
                </div>

                <div>
                  <div className="text-gray-600 text-sm font-medium mb-1">Direction</div>
                  <div className="text-3xl font-bold text-gray-800 mb-4">{getWindDirection(data.current.windDirection)}</div>

                  <div className="text-gray-600 text-sm font-medium mb-1">Speed</div>
                  <div className="text-3xl font-bold text-gray-800">{data.current.windSpeed} km/h</div>
                </div>
              </div>
            </div>
          }
        </div>

        <footer className="mt-8 text-center text-gray-700 text-sm">
          <p>Data updated every 60 minutes • Last update: {new Date(data.current.timestamp).toLocaleTimeString()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
