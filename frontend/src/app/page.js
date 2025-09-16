"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { BiVideoRecording } from "react-icons/bi";
import { SlGraph } from "react-icons/sl";
import { SiSpeedtest } from "react-icons/si";
import { FaCheck } from "react-icons/fa";
import { IoWarningOutline, IoDocumentTextOutline } from "react-icons/io5";
import MapComponent from '@/components/map/mapComponent';
import { useAPD } from '@/hooks/useAPD';
import { useCameraAPD } from '@/hooks/useCameraAPD';
import CRecapComponent from '@/components/dashboard/cctvRecap'
import TimeSeriesCard from '@/components/dashboard/timeSeries';
import StatsCardGrid from '@/components/dashboard/statsCard';
import ComplianceCard from '@/components/dashboard/compliance';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const DashboardSummary = () => {
  const { dataApd, lastRecord, pagination, page, setPage, loading, todayPerHour, dailyStats } = useAPD();
  const { dataCamAPD, pagination : paginationCAM } = useCameraAPD()
  const [activeTabCCTV, setActiveTabCCTV] = useState('detail');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('today');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('analytics');
  const [timeSeriesRaw, setTimeSeriesRaw] = useState([
    { hour: 0, count: 2 },
    { hour: 1, count: 0 },
    { hour: 2, count: 1 },
    { hour: 3, count: 4 },
    { hour: 23, count: 5 },
  ]);
  // Sample data for charts
  const cameraData = {
    labels: ['Kamera 1', 'Kamera 2', 'Kamera 3', 'Kamera 4', 'Kamera 5'],
    datasets: [{
      label: 'Deteksi APD',
      data: [25, 19, 30, 15, 28],
      backgroundColor: [
        '#ed1b2f',
        '#FCB700',
        '#006db7',
        '#abc62b',
      ],
    }]
  };
  const [statsData, setStatsData] = useState([]);
  const [complianceRaw, setComplianceRaw] = useState([]);

  useEffect(() => {
    if (!dailyStats || !dataCamAPD) return;
    console.log(dailyStats);
    // console.log(dailyStats);
    setStatsData([
      {
        title: "Total Deteksi",
        value: dailyStats?.totalChange?.total ?? 0,
        desc: `${dailyStats?.totalChange?.percentage} dari kemarin`,
        color: "text-[#abc62b]",
        icon: SiSpeedtest,
      },
      {
        title: "Kepatuhan APD",
        value: `${dailyStats?.violationSummary?.percentages?.nonViolation}`,
        desc: "↗︎ 5% dari kemarin",
        color: "text-[#FCB700]",
        icon: FaCheck,
      },
      {
        title: "Pelanggaran",
        value: `${dailyStats?.violationSummary?.percentages?.violation}`,
        desc: "↘︎ 2% dari kemarin",
        color: "text-[#ed1b2f]",
        icon: IoWarningOutline,
      },
      {
        title: "Kamera Aktif",
        value: `${paginationCAM?.statusSummary?.online} / ${paginationCAM?.total || 0}`,
        desc: `${paginationCAM?.total == paginationCAM.statusSummary?.online ? "Semua Online" : `${paginationCAM?.statusSummary?.offline} Camera Offline`}`,
        color: "text-[#006db7]",
        icon: BiVideoRecording,
      },
    ]);

    setComplianceRaw([
      { label: "Sesuai APD", value: `${dailyStats?.violationSummary?.totals?.violation || 1}` },
      { label: "Tidak Sesuai APD", value: `${dailyStats?.violationSummary?.totals?.nonViolation || 1}` },
    ]);

  }, [dailyStats, dataCamAPD]);

  const complianceData = {
    labels: ['Sesuai APD', 'Tidak Sesuai APD'],
    datasets: [{
      data: [75, 25],
      backgroundColor: [
        '#abc62b',
        '#ed1b2f'
      ],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const downloadPDF = () => {
    // Mock PDF download functionality
    const element = document.createElement('a');
    const file = new Blob(['Mock PDF Report Content'], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = `laporan-rekap-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Summary</h1>
          <p className="text-gray-600">Monitoring sistem kepatuhan APD secara real-time</p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-lifted mb-6">
          <button
            className={`tab items-center flex gap-1 tab-lg ${activeTab === 'analytics' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BsFileEarmarkBarGraph size={18} /> Grafik Analitik
          </button>
          <button
            className={`tab items-center flex gap-1 tab-lg ${activeTab === 'cctv' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('cctv')}
          >
            <BiVideoRecording size={18} /> CCTV Rekap
          </button>
        </div>

        {/* Filters */}
        <div className="card bg-white border-gray-100 border mb-6">
          <div className="card-body">
            {/* <h3 className="card-title text-lg mb-4">Filter Data</h3> */}
            <div className="flex flex-wrap gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Rentang Waktu</span>
                </label>
                <select
                  className="select select-sm select-bordered w-full max-w-xs"
                  value={selectedTimeFilter}
                  onChange={(e) => setSelectedTimeFilter(e.target.value)}
                >
                  <option value="today">Hari Ini</option>
                  <option value="week">Minggu Ini</option>
                  <option value="month">Bulan Ini</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Lokasi Kamera</span>
                </label>
                <select
                  className="select select-sm select-bordered w-full max-w-xs"
                  value={selectedLocationFilter}
                  onChange={(e) => setSelectedLocationFilter(e.target.value)}
                >
                  <option value="all">Semua Lokasi</option>
                  <option value="produksi-a">Area Produksi A</option>
                  <option value="produksi-b">Area Produksi B</option>
                  <option value="gudang">Gudang</option>
                  <option value="kantor">Kantor</option>
                </select>
              </div>

              <div className="form-control flex items-end gap-2">
                <button
                  className="btn btn-sm shadow-none"
                  onClick={downloadPDF}
                >
                  <IoDocumentTextOutline size={16} /> Unduh PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Camera Detection Chart */}
            <div className="card bg-white border-gray-100 border">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4"><BiVideoRecording size={18} /> Deteksi per Kamera</h3>
                <div className="h-64">
                  <Bar data={cameraData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Compliance Chart */}
            <div className="card bg-white border-gray-100 border">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Tingkat Kepatuhan</h3>
                <div className="h-64">
                  {/* <Doughnut data={complianceData} options={doughnutOptions} /> */}
                  <ComplianceCard rawData={complianceRaw}/>
                </div>
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="card bg-white border-gray-100 border lg:col-span-2 xl:col-span-1">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4"><SlGraph size={18} /> Tren Waktu</h3>
                <div className="h-64">
                  <TimeSeriesCard rawData={dailyStats.hourly ? dailyStats.hourly : timeSeriesRaw} />
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <StatsCardGrid stats={statsData} />
          </div>
        )}

        {activeTab === 'cctv' && (
          <CRecapComponent dataApd={dataApd} pagination={pagination} page={page} setPage={setPage} lastRecord={lastRecord} todayPerHour={todayPerHour} setActiveTabCCTV={setActiveTabCCTV} activeTabCCTV={activeTabCCTV} />
        )}
      </div>
      <MapComponent />
    </div>
  );
};

export default DashboardSummary;