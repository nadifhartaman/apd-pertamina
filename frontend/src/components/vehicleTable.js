"use client";

import React, { useState, useEffect } from 'react';
import HourVehicleTable from '@/components/HourVehicleTable';
import MonthlyVehicleTable from '@/components/monthlyTable';
import DaysVehicleTable from '@/components/DaysVehicleTable';
import YearVehicleTable from '@/components/YearVehicletable';
import { survey } from '@/lib/apiService';

const classificationMap = {
  "PKJI 2023 Luar Kota": "luar_kota",
  "PKJI 2023 Dalam Kota": "dalam_kota",
  "PKJI 2023 Tipikal": "tipikal",
};

const VehicleTable = ({ activeCamera, activeInterval, activePendekatan, activePergerakan, activeClassification }) => {
  // const initialMonth = new Date().toISOString().slice(0, 7); // format: 'YYYY-MM'
  const today = new Date().toISOString().split('T')[0];
  const year = today.split('-')[0];
  const month = today.split('-')[1];

  const [activeTab, setActiveTab] = useState('hourly');
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const formatDateToInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatDateToAPI = (dateStr) => dateStr.replace(/-/g, '/');

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [dateInput, setDateInput] = useState(formatDateToInput(yesterday));

  const fetchSurvey = async () => {
    if (!activeCamera) return;

    const classificationParam = classificationMap[activeClassification] || activeClassification?.toLowerCase().replace(/\s+/g, '_');
    const params = {
      camera_id: activeCamera,
      date: formatDateToAPI(dateInput),
      interval: activeInterval || '',
      approach: activePendekatan?.toLowerCase() || '',
      direction: activePergerakan || '',
      classification: classificationParam,
      reportType: activeTab,
      month: selectedMonth,
      year: selectedYear,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      setLoading(true);
      const res = await survey.getAll(
        params.camera_id,
        params.date,
        params.interval,
        params.approach,
        params.classification,
        params.reportType,
        params.direction,
        params.month,
        params.year,
        params.startDate,
        params.endDate,
      );
      setVehicleData(res?.data?.vehicleData || res?.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvey();
  }, [activeCamera, activeInterval, activePendekatan, activePergerakan, activeClassification, dateInput, activeTab, startDate, endDate, selectedMonth, selectedYear]);

  return (
    <div className="mx-auto">
      <h2 className="text-xl font-bold mb-4">Data Pemantauan Kendaraan</h2>

      <div className="tabs tabs-boxed mb-4 space-x-2 flex space-y-2 px-5">
        {activeTab === 'hourly' && (
          <div className="flex gap-2 items-center w-fit">
            <label className="mr-2 font-medium">Pilih Tanggal:</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>
        )}
        {['hourly', 'monthly', 'dailyMonth', 'dailyRange', 'yearly'].map((tab) => (
          <button
            key={tab}
            className={`btn tab ${activeTab === tab ? 'tab-active bg-[#314385]/80 border-none text-white' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {{
              hourly: 'Data Harian Per Hari',
              monthly: 'Data Bulanan',
              dailyMonth: 'Data Harian per Bulan',
              dailyRange: 'Data Harian',
              yearly: 'Data Tahunan'
            }[tab]}
          </button>
        ))}
      </div>

      <div className="rounded-lg">
        {!loading ? (
          <>
            {activeTab === 'hourly' && (
              <HourVehicleTable
                statusHour={true}
                vehicleData={vehicleData}
                classification={activeClassification}
                pdf={false}
              />
            )}
          </>
        ) : (
          <div className="m-5">Loading data...</div>
        )}

        {activeTab === 'monthly' && <MonthlyVehicleTable monthlyData={vehicleData} selectedYear={selectedYear} setSelectedYear={setSelectedYear} loading={loading} />}
        {activeTab === 'dailyMonth' &&
          <DaysVehicleTable
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
            monthlyData={vehicleData}
            setSelectedMonth={setSelectedMonth}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            type={activeTab}
          />
        }

        {activeTab === 'dailyRange' &&
          <DaysVehicleTable
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
            monthlyData={vehicleData}
            setSelectedMonth={setSelectedMonth}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            type={activeTab}
          />
        }
        {activeTab === 'yearly' && <YearVehicleTable yearlyData={vehicleData}
          setStartDate={setStartDate} startDate={startDate}
        />}
        {/* </> */}
        {/* )} */}
      </div>
    </div>
  );
};

export default VehicleTable;
