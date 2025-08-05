"use client";
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function HorizontalBarChart({ positionText, chartData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Bersihkan chart instance sebelumnya jika ada
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Gunakan data dari props atau fallback ke default jika tidak ada
    const data = {
      labels: chartData?.labels || [],
      datasets: [
        {
          data: chartData?.values || [],
          backgroundColor: chartData?.color || '#4ade80',
          barThickness: chartData?.thickness || 30,
        },
      ],
    };

    // Konfigurasi chart
    const config = {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                const label = chartData?.tooltipLabels?.[context.dataIndex] || '';
                return `${label}: ${context.raw} ${chartData?.format || ''}`;
              }
            }
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false,
            },
            reverse: positionText,
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              // color: '#1f2937',
              font: {
                size: 14,
              },
              callback: function(value, index) {
                const dataValue = data.datasets[0].data[index];
                const percent = chartData?.percentages ? chartData.percentages[index] : '22.5%';
                const vehicleType = chartData?.vehicleTypes ? chartData.vehicleTypes[index] : '';
                
                // Hanya teks untuk label di Chart.js - icon akan ditampilkan via React
                return `${vehicleType} (${percent}) ${dataValue}`;
              },
              align: 'end',
              mirror: false,
            },
            border: {
              display: false,
            },
            position: positionText ? 'left' : 'right',
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };

    // Buat chart baru
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, config);

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [positionText, chartData]);

  return (
    <div className="w-[90%] mx-auto">
      <div className="h-64 p-1 rounded-lg relative">
        <canvas ref={chartRef}></canvas>
        
        {/* Render ikon-ikon di sepanjang sumbu Y di sebelah label */}
        {chartData?.iconComponents && (
          <div className={`absolute inset-y-0 text-neutral-600 ${positionText ? ' lg:-right-6 right-5 ' : ' lg:-left-6 left-5 '} flex flex-col justify-evenly pt-6 pb-3 pointer-events-none`}>
            {chartData.iconComponents.map((IconComponent, index) => (
              <div key={index} className="">
                {IconComponent && <IconComponent size={22} />}
              </div>
            ))}
          </div>
        )}
        {chartData?.directionRoad && (
          <div className={`absolute font-semibold -inset-y-6 ${positionText ? ' 2xl:-right-12  xl:text-left text-right right-8 not-xl:shadow-accent-content ' : 'left-8 text-right not-xs:shadow-accent-content 2xl:-left-12 not-xl:text-left '} flex flex-col justify-evenly pt-6 pb-3 pointer-events-none`}>
            {chartData.directionRoad.map((dataDirect, index) => (
              <div key={index}>
                {dataDirect}
              </div>
            ))}
          </div>
        )}
        
        {/* Render judul/ikon tengah
        {chartData?.centerIconComponent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center">
              <div className="text-lg font-medium">Kendaraan</div>
              <div className="text-sm text-gray-500">{chartData.centerTitle}</div>
              <div className="mt-2 text-gray-600">
                {chartData.centerIconComponent}
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}