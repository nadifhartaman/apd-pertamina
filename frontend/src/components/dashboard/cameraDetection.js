import { Bar } from "react-chartjs-2";

export default function CameraDetectionChart ({ data, legendSize = 12, aspect = false }) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: "Deteksi APD",
        data: data.map(item => item.value),
        backgroundColor: ["#ed1b2f", "#FCB700", "#006db7", "#abc62b"],
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: aspect,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 6,
          boxHeight: 6,
          pointStyle: "circle",
          usePointStyle: true,
          padding: 5, 
          font: {
            size: 12,
          },
        },
      },
      labels: {
        font: {
          size: legendSize,
          family: "Inter, sans-serif",
        }
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <Bar data={chartData} options={chartOptions} />
  );
}
