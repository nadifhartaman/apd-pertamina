import { Bar } from "react-chartjs-2";
import { BiVideoRecording } from "react-icons/bi";

export default function CameraDetectionChart ({ data }) {
  // mapping ke format chart.js
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: "Deteksi APD",
        data: data.map(item => item.value),
        backgroundColor: ["#ed1b2f", "#FCB700", "#006db7", "#abc62b"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <Bar data={chartData} options={chartOptions} />
  );
}
