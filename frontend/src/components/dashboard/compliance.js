import { Doughnut } from "react-chartjs-2";

export default function ComplianceCard({ rawData }) {
  const allZero = rawData.every((item) => Number(item.value) === 0);

  const chartData = allZero
    ? {
        labels: ["Tidak ada data"],
        datasets: [
          {
            data: [1], // kasih slice dummy
            backgroundColor: ["#e5e7eb"], // abu-abu (Tailwind gray-200)
            borderWidth: 2,
          },
        ],
      }
    : {
        labels: rawData.map((item) => item.label),
        datasets: [
          {
            data: rawData.map((item) => item.value),
            backgroundColor: ["#abc62b", "#ed1b2f"], // Sesuai & Tidak sesuai
            borderWidth: 2,
          },
        ],
      };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return <Doughnut data={chartData} options={chartOptions} />;
}
