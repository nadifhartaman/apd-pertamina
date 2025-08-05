"use client";

import React, { useState, useEffect } from 'react';
// import monthlyData from '@/data/DataTableDaysMonth.json';

const DaysVehicleTable = ({ monthlyData, startDate, endDate, setStartDate, setEndDate, selectedYear: parentSelectedYear, selectedMonth: parentSelectedMonth, setSelectedMonth: setParentSelectedMonth,
  setSelectedYear: setParentSelectedYear, type,
}) => {

  const [isDateRangeMode, setIsDateRangeMode] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    dailyData: [],
    lhrkData: []
  });
  const [vehicleDataMonth, setVehicleDataMonth] = useState({
    dailyData: [],
    lhrkData: []
  });

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonthNumber, setSelectedMonthNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!monthlyData) return;


    if (type === "dailyMonth" && monthlyData?.dailyData?.length > 0) {
      setVehicleDataMonth(monthlyData)
      setSelectedYear(parentSelectedYear);
      setSelectedMonthNumber(parseInt(parentSelectedMonth))
      const firstMonthData = monthlyData.dailyData[0];
      const monthName = firstMonthData.month;
      const year = firstMonthData.year;

      setSelectedMonth(monthName);
      setSelectedYear(year);

      if (firstMonthData.days && firstMonthData.days.length > 0) {
        setStartDate(firstMonthData.days[0].date);
        setEndDate(firstMonthData.days[firstMonthData.days.length - 1].date);
      }
    } else if (type === "dailyRange" && monthlyData?.dailyData?.length > 0) {
      setVehicleData(monthlyData);
      const allDays = getAllDaysFromData(monthlyData.dailyData);
      if (allDays.length > 0) {
        const sortedDays = allDays.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (!startDate) setStartDate(sortedDays[0].date);
        if (!endDate) setEndDate(sortedDays[sortedDays.length - 1].date);
      }
    }

    setLoading(false);
  }, [monthlyData, type, setStartDate, setEndDate, setParentSelectedMonth, setParentSelectedYear]);

  const getAllDaysFromData = (dailyData) => {
    return dailyData.flatMap(month => month.days || []);
  };

  const getMonthName = (monthStr) => {
    const date = new Date(Number(monthStr) - 1); // JS month: 0-based
    return date.toLocaleString('id-ID', { month: 'long' });
  };

  useEffect(() => {
    if (!selectedMonth || !vehicleData.dailyData) return;
    console.log(selectedMonth)
    const monthData = vehicleData.dailyData.find((m) => m.month === selectedMonth);
    if (monthData && monthData.days?.length > 0) {
      setStartDate(monthData.days[0].date);
      setEndDate(monthData.days[monthData.days.length - 1].date);
    }
  }, [selectedMonth, vehicleData, setStartDate, setEndDate]);

  // Saat user ganti tahun
  const handleYearChange = (e) => {
    let newYear = e.target.value;

    if (newYear.length > 4) return;
    if (newYear && !/^\d*$/.test(newYear)) return;

    setSelectedYear(newYear);
    setParentSelectedYear(newYear);
  };

  // Saat user ganti bulan
  const handleMonthChange = (e) => {
    let monthNum = e.target.value;

    // Batasi angka 1-12 dan angka saja
    if (monthNum.length > 2) return;
    if (monthNum && !/^\d*$/.test(monthNum)) return;

    if (monthNum.length === 1 && monthNum !== "0") monthNum = "0" + monthNum; // leading zero

    // Pastikan bulan valid (01-12)
    if (monthNum !== "" && (parseInt(monthNum) < 1 || parseInt(monthNum) > 12)) return;

    setSelectedMonthNumber(monthNum);
    setSelectedMonth(monthNum);
    setParentSelectedMonth(monthNum);
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

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const getAllDaysData = () => {
    return vehicleData.dailyData || [];
  };

  // Get days data based on selection (month or date range)
  const getDaysData = () => {
    if (type === "dailyRange" && startDate && endDate) {
      const allDays = getAllDaysData();
      return allDays.filter(day => {
        const date = new Date(day.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      }).sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      console.log(getMonthName(selectedMonthNumber))
      const monthData = vehicleDataMonth.dailyData?.find(month => month.month === selectedMonth);
      return monthData ? monthData.days : [];
    }
  };

  // Format date to display nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  };

  const formatDateNoDays = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  // Check if a date is a weekend (Saturday or Sunday)
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const getWorkdayIndicator = (dateString) => {
    return isWeekend(dateString) ? 'Akhir Pekan' : 'Hari Kerja';
  };

  const getWeekOfMonth = (dateString) => {
    const date = new Date(dateString);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    const daysSinceFirstDayOfMonth = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));

    return Math.floor(daysSinceFirstDayOfMonth / 7) + 1;
  };

  const getWeekAndDayInfo = (dateString) => {
    const weekNumber = getWeekOfMonth(dateString);
    const workdayType = getWorkdayIndicator(dateString);

    return `P(${weekNumber}) - ${workdayType}`;
  };

  // Generate rows for daily data
  const generateDailyRows = () => {
    const daysData = getDaysData();
    let rows = [];


    if (!daysData || daysData.length === 0) {
      return (
        <tr>
          <td colSpan="13" className="text-center py-4 border border-base-300">
            Tidak ada data harian tersedia untuk periode yang dipilih
          </td>
        </tr>
      );
    }

    daysData.map((day, index) => {
      rows.push(
        <tr key={`day-${index}`} className={index % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}>
          <td className="border border-base-300 text-sm text-center">{getWeekAndDayInfo(day.date)}</td>
          <td className="border border-base-300 text-sm text-center">{formatDateNoDays(day.date)}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.sm || 0 : day?.sm || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.mp || 0 : day?.mp || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.aup || 0 : day?.aup || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.trMp || 0 : day?.trMp || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.bs || 0 : day?.bs || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.ts || 0 : day?.ts || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.bb || 0 : day?.bb || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.tb || 0 : day?.tb || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.gandengSemitrailer || 0 : day?.gandengSemitrailer || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.ktb || 0 : day?.ktb || 0}</td>
          <td className="border border-base-300 text-sm text-center">{type === "dailyMonth" ? day?.data?.total || 0 : day?.total || 0}</td>
        </tr>
      )
    });

    // rows.push(
    //   <tr key="divider-row">
    //     <td colSpan={13} className="border border-base-300 font-semibold text-sm text-center bg-base-200">
    //       Lalu Lintas Harian Rata-Rata (kend/hari)
    //     </td>
    //   </tr>
    // );

    return rows;
  };

  // Calculate daily totals for the selected period
  const calculateDailyTotal = () => {
    const daysData = getDaysData();
    const totals = {
      sm: 0, mp: 0, aup: 0, trMp: 0, bs: 0, ts: 0, bb: 0, tb: 0, gandengSemitrailer: 0, ktb: 0, total: 0
    };

    if (daysData && daysData.length > 0) {
      daysData.forEach(day => {
        Object.keys(totals).forEach(key => {
          totals[key] += day.data?.[key] || 0;
        });
      });
    }

    return totals;
  };

  // Calculate daily average for the selected period
  const calculateDailyAverage = () => {
    const daysData = getDaysData();
    const totals = calculateDailyTotal();
    const daysCount = daysData.length || 1;

    // Create an object with the averages for each vehicle type
    const averages = {};
    Object.entries(totals).forEach(([key, value]) => {
      averages[key] = Math.round(value / daysCount);
    });

    return averages;
  };

  // Get min and max dates from all available data for the date inputs
  const getDateBoundaries = () => {
    const allDays = getAllDaysData();
    if (allDays.length === 0) return { min: '', max: '' };

    const sortedDates = [...allDays].sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      min: sortedDates[0].date,
      max: sortedDates[sortedDates.length - 1].date
    };
  };

  const dateBoundaries = getDateBoundaries();

  return (
    <div className="mx-auto p-4">
      <div className="items-center flex mb-4 flex-wrap">

        {type === "dailyRange" ? (
          <div className="flex flex-wrap items-center not-lg:my-2 gap-4">
            <div className="flex gap-2 items-center">
              <label htmlFor="start-date" className="mr-2 font-medium">Dari:</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={handleStartDateChange}
                max={endDate}
                className="px-5 py-1 input input-md"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="end-date" className="mr-2 font-medium">Sampai:</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                className="px-5 py-1 input input-md"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <label htmlFor="year-input" className="mr-2 font-medium text-nowrap">
              Pilih Tahun:
            </label>
            <input
              type="number"
              id="year-input"
              min="2000"
              max="2100"
              value={selectedYear || ''}
              onChange={handleYearChange}
              className="input input-md w-24"
              placeholder="YYYY"
            />

            <label htmlFor="month-input" className="ml-4 mr-2 font-medium text-nowrap">
              Pilih Bulan:
            </label>
            <input
              type="number"
              id="month-input"
              min="1"
              max="12"
              value={selectedMonthNumber}
              onChange={handleMonthChange}
              className="input input-md w-20"
              placeholder="MM"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-base-300 w-full">
          <thead>
            <tr className="bg-base-300">
              <th rowSpan={3} className="border border-base-100 text-sm font-medium">
                Pekan
              </th>
              <th rowSpan={3} className="border border-base-100 text-sm font-medium">
                Tanggal
              </th>
              <th colSpan={9} className="border border-base-100 text-sm font-medium text-center">
                Kendaraan Bermotor
              </th>
              <th rowSpan={1} className="border border-base-100 text-sm font-medium text-center">
                Kend. Tak<br />Bermotor
              </th>
              <th rowSpan={3} className="border border-base-100 text-sm font-medium text-center">
                Total<br />Kendaraan
              </th>
            </tr>
            <tr className="bg-base-300">
              <th rowSpan={2} className="border border-base-100 text-sm font-medium text-center">SM</th>
              <th colSpan={3} className="border border-base-100 text-sm font-medium text-center">MP</th>
              <th colSpan={2} className="border border-base-100 text-sm font-medium text-center">KS</th>
              <th rowSpan={2} className="border border-base-100 text-sm font-medium text-center">BB</th>
              <th colSpan={2} className="border border-base-100 text-sm font-medium text-center">TB</th>
              <th rowSpan={2} className="border border-base-100 text-sm font-medium">KTB</th>
            </tr>
            <tr className="bg-base-300">
              <th className="border border-base-100 text-sm font-medium">MP</th>
              <th className="border border-base-100 text-sm font-medium">AUP</th>
              <th className="border border-base-100 text-sm font-medium">TR</th>
              <th className="border border-base-100 text-sm font-medium">BS</th>
              <th className="border border-base-100 text-sm font-medium">TS</th>
              <th className="border border-base-100 text-sm font-medium">TB</th>
              <th className="border border-base-100 text-sm font-medium">Gandeng /<br />Semitrailer</th>
            </tr>
          </thead>
          <tbody>
            {generateDailyRows()}

            {/* Daily average row */}
            {(selectedMonth || (isDateRangeMode && startDate && endDate)) && (
              <tr className="bg-base-200 font-medium">
                <td className="border border-base-300 text-sm text-center" colSpan={2}>LHR</td>
                {Object.entries(calculateDailyAverage()).map(([key, value], idx) => (
                  <td key={idx} className="border border-base-300 text-sm text-center">
                    {value}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Display information about the selected period */}
      {/* {getDaysData().length > 0 && (
        <div className="mt-4 text-sm">
          <p>
            Periode data: {formatDateNoDays(getDaysData()[0].date)} - {formatDateNoDays(getDaysData()[getDaysData().length - 1].date)}
          </p>
          <p>Jumlah hari: {getDaysData().length}</p>
        </div>
      )} */}
    </div>
  );
};

export default DaysVehicleTable;