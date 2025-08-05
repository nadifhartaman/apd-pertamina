// components/DonutChart.jsx
'use client';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Truck', 'Car', 'Motorcycle', 'Other'],
    datasets: [
      {
        data: [5, 10, 5, 80],
        backgroundColor: [
          '#c13c37', // dark red
          '#a52a2a', // brown-red
          '#ffcccb', // light pink
          '#b0b0b0', // gray
        ],
        // borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 1,
        cutout: '70%',
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    responsive: true,
  };

  return (
    <div className="flex flex-col items-center p-6 w-full mx-auto bg-base-300/90 rounded-lg shadow-xs">
      <h2 className="text-2xl text-gray-500 font-medium mb-4">Indicator</h2>
      
      <div className="lg:flex-col flex w-full gap-2 items-center">
        <div className="w-full h-[200px] min-w-[300px] not-xl:hidden items-center justify-center flex">
          <div className="relative ">
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
        
        <div className="w-1/2 flex flex-col justify-center space-y-4 not-xl:w-full">
          {chartData.labels.map((label, index) => (
            <div key={label} className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl font-semibold text-gray-500">
                  {chartData.datasets[0].data[index]}%
                </span>
                <span className="text-gray-400 truncate">{label}</span>
              </div>
              <div 
                className="h-2 rounded-full" 
                style={{ 
                  backgroundColor: chartData.datasets[0].backgroundColor[index],
                  width: '100%' 
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;