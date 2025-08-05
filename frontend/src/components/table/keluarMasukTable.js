"use client";
import { useEffect, useState } from "react";

const KeluarMasukTable = ({ selectedDate, setSelectedDate, loading, data }) => {
  const [vehicleData, setVehicleData] = useState([]);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   import("@/data/DataKMTabel.json").then((data) => setVehicleData(data.default || []))
  // }, []);

  const handleDateChange = (e) => {
    if (setSelectedDate) {
      setSelectedDate(e.target.value);
    }
  };

  if (error) {
    return <div className="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>;
  }

  useEffect(() => {
    setVehicleData(data)
  },[data])

  const generateTableRows = () => {
    let rows = [];

    // Akses array vehicleData dari struktur JSON yang baru
    const periods = vehicleData?.vehicleData || [];

    periods.forEach((period, periodIndex) => {
      const timeSlots = period.timeSlots || [];

      timeSlots.forEach((timeSlot, timeSlotIndex) => {
        const isFirstSlotInPeriod = timeSlotIndex === 0;
        const globalIndex = periodIndex * 100 + timeSlotIndex; // Unique key

        rows.push(
          <tr key={globalIndex} className={globalIndex % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}>
            {isFirstSlotInPeriod && (
              <td
                rowSpan={timeSlots.length}
                className="border border-base-300 text-xs text-center font-medium align-middle"
              >
                {period.period}
              </td>
            )}
            <td className="border border-base-300 text-xs text-center">{timeSlot.time}</td>

            {/* Masuk Simpang */}
            <td className="border border-base-300 text-xs text-center">{timeSlot.masukSimpang?.sm || 0}</td>
            <td className="border border-base-300 text-xs text-center">{timeSlot.masukSimpang?.mp || 0}</td>
            <td className="border border-base-300 text-xs text-center">{timeSlot.masukSimpang?.ks || 0}</td>
            <td className="border border-base-300 text-xs text-center">{timeSlot.masukSimpang?.ktb || 0}</td>
            <td className="border border-base-300 text-xs text-center ">{timeSlot.masukSimpang?.total || 0}</td>

            {/* Keluar Simpang */}
            <td className="border border-base-300 text-xs text-center">{timeSlot.keluarSimpang?.sm || 0}</td>
            <td className="border border-base-300 text-xs text-center">{timeSlot.keluarSimpang?.mp || 0}</td>
            <td className="border border-base-300 text-xs text-center">{timeSlot.keluarSimpang?.ks || 0}</td>
            <td className="border border-base-300 text-xs text-center">{timeSlot.keluarSimpang?.ktb || 0}</td>
            <td className="border border-base-300 text-xs text-center ">{timeSlot.keluarSimpang?.total || 0}</td>
          </tr>
        );
      });
    });

    return rows;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* <div className="mb-4">
        <input
          type="date"
          id="date-input"
          value={selectedDate || ''}
          onChange={handleDateChange}
          className="input input-bordered input-md"
        />
      </div> */}

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-base-300 w-full text-xs table-xs table">
            <thead className="text-gray-900">
              <tr className="bg-base-300">
                <th rowSpan={3} className="border border-base-100 text-sm font-medium p-2 min-w-[80px] text-center">
                  Periode
                </th>
                <th rowSpan={3} className="border border-base-100 text-sm font-medium p-2 min-w-[120px] text-center">
                  Waktu<br />
                  <span className="text-xs font-normal">Interval<br />15 menit</span>
                </th>
                <th colSpan={5} className="border border-base-100 text-sm font-medium text-center p-2">
                  Masuk Simpang
                </th>
                <th colSpan={5} className="border border-base-100 text-sm font-medium text-center p-2">
                  Keluar Simpang
                </th>
              </tr>
              <tr className="bg-base-300">
                <th colSpan={3} className="border border-base-100 text-sm font-medium text-center p-1">
                  Kendaraan Bermotor
                </th>
                <th rowSpan={2} className="border border-base-100 text-sm font-medium text-center p-1">
                  Kend. Tak<br />Bermotor<br />
                  <span className="text-xs font-normal">KTB</span>
                </th>
                <th rowSpan={2} className="border border-base-100 text-sm font-medium text-center p-1">
                  Total
                </th>
                <th colSpan={3} className="border border-base-100 text-sm font-medium text-center p-1">
                  Kendaraan Bermotor
                </th>
                <th rowSpan={2} className="border border-base-100 text-sm font-medium text-center p-1">
                  Kend. Tak<br />Bermotor<br />
                  <span className="text-xs font-normal">KTB</span>
                </th>
                <th rowSpan={2} className="border border-base-100 text-sm font-medium text-center p-1">
                  Total
                </th>
              </tr>
              <tr className="bg-base-300">
                <th className="border border-base-100 text-sm font-medium text-center p-1">SM</th>
                <th className="border border-base-100 text-sm font-medium text-center p-1">MP</th>
                <th className="border border-base-100 text-sm font-medium text-center p-1">KS</th>
                <th className="border border-base-100 text-sm font-medium text-center p-1">SM</th>
                <th className="border border-base-100 text-sm font-medium text-center p-1">MP</th>
                <th className="border border-base-100 text-sm font-medium text-center p-1">KS</th>
              </tr>
            </thead>
            <tbody>
              {generateTableRows()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KeluarMasukTable;