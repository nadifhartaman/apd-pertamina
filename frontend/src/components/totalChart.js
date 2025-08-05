// ParkingChartJS.jsx
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TotalChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Default data if none is provided
  const defaultData = [
    {
      name: 'Today',
      masuk: 120.98,
      keluar: 95.45,
      masukPercentage: 44.5,
      keluarPercentage: 38.2
    }
  ];

  // Use provided data or fallback to default data
  const chartData = data.length > 0 ? data : defaultData;
  
  useEffect(() => {
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Get the canvas context
    const ctx = chartRef.current.getContext('2d');
    
    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['MASUK', 'KELUAR'],
        datasets: [{
          data: [chartData[0].masukPercentage, chartData[0].keluarPercentage],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)', // Green for MASUK
            'rgba(239, 68, 68, 0.8)',  // Red for KELUAR
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 0.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0,

        }]
      },
      options: {
        indexAxis: 'x',
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Percentage (%)'
            }
          }
        },
        dataLabels: {
          display: false
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#1f2937',
              font: {
                size: 14,
              },
              display: false,
              align: 'end', // Menyelaraskan teks ke kanan
              mirror: false, // Membalikkan posisi label
            },
            border: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#1f2937',
              font: {
                size: 14,
              },
              display: false,
              align: 'end', // Menyelaraskan teks ke kanan
              mirror: false, // Membalikkan posisi label
            },
            border: {
                  display: false,
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.raw + '%';
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full grid grid-cols-7 gap-6 p-4 bg-base-200/90 rounded-3xl">
        <div className="col-span-3 flex flex-col items-center justify-evenly text-center">
          <div className="text-green-600 font-semibold text-xl">MASUK</div>
          <div>
            <div className="text-4xl font-medium text-green-600">
              {chartData[0].masuk}
            </div>
            <div className="text-gray-600 mb-2">Kendaraan</div>
          </div>
        </div>
        
        <div className="col-span-1 h-64">
          <canvas ref={chartRef}></canvas>
        </div>
        
        <div className="col-span-3 flex flex-col items-center justify-evenly text-center">
          <div className="text-red-500 font-semibold text-xl">KELUAR</div>
          <div>
            <div className="text-4xl font-medium text-red-500">
              {chartData[0].keluar}
            </div>
            <div className="text-gray-600 mb-2">Kendaraan</div>
          </div>
        </div>
      </div>
    </div>
 
  );
};

export default TotalChart;