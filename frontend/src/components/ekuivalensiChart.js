import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RainfallChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const directions = ['Utara', 'Timur', 'Selatan', 'Barat'];
        const colorMap = {
          Utara: '#FFC107',
          Timur: '#17A2B8',
          Selatan: '#28A745',
          Barat: '#DC3545'
        };

        const datasets = [];

        data.forEach(entry => {
          directions.forEach(dir => {
            if (entry.data[dir]) {
              datasets.push({
                label: `${dir} ${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}`,
                data: entry.data[dir],
                borderColor: colorMap[dir],
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderWidth: 2,
                fill: false,
                tension: 0,
                pointRadius: 3,
                pointHoverRadius: 3
              });
            }
          });
        });

        setChartData({ labels, datasets });
        setLoading(false);
      } catch (err) {
        console.error('Failed to load chart data', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Data Ekuivalensi',
        font: { size: 14, weight: 'bold' },
        padding: 10,
        color: '#333'
      },
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12 },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          boxHeight: 6
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderWidth: 0,
        callbacks: {
          label: context => `${context.dataset.label}: ${context.parsed.y} mm`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Bulan',
          font: { size: 14, weight: 'bold' },
          color: '#666'
        },
        grid: { display: false },
        ticks: { font: { size: 12 }, color: '#666' }
      },
      y: {
        title: {
          display: true,
          text: 'Curah Hujan (mm)',
          font: { size: 14, weight: 'bold' },
          color: '#666'
        },
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.1)', drawBorder: false },
        ticks: {
          font: { size: 12 },
          color: '#666',
          callback: value => value + ' mm'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        hoverBackgroundColor: 'white',
        hoverBorderWidth: 2
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData || !chartData.datasets) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600">Error: No chart data available</p>
            <p className="text-sm text-gray-500 mt-2">Please check your data structure</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto p-2 rounded-lg">
      <div className="min-w-[500px] lg:max-w-[1000px] w-full mx-auto">
        <div className="bg-white px-6 py-2 rounded-lg shadow-sm">
          <div className="relative h-96 w-full">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RainfallChart;
