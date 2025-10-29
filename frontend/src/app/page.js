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
import CRecapComponent, { CRecapTableComponent, CRecapImageComponent } from '@/components/dashboard/cctvRecap'
import TimeSeriesCard from '@/components/dashboard/timeSeries';
import StatsCardGrid from '@/components/dashboard/statsCard';
import { StatsCardGridReport } from '@/components/dashboard/statsCard';
import ComplianceCard from '@/components/dashboard/compliance';
import CameraDetectionChart from '@/components/dashboard/cameraDetection'
import ExportPdfComponent from '@/components/dashboard/exportReport';
import { createPortal } from "react-dom";
import ListPreview from '@/components/dashboard/listPreview';

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
  const { dataApd, lastRecord, pagination, page, setPage, loading, todayPerHour, dailyStats, summaryViolation, setFilterType, filterType, setStartDate, setEndDate, startDate, endDate, selectedLocationFilter, setSelectedLocationFilter, dataReportApd, loadData, today } = useAPD();
  const { dataCamAPD, pagination: paginationCAM, listCameraAPD } = useCameraAPD()
  const [activeTabCCTV, setActiveTabCCTV] = useState('detail');
  // const [selectedTimeFilter, setSelectedTimeFilter] = useState('today');
  const [activeTab, setActiveTab] = useState('analytics');
  const [timeSeriesRaw, setTimeSeriesRaw] = useState([
    { hour: 0, count: 2 },
    { hour: 1, count: 0 },
    { hour: 2, count: 1 },
    { hour: 3, count: 4 },
    { hour: 23, count: 5 },
  ]);


  const [statsData, setStatsData] = useState([]);
  const [complianceRaw, setComplianceRaw] = useState([]);
  const [dataViolation, setDataViolation] = useState([]);

  const loadOverlay = loadData
    ? createPortal(
      <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
          <p className="text-gray-700 font-medium">Loading Mengambil Data...</p>
        </div>
      </div>,
      document.body
    )
    : null;

  useEffect(() => {
    if (!dailyStats || !dataCamAPD || !summaryViolation) return;
    console.log(summaryViolation);
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
        value: `${dailyStats?.violationSummary?.totals?.nonViolation}`,
        desc: `${dailyStats?.violationSummary?.totals?.violation >= dailyStats?.violationSummary?.totals?.nonViolation ? "↘︎" : "↗︎"}  ${dailyStats?.violationSummary?.percentages?.nonViolation} dari kemarin`,
        color: "text-[#FCB700]",
        icon: FaCheck,
      },
      {
        title: "Pelanggaran",
        value: `${dailyStats?.violationSummary?.totals?.violation}`,
        desc: `${dailyStats?.violationSummary?.totals?.violation <= dailyStats?.violationSummary?.totals?.nonViolation ? "↘︎" : "↗︎"} ${dailyStats?.violationSummary?.percentages?.violation} dari kemarin`,
        color: "text-[#ed1b2f]",
        icon: IoWarningOutline,
      },
      {
        title: "Kamera Aktif",
        value: `${paginationCAM?.statusSummary?.online || 0} / ${paginationCAM?.total || 0}`,
        desc: `${paginationCAM?.total == paginationCAM?.statusSummary?.online ? "Semua Online" : `${paginationCAM?.statusSummary?.offline} Camera Offline`}`,
        color: "text-[#006db7]",
        icon: BiVideoRecording,
      },
    ]);

    setComplianceRaw([
      { label: "Sesuai APD", value: `${dailyStats?.violationSummary?.totals?.nonViolation}` },
      { label: "Tidak Sesuai APD", value: `${dailyStats?.violationSummary?.totals?.violation}` },
    ]);

    const mappedData = Object.entries(summaryViolation).map(([id, data]) => {
      return {
        label: `Kamera ${id}`,
        value: data.totals.violation // atau bisa pakai percentage
          ? parseFloat(data.totals.violation) // misal ambil persen
          : 0,
      };
    });

    setDataViolation(mappedData);

  }, [dailyStats, dataCamAPD, summaryViolation]);

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };
  const pages1 = chunkArray(dataReportApd, 40);
  const pages2 = chunkArray(dataReportApd, 21);
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
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="today">Hari Ini</option>
                  <option value="week">Minggu Ini</option>
                  <option value="month">Bulan Ini</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {filterType === 'custom' && (
                <>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Start Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-sm input-bordered w-full max-w-xs"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">End Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-sm input-bordered w-full max-w-xs"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}
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
                  {
                    listCameraAPD.map((cam) => (<option key={cam.id} value={cam.id}>{cam.name}</option>))
                  }
                </select>
              </div>

              <div className="form-control flex items-end gap-2">
                <ExportPdfComponent fileName="Laporan_Survey">
                  <div data-page-break>
                    <div className='flex flex-col gap-5'>
                      <div className="w-full text-center border-b-1 border-gray-700 gap-0 p-5 mb-4">
                        <div className="text-lg font-bold uppercase">
                          Pertamina Patra Niaga Regional Jawa Bagian Barat
                        </div>
                        <div className="text-md font-semibold">
                          Laporan Rekapitulasi Kepatuhan APD
                        </div>
                        <div className="text-sm mb-2">
                          Jl. Raya Soreang No. 15, Bandung – Telp. (022) 1234567
                        </div>
                      </div>
                    </div>
                    <div className='pt-8 px-10 w-1/2'>
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className='w-1/4 align-top text-xs'>Periode Laporan</td>
                            <td className='w-1/2 align-top text-xs'>: {filterType === 'custom' ? `${startDate} s/d ${endDate}` : filterType === 'today' ? 'Hari Ini' : filterType === 'week' ? 'Minggu Ini' : filterType === 'month' ? 'Bulan Ini' : ''} {(() => {
                              if (filterType === "today") {
                                return today;
                              }
                              if (filterType === "week") {
                                const day = parseInt(today.split("-")[2], 10);
                                const weekNumber = Math.ceil(day / 7);
                                return `Minggu ke-${weekNumber}`;
                              }
                              if (filterType === "month") {
                                return new Date().toLocaleDateString('id-ID', { month: 'long' })
                              }
                              return "";
                            })()}</td>
                          </tr>
                          <tr>
                            <td className='w-1/4 align-top text-xs'>Lokasi Kamera</td>
                            <td className='w-1/2 align-top text-xs'>: {selectedLocationFilter === 'all' ? 'Semua Lokasi' : listCameraAPD.find(cam => cam.id === selectedLocationFilter)?.name || 'Unknown'}</td>
                          </tr>
                          <tr>
                            <td className='w-1/4 align-top text-xs'>Tanggal Cetak</td>
                            <td className='w-1/2 align-top text-xs'>: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className='p-8'>
                      <div className='my-5'>
                        <StatsCardGridReport stats={statsData} />
                      </div>
                      <div className="h-72 my-5 flex gap-5 w-full justify-center">
                        <div className='w-1/2 h-full align-middle m-auto'>
                          <CameraDetectionChart data={dataViolation} />
                        </div>
                        <div className='w-1/2 align-middle m-auto'>
                          <div className='h-64 m-auto'>
                            <ComplianceCard rawData={complianceRaw} />
                          </div>
                        </div>
                      </div>
                      <div className='w-full my-5 h-80 mt-5'>
                        <TimeSeriesCard rawData={dailyStats.hourly ? dailyStats.hourly : timeSeriesRaw} />
                      </div>
                    </div>
                  </div>

                  {/* <div data-page-break>
                    <div className='pt-8 px-10'>
                      <CRecapTableComponent dataApd={dataReportApd} />
                    </div>
                  </div> */}
                  <div className="pt-8 px-10">
                    {pages1.map((page, i) => (
                      <div data-page-break key={i}>
                        <CRecapTableComponent dataApd={page} />
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 px-10">
                    {pages2.map((page, i) => (
                      <div data-page-break key={i}>
                        <CRecapImageComponent dataApd={page} />
                      </div>
                    ))}
                  </div>

                  {/* <div data-page-break>
                    <div className='pt-8 px-10'>
                      <CRecapImageComponent dataApd={dataReportApd} />
                    </div>
                  </div> */}
                </ExportPdfComponent>
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
                  <CameraDetectionChart
                    data={dataViolation}
                  />
                </div>
              </div>
            </div>

            {/* Compliance Chart */}
            <div className="card bg-white border-gray-100 border">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Tingkat Kepatuhan</h3>
                <div className="h-64 m-auto">
                  {/* <Doughnut data={complianceData} options={doughnutOptions} /> */}
                  <ComplianceCard rawData={complianceRaw} />
                </div>
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="card bg-white border-gray-100 border lg:col-span-2 xl:col-span-1">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4"><SlGraph size={18} /> Tren Waktu</h3>
                <div className="h-64">
                  <TimeSeriesCard rawData={dailyStats.hourly ? dailyStats.hourly : timeSeriesRaw} maxRotation />
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
      {/* <video src="http://localhost:3001/api/stream/start?url=rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov&key=camera1" controls></video>
       */}
      {/* <div className="aspect-video">
        <UniversalCameraPreview
          url={"http://localhost:3001/hls/camera1/index.m3u8"}
          customcss={"w-full h-full object-cover"}
          cameraId={location?.id}
        />
      </div> */}
      <ListPreview />
      {loadOverlay}
    </div>
  );
};

export default DashboardSummary;