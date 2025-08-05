"use client";

import React from "react";

// Fungsi untuk mengelompokkan dan mengambil status per jam
const getStatusPerHour = (dataArray) => {
  if (!Array.isArray(dataArray)) return {};

  // Kelompokkan data berdasarkan jam (0-23) di WIB
  const statusPerHour = {};

  dataArray.forEach((item) => {
    const date = new Date(item.recorded_at);
    // Ambil jam lokal WIB
    const hour = date.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      hourCycle: "h23",
    });

    // Ambil status 0 atau 1, asumsikan ada property `status` yang bernilai 0/1
    const status = item.status === 1 ? 1 : 0;

    // Kalau sudah ada status jam ini, kita bisa tentukan prioritas (misal: 1 kalau ada 1 di jam itu)
    if (!(hour in statusPerHour) || status === 1) {
      statusPerHour[hour] = status;
    }
  });

  return statusPerHour;
};

const filterLogsByDate = (logs, targetDate) => {
  if (!Array.isArray(logs) || !targetDate) return [];

  // Format target date ke YYYY-MM-DD
  const targetDateStr = new Date(targetDate).toISOString().split('T')[0];

  return logs.filter(log => {
    if (!log.recorded_at) return false;

    // Ambil tanggal dari recorded_at
    const logDateStr = new Date(log.recorded_at).toISOString().split('T')[0];
    return logDateStr === targetDateStr;
  });
};

const CameraStatusTimeline = ({ cameraStatusData = [], selectedDate = null }) => {
  // Filter data berdasarkan tanggal yang dipilih jika belum difilter
  const filteredData = selectedDate
    ? filterLogsByDate(cameraStatusData, selectedDate)
    : cameraStatusData;

  const statusPerHour = getStatusPerHour(filteredData);
  // Buat array jam dari 0 sampai 23
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold mb-3">Timeline Status Kamera per Jam (WIB)</h2>
      {/* <div className="flex space-x-1"> */}
      <div className="flex w-full">
        {hours.map((hour) => {
          const status = statusPerHour[hour];
          let bgColor = "bg-gray-300"; // default abu-abu untuk tidak ada data

          if (status === 1) bgColor = "bg-green-500";
          else if (status === 0) bgColor = "bg-red-500";

          return (
            <div
              key={hour}
              title={`${hour}:00 - Status: ${status !== undefined ? status : "Tidak ada data"}`}
              className={`${bgColor} w-5 h-5 flex-1 cursor-default`}
            // className={`${bgColor} w-6 h-6 rounded-sm cursor-default`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[11px] mt-1 text-gray-600 font-mono">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
};

export default CameraStatusTimeline;
