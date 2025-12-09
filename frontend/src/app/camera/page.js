"use client";

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  BiVideoRecording,
} from "react-icons/bi";
import { SlGraph } from "react-icons/sl";
import { FaCheck, FaVideo, FaMapMarkerAlt } from "react-icons/fa";
import {
  IoWarningOutline,
  IoDocumentTextOutline,
  IoInformationCircle,
} from "react-icons/io5";
import { MdVideoSettings, MdLocationOn } from "react-icons/md";
import CameraPreview from "@/components/dialog/cameraPreview";
import UniversalCameraPreview from "@/components/manager/universalCheck";
import { useCameraAPD } from '@/hooks/useCameraAPD';
import TimeSeriesCard from '@/components/dashboard/timeSeries';
import { useAPD } from "@/hooks/useAPD";
import ComplianceCard from '@/components/dashboard/compliance';
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { SiSpeedtest } from "react-icons/si";
import ExportPdfComponent from '@/components/dashboard/exportReport';
import { StatsCardGridReport } from '@/components/dashboard/statsCard';
import CameraDetectionChart from '@/components/dashboard/cameraDetection'
import CRecapComponent, { CRecapTableComponent, CRecapImageComponent } from '@/components/dashboard/cctvRecap'

// Register Chart.js
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

const DashboardPerKamera = () => {
  const { dataApd, lastRecord, pagination, page, setPage, loading, todayPerHour, dailyStats, summaryViolation, setFilterType, filterType, setStartDate, setEndDate, startDate, endDate, selectedLocationFilter, setSelectedLocationFilter, dataReportApd, loadData, today, todayPerWeek } = useAPD();
  const { dataCamAPD, pagination: paginationCAM, listCameraAPD, fetchCamAPDById } = useCameraAPD()
  const [selectedCamera, setSelectedCamera] = useState("");
  const [camDetail, setCamDet] = useState({});
  const [streamKeys, setStreamKeys] = useState({});
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("today");
  const [activeTab, setActiveTab] = useState("analytics");
  const [statsData, setStatsData] = useState([]);
  const [complianceRaw, setComplianceRaw] = useState([]);
  const [dataViolation, setDataViolation] = useState([]);
  const [timeSeriesRaw, setTimeSeriesRaw] = useState([
    { hour: 0, count: 2 },
    { hour: 1, count: 0 },
    { hour: 2, count: 1 },
    { hour: 3, count: 4 },
    { hour: 23, count: 5 },
  ]);
  const [activeTabCCTV, setActiveTabCCTV] = useState('detail');

  useEffect(() => {
    if (selectedCamera !== 0) {
      const loadCamera = async () => {
        const cam = await fetchCamAPDById(selectedCamera);
        setCamDet(cam);
        
        // Fetch stream key if RTSP
        if (cam.rtsp_url?.includes("rtsp")) {
          try {
            const response = await fetch(`http://localhost:3001/api/stream/${cam.channel || cam.id}`);
            const data = await response.json();
            setStreamKeys(prev => ({ ...prev, [cam.id]: data.streamKey }));
          } catch (err) {
            console.error(`Error fetching stream key for ${cam.name}:`, err);
            setStreamKeys(prev => ({ ...prev, [cam.id]: cam.channel || `Channel${cam.id}` }));
          }
        }
      };
      loadCamera();
    }
    setSelectedLocationFilter(selectedCamera)
  }, [selectedCamera]);


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

  const formattedCameras = dataCamAPD.map((cam) => {
    let lat = "";
    let long = "";
    if (cam.location) {
      const parts = cam.location.split(",").map((val) => val.trim());
      if (parts.length === 2) {
        lat = parts[0];
        long = parts[1];
      }
    }
    return {
      id: cam.id,
      name: cam.name || `Camera ${cam.id}`,
      location: cam.location,
      lat,
      long,
      description: cam.description || "Camera location",
      status: cam.status || "offline",
      channel: cam.channel || "N/A",
      rtsp_url: cam.rtsp_url || "",
      resolution: cam.resolution || "1920x1080",
      fps: cam.fps || 30,
    };
  });

  const selectedCameraData = formattedCameras.find(
    (cam) => cam.id === selectedCamera
  );

  // Chart config
  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };
  const doughnutOptions = { responsive: true };

  const getHourlyDetectionData = () => ({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Deteksi",
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20)),
        borderColor: "#006db7",
        backgroundColor: "oklch(70% 0.2 250)",
      },
    ],
  });

  const getComplianceData = () => ({
    labels: ["Patuh", "Tidak Patuh"],
    datasets: [
      {
        data: [82, 18],
        backgroundColor: ["#abc62b", "#ed1b2f"],
      },
    ],
  });

  const getWeeklyTrendData = () => ({
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    datasets: [
      {
        label: "Deteksi",
        data: Array.from({ length: 7 }, () =>
          Math.floor(Math.random() * 100)
        ),
        backgroundColor: "#006db7",
      },
    ],
  });

  const getDetectionResults = () => [
    {
      id: 1,
      timestamp: "2025-08-29 08:00",
      type: "Pelanggaran APD",
      confidence: "92%",
      helmet: false,
      vest: true,
      boots: false,
    },
    {
      id: 2,
      timestamp: "2025-08-29 09:15",
      type: "Patuh",
      confidence: "88%",
      helmet: true,
      vest: true,
      boots: true,
    },
  ];

  // Download PDF
  const downloadPDF = async () => {
    if (!selectedCameraData) {
      alert("Pilih kamera terlebih dahulu");
      return;
    }
    const element = document.querySelector("#camera-report");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(
      `laporan-${selectedCameraData.name}-${new Date()
        .toISOString()
        .split("T")[0]}.pdf`
    );
  };

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
    <div className="min-h-fit w-full p-6">
      <div className="w-full h-fit overflow-y-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Per Kamera
          </h1>
          <p className="text-gray-600">
            Monitoring detail sistem kepatuhan APD per kamera
          </p>
        </div>

        {/* Camera Selection */}
        <div className="card bg-white border-gray-100 border mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4 flex items-center gap-2">
              <FaVideo className="text-blue-600" />
              Pilih Kamera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataCamAPD.map((camera) => (
                <div
                  key={camera.id}
                  className={`card border cursor-pointer transition-all hover:shadow-md ${selectedCamera === camera.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setSelectedCamera(camera.id)}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {camera.name}
                      </h4>
                      <div
                        className={`w-3 h-3 rounded-full ${camera.status === "online"
                          ? "bg-green-500"
                          : "bg-red-500"
                          }`}
                      ></div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MdLocationOn size={14} />
                        <span className="truncate">{camera.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdVideoSettings size={14} />
                        <span>{camera.channel}</span>
                      </div>
                      <p className="text-xs mt-2">{camera.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Camera Info & Filters */}
        {selectedCamera && (
          <div id="camera-report" className="card bg-white border-gray-100 border mb-6">
            <div className="card-body">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-[#006db7]">
                    <BiVideoRecording size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {selectedCameraData?.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt size={12} />
                        {selectedCameraData?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdVideoSettings size={12} />
                        {selectedCameraData?.channel}
                      </span>
                      <span
                        className={`flex items-center gap-1 ${selectedCameraData?.status === "online"
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${selectedCameraData?.status === "online"
                            ? "bg-green-500"
                            : "bg-red-500"
                            }`}
                        ></div>
                        {selectedCameraData?.status === "online"
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
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
                  {/* <div className="form-control">
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
                  </div> */}

                  <div className="form-control flex items-end">
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
                      <div data-page-break>
                        <div className='p-8'>
                          <div className="h-80 my-5 flex gap-5 w-full justify-center">
                            <TimeSeriesCard rawData={todayPerWeek.data ? todayPerWeek.data : timeSeriesRaw} filterType={filterType} type={"week"} maxRotation chartType="Bar" />
                          </div>
                        </div>
                      </div>
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
                    </ExportPdfComponent>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        {selectedCamera && (
          <div className="tabs tabs-lifted mb-6">
            <button
              className={`tab items-center flex gap-1 tab-lg ${activeTab === "analytics" ? "tab-active" : ""
                }`}
              onClick={() => setActiveTab("analytics")}
            >
              <SlGraph size={18} /> Grafik Analitik
            </button>
            <button
              className={`tab items-center flex gap-1 tab-lg ${activeTab === "deteksi" ? "tab-active" : ""
                }`}
              onClick={() => setActiveTab("deteksi")}
            >
              <IoInformationCircle size={18} /> Hasil Deteksi
            </button>
            <button
              className={`tab items-center flex gap-1 tab-lg ${activeTab === "camera" ? "tab-active" : ""
                }`}
              onClick={() => setActiveTab("camera")}
            >
              <FaVideo size={18} /> Video Camera
            </button>
          </div>
        )}

        {/* Content */}
        {!selectedCamera ? (
          <div className="card bg-white border-gray-100 border">
            <div className="card-body text-center py-16">
              <BiVideoRecording
                size={64}
                className="mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Pilih Kamera
              </h3>
              <p className="text-gray-500">
                Silakan pilih kamera dari daftar di atas untuk melihat dashboard
                analitik
              </p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "analytics" && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className="card bg-white border-gray-100 border xl:col-span-2">
                    <div className="card-body">
                      <h3 className="card-title text-lg mb-4">
                        <SlGraph size={18} />
                        Deteksi per Jam
                      </h3>
                      <div className="h-64">
                        <TimeSeriesCard rawData={dailyStats.hourly ? dailyStats.hourly : timeSeriesRaw} maxRotation />
                        {/* <Line data={getHourlyDetectionData()} options={chartOptions} /> */}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-white border-gray-100 border">
                    <div className="card-body">
                      <h3 className="card-title text-lg mb-4">Tingkat Kepatuhan</h3>
                      <div className="h-64">
                        {/* <Doughnut
                          data={getComplianceData()}
                          options={doughnutOptions}
                        /> */}
                        <ComplianceCard rawData={complianceRaw} />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="card bg-white border-gray-100 border w-full">
                  <div className="card-body">
                    <h3 className="card-title text-lg mb-4">
                      <SlGraph size={18} />
                      Tren Mingguan
                    </h3>
                    <div className="h-64 lg:h-92 w-full">
                      <TimeSeriesCard rawData={todayPerWeek.data ? todayPerWeek.data : timeSeriesRaw} filterType={filterType} type={"week"} maxRotation chartType="Bar" />
                      {/* <Bar data={getWeeklyTrendData()} options={chartOptions} /> */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "deteksi" && (
              // <div className="card bg-white border-gray-100 border">
              //   <div className="card-body">
              //     <h3 className="card-title text-lg mb-4">Hasil Deteksi Terbaru</h3>
              //     <div className="overflow-x-auto">
              //       <table className="table table-md table-zebra w-full">
              //         <thead>
              //           <tr>
              //             <th className="text-center">Waktu</th>
              //             <th className="text-center">Jenis Deteksi</th>
              //             <th className="text-center">Confidence</th>
              //             <th className="text-center">Helm</th>
              //             <th className="text-center">Rompi</th>
              //             <th className="text-center">Sepatu</th>
              //             <th className="text-center">Status</th>
              //           </tr>
              //         </thead>
              //         <tbody>
              //           {getDetectionResults().map((result) => (
              //             <tr key={result.id} className="text-sm">
              //               <td className="text-center">{result.timestamp}</td>
              //               <td className="text-center">
              //                 <span
              //                   className={`badge text-xs ${result.type === "Pelanggaran APD"
              //                     ? "badge-error"
              //                     : "badge-success"
              //                     }`}
              //                 >
              //                   {result.type}
              //                 </span>
              //               </td>
              //               <td className="text-center">{result.confidence}</td>
              //               <td className="text-center">
              //                 <div
              //                   className={`w-4 h-4 rounded-full mx-auto ${result.helmet ? "bg-green-500" : "bg-red-500"
              //                     }`}
              //                 ></div>
              //               </td>
              //               <td className="text-center">
              //                 <div
              //                   className={`w-4 h-4 rounded-full mx-auto ${result.vest ? "bg-green-500" : "bg-red-500"
              //                     }`}
              //                 ></div>
              //               </td>
              //               <td className="text-center">
              //                 <div
              //                   className={`w-4 h-4 rounded-full mx-auto ${result.boots ? "bg-green-500" : "bg-red-500"
              //                     }`}
              //                 ></div>
              //               </td>
              //               <td className="text-center">
              //                 <div className="flex justify-center items-center">
              //                   <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              //                   <span className="text-green-600 text-xs">
              //                     Recorded
              //                   </span>
              //                 </div>
              //               </td>
              //             </tr>
              //           ))}
              //         </tbody>
              //       </table>
              //     </div>
              //   </div>
              // </div>
              <CRecapComponent dataApd={dataApd} pagination={pagination} page={page} setPage={setPage} lastRecord={lastRecord} todayPerHour={todayPerHour} setActiveTabCCTV={setActiveTabCCTV} activeTabCCTV={activeTabCCTV} />
            )}

            {activeTab === "camera" && (
              <div className="card bg-white border-gray-100 border min-h-96">
                {camDetail.rtsp_url ? (
                  camDetail.rtsp_url.includes("rtsp") ? (
                    streamKeys[camDetail.id] ? (
                      <UniversalCameraPreview
                        url={`http://localhost:3001/hls/${streamKeys[camDetail.id]}/index.m3u8`}
                        customcss="min-h-[500px] w-full object-cover"
                        cameraId={camDetail.id}
                      />
                    ) : (
                      <div className="w-full min-h-[500px] bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">Loading stream...</span>
                      </div>
                    )
                  ) : (
                    <UniversalCameraPreview
                      url={camDetail.rtsp_url}
                      customcss="min-h-[500px] w-full object-cover"
                      cameraId={camDetail.id}
                    />
                  )
                ) : (
                  // <BiVideoRecording size={48} className="text-gray-400" />
                  <div className="card-body text-center py-16">
                    <BiVideoRecording
                      size={64}
                      className="mx-auto text-gray-400 mb-4"
                    />

                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Kamera
                    </h3>
                    <p className="text-gray-500">
                      Kamera bermasalah atau tidak ada silahkan menunggu
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPerKamera;
