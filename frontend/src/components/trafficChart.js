// app/components/TrafficChart.jsx
"use client";
import { useEffect, useRef } from 'react';

export default function TrafficChart({ trafficData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (
      !trafficData ||
      !Array.isArray(trafficData.hours) ||
      !Array.isArray(trafficData.inData) ||
      !Array.isArray(trafficData.outData)
    ) return;

    if (!trafficData || !chartRef.current) return;

    // Dynamically import Chart.js and explicitly register all controllers and scales
    const loadChart = async () => {
      try {
        const { Chart } = await import('chart.js');
        const { 
          LineController, 
          LineElement, 
          PointElement, 
          LinearScale, 
          CategoryScale,
          Title,
          Tooltip,
          Legend,
          Filler
        } = await import('chart.js');

        // Register the required components
        Chart.register(
          LineController, 
          LineElement, 
          PointElement, 
          LinearScale, 
          CategoryScale,
          Title,
          Tooltip,
          Legend,
          Filler
        );

        // Clean up any existing chart
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Extract data from props
        const { hours, inData, outData, peakData } = trafficData;
        
        // Calculate average of IN and OUT
        const averageData = hours.map((_, idx) => {
          return ((inData[idx] || 0) + (outData[idx] || 0)) / 2;
        });

        // Validate peak data
        const validPeakData = (peakData || []).map(value => value || 0);

        const ctx = chartRef.current.getContext('2d');
        
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: hours,
            datasets: [
              {
                label: 'LJR (Rata-Rata)',
                data: averageData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0, // Disable bezier curves to avoid control point issues
                pointRadius: 3,
                spanGaps: true
              },
              {
                label: '4 x V 15 menit tertinggi',
                data: validPeakData,
                backgroundColor: 'rgba(255, 99, 132, 0.0)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                tension: 0, // Disable bezier curves
                pointRadius: 3,
                spanGaps: true
              },
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              // title: {
              //   display: true,
              //   text: 'Lalu Lintas Jam-Jaman Rata-Rata',
              //   color: '#D3D3D3',
              //   font: {
              //     size: 16,
              //     weight: 'bold'
              //   }
              // },
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  boxWidth: 15,
                  color: '#D3D3D3'
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                type: 'category', // Explicitly set scale type
                title: {
                  display: true,
                  text: 'Waktu',
                  color: '#D3D3D3'
                },
                ticks: {
                  color: '#D3D3D3'
                },
                grid: {
                  display: false
                }
              },
              y: {
                type: 'linear', // Explicitly set scale type
                title: {
                  display: true,
                  text: 'Kendaraan/Jam',
                  color: '#D3D3D3'
                },
                ticks: {
                  color: '#D3D3D3'
                },
                beginAtZero: true,
                grid: {
                  color: 'rgba(200, 200, 200, 0.2)'
                }
              }
            }
          }
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    };

    loadChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [trafficData]);

  return (
    <div className="w-full h-full bg-base-100 py-10 px-5 rounded-2xl shadow-xs overflow-x-auto">
      <div className="h-96 not-xl:w-fit min-w-full">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
}