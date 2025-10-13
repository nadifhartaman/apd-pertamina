"use client";

import React from "react";
import { Line, Bar } from "react-chartjs-2";

export default function TimeSeriesCard({ rawData, filterType = "hour", type = "hour", maxRotation = true, chartType = "Line" }) {
  // === Tentukan label berdasarkan tipe data ===
  console.log(rawData)
  const labels =
    type === "week"
      ? rawData.map((item, i) => `Minggu ke-${item.week ?? i + 1}`)
      // : rawData.map((item, i) => `Minggu ke-${item.week ?? i + 1} ${item.start_date && item.end_date ? `(${item.start_date?.split("T")[0] ?? ""} - ${item.end_date?.split("T")[0] ?? ""})` : ""}`
      : rawData.map((item) => `${item.hour}:00`);

  const counts = rawData.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: type === "week" ? "Deteksi Pelanggaran per Minggu" : "Deteksi Pelanggaran per Jam",
        data: counts,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.9)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          pointStyle: "triangle", // rectRounded juga bisa
          usePointStyle: true,
          textAlign: "center",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: maxRotation ? 45 : 0,
          minRotation: 0,
          autoSkip: maxRotation,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
      },
    },
  };

  if(chartType === "Bar") {
    return <Bar data={chartData} options={chartOptions} />;
  }
  if(chartType === "Line") {
    return <Line data={chartData} options={chartOptions} />;
  }
}
