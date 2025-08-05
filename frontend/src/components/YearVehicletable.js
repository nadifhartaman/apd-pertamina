import React, { useState, useEffect } from 'react';
// import yearlyData from '@/data/DataTableYear.json';

const YearlyVehicleTable = ({ yearlyData, startDate, setStartDate }) => {
  const [vehicleData, setVehicleData] = useState({ yearlyData: [], lhrtData: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!yearlyData) return;
    setVehicleData(yearlyData);
  }, [yearlyData]);

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (setStartDate) {
      setStartDate(selectedDate);
    }
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>;
  }

  // Generate yearly data rows
  const generateYearlyRows = () => {
    return vehicleData?.yearlyData?.map((yearData, index) => (
      <tr key={`year-${yearData.year}`} className={index % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.year}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.sm || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.mp || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.aup || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.tr || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.bs || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.ts || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.bb || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.tb || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">
          {yearData.data.gandengSemitrailer || 0}
        </td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.ktb || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{yearData.data.total || 0}</td>
      </tr>
    ));
  };

  // Generate LHRT data rows
  const generateLHRTRows = () => {
    return vehicleData?.lhrtData?.map((lhrtData, index) => (
      <tr key={`lhrt-${lhrtData.period}`} className={index % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.period}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.sm || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.mp || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.aup || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.tr || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.bs || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.ts || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.bb || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.tb || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">
          {lhrtData.data.gandengSemitrailer || 0}
        </td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.ktb || 0}</td>
        <td className="border border-base-300 px-2 py-1 text-sm text-center">{lhrtData.data.total || 0}</td>
      </tr>
    ));
  };

  return (
    <div className="mx-auto p-4 overflow-x-auto">
      <div className="flex flex-col w-fit mb-2">
        <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2">
          Pilih Tanggal Mulai:
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate || getCurrentDate()}
          onChange={handleDateChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          max={getCurrentDate()}
        />
      </div>
      <table className="table-auto border-collapse border border-base-300 w-full">
        <thead>
          <tr className="bg-base-300">
            <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
              Tahun
            </th>
            <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
              SM
            </th>
            <th colSpan={3} className="border border-base-100 px-2 py-1 text-sm font-medium">
              MP
            </th>
            <th colSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
              KS
            </th>
            <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
              BB
            </th>
            <th colSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
              TB
            </th>
            <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
              Kend. Tak<br />Bermotor
            </th>
            <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
              Total<br />Kendaraan
            </th>
          </tr>
          <tr className="bg-base-300">
            <th className="border border-base-100 px-2 py-1 text-sm font-medium">MP</th>
            <th className="border border-base-100 px-2 py-1 text-sm font-medium">AUP</th>
            <th className="border border-base-100 px-2 py-1 text-sm font-medium">TR</th>
            <th className="border border-base-100 px-2 py-1 text-sm font-medium">BS</th>
            <th className="border border-base-100 px-2 py-1 text-sm font-medium">TS</th>
            <th className="border border-base-100 px-2 py-1 text-sm font-medium">TB</th>
            <th className="border border-base-100 px-2 py-1 text-sm font-medium">
              Gandeng /<br />Semitrailer
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Yearly data rows */}
          {generateYearlyRows()}

          {/* Divider row */}
          <tr>
            <td colSpan={12} className="border border-base-300 font-semibold px-2 py-1 text-sm text-center bg-base-200">
              Lalu Lintas Harian Rata-Rata Tahunan (kend/hari)
            </td>
          </tr>

          {/* LHRT data rows */}
          {generateLHRTRows()}
        </tbody>
      </table>
    </div>
  );
};

export default YearlyVehicleTable;