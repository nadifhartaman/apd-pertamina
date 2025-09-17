import { Line } from "react-chartjs-2";

export default function TimeSeriesCard ({ rawData }) {
  // Ubah data mentah {hour, count} jadi chart.js format
  const labels = rawData.map((item) => `${item.hour}:00`);
  const counts = rawData.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Deteksi Pelanggaran",
        data: counts,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // per 1
          callback: function (value) {
            return Number.isInteger(value) ? value : null; //  integer
          },
        }
      },
    },
  };

  return (
    <Line data={chartData} options={chartOptions} />
  );
}
