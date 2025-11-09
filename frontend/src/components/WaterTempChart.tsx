import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { type HistoricalData } from '../services/weatherService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface WaterTempChartProps {
  data: HistoricalData[];
}

export default function WaterTempChart({ data }: WaterTempChartProps) {

  const { chartData, options } = useMemo(() => {
    const labels = data.map(entry => {
      const date = new Date(entry.timestamp);
      //if( date.getHours() === 0)
        return date.toLocaleDateString('da-DK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});
      //return date.getHours().toString().padStart(2, '0') + ':00';
    });

    const temps = data.flatMap(entry => [entry.waterTempShallow, entry.waterTempDeep]);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const padding = Math.max(1, (maxTemp - minTemp) * 0.15 || 1);

    const chartData: ChartData<'line'> = {
      labels,
      datasets: [
        {
          label: 'Shallow',
          data: data.map(entry => entry.waterTempShallow),
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          fill: 'origin',
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBorderWidth: 2,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#ffffff',
          spanGaps: true
        },
        {
          label: 'Deep',
          data: data.map(entry => entry.waterTempDeep),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.12)',
          fill: 'origin',
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBorderWidth: 2,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#ffffff',
          spanGaps: true
        }
      ]
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => {
              const value = context.parsed.y;
              if (value === null || Number.isNaN(value)) {
                return '';
              }
              return `${context.dataset.label}: ${value.toFixed(1)}°C`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 6, maxRotation: 0 }
        },
        y: {
          beginAtZero: false,
          suggestedMin: minTemp - padding,
          suggestedMax: maxTemp + padding,
          ticks: {
            callback: value => `${value}°C`
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.2)'
          }
        }
      }
    };

    return { chartData, options };
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-500 rounded"></div>
          <span className="text-gray-700 font-medium">Shallow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-gray-700 font-medium">Deep</span>
        </div>
      </div>

      <div className="relative h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
