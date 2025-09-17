import { Doughnut } from "react-chartjs-2";

export default function ComplianceCard ({ rawData }) {
  const labels = rawData.map((item) => item.label);
  const values = rawData.map((item) => item.value);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#abc62b", "#ed1b2f"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <Doughnut data={chartData} options={chartOptions} />
  );
}
