"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { BiVideoRecording, BiCurrentLocation, BiTime } from "react-icons/bi";
import { SlGraph } from "react-icons/sl";
import { SiSpeedtest } from "react-icons/si";
import { FaCheck, FaVideo, FaMapMarkerAlt } from "react-icons/fa";
import { IoWarningOutline, IoDocumentTextOutline, IoInformationCircle } from "react-icons/io5";
import { MdVideoSettings, MdLocationOn } from "react-icons/md";

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

const DashboardPerKamera = () => {
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('today');
  const [activeTab, setActiveTab] = useState('analytics');

  // Mock camera data
  const cameras = [
    { id: 'camera1', name: 'Kamera 1', location: 'Area Produksi A', channel: 'Channel 1', description: 'Monitoring area produksi utama', status: 'online' },
    { id: 'camera2', name: 'Kamera 2', location: 'Gudang', channel: 'Channel 2', description: 'Monitoring area gudang penyimpanan', status: 'online' },
    { id: 'camera3', name: 'Kamera 3', location: 'Area Produksi B', channel: 'Channel 3', description: 'Monitoring area produksi sekunder', status: 'online' },
    { id: 'camera4', name: 'Kamera 4', location: 'Kantor', channel: 'Channel 4', description: 'Monitoring area kantor', status: 'offline' },
    { id: 'camera5', name: 'Kamera 5', location: 'Pintu Masuk', channel: 'Channel 5', description: 'Monitoring pintu masuk utama', status: 'online' },
  ];

  // Get selected camera data
  const selectedCameraData = cameras.find(cam => cam.id === selectedCamera);

  // Sample data for selected camera charts
  const getHourlyDetectionData = () => ({
    labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [{
      label: 'Deteksi APD',
      data: selectedCamera ? [3, 7, 12, 15, 18, 14, 8, 5] : [],
      borderColor: '#006db7',
      backgroundColor: 'rgba(0, 109, 183, 0.1)',
      tension: 0.4
    }]
  });

  const getComplianceData = () => ({
    labels: ['Sesuai APD', 'Tidak Sesuai APD'],
    datasets: [{
      data: selectedCamera ? [82, 18] : [0, 0],
      backgroundColor: [
        '#abc62b',
        '#ed1b2f'
      ],
      borderWidth: 2
    }]
  });

  const getWeeklyTrendData = () => ({
    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    datasets: [{
      label: 'Total Deteksi',
      data: selectedCamera ? [45, 52, 38, 61, 48, 33, 28] : [],
      backgroundColor: '#FCB700',
    }]
  });

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

  // Mock detection results for selected camera
  const getDetectionResults = () => {
    if (!selectedCamera) return [];

    return [
      { id: 1, timestamp: '2024-08-04 15:30:00', type: 'Pelanggaran APD', confidence: '95%', helmet: false, vest: true, boots: true },
      { id: 2, timestamp: '2024-08-04 15:15:00', type: 'Normal', confidence: '87%', helmet: true, vest: true, boots: true },
      { id: 3, timestamp: '2024-08-04 15:00:00', type: 'Pelanggaran APD', confidence: '92%', helmet: true, vest: false, boots: true },
      { id: 4, timestamp: '2024-08-04 14:45:00', type: 'Normal', confidence: '89%', helmet: true, vest: true, boots: true },
      { id: 5, timestamp: '2024-08-04 14:30:00', type: 'Pelanggaran APD', confidence: '91%', helmet: false, vest: false, boots: true },
    ];
  };

  const downloadPDF = () => {
    if (!selectedCamera) {
      alert('Pilih kamera terlebih dahulu');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([`Laporan ${selectedCameraData?.name} - ${new Date().toISOString()}`], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = `laporan-${selectedCamera}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-fit w-full p-6">
      <div className="w-full h-fit overflow-y-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Per Kamera</h1>
          <p className="text-gray-600">Monitoring detail sistem kepatuhan APD per kamera</p>
        </div>

        {/* Camera Selection */}
        <div className="card bg-white border-gray-100 border mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4 flex items-center gap-2">
              <FaVideo className="text-blue-600" />
              Pilih Kamera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cameras.map((camera) => (
                <div
                  key={camera.id}
                  className={`card border cursor-pointer transition-all hover:shadow-md ${selectedCamera === camera.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedCamera(camera.id)}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{camera.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MdLocationOn size={14} />
                        <span>{camera.location}</span>
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
          <div className="card bg-white border-gray-100 border mb-6">
            <div className="card-body">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="text-[#006db7]">
                      <BiVideoRecording size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{selectedCameraData?.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt size={12} />
                        {selectedCameraData?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdVideoSettings size={12} />
                        {selectedCameraData?.channel}
                      </span>
                      <span className={`flex items-center gap-1 ${selectedCameraData?.status === 'online' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${selectedCameraData?.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                        {selectedCameraData?.status === 'online' ? 'Online' : 'Offline'}
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
                      className="select select-sm select-bordered"
                      value={selectedTimeFilter}
                      onChange={(e) => setSelectedTimeFilter(e.target.value)}
                    >
                      <option value="today">Hari Ini</option>
                      <option value="week">Minggu Ini</option>
                      <option value="month">Bulan Ini</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  <div className="form-control flex items-end">
                    <button className="btn btn-sm" onClick={downloadPDF}>
                      <IoDocumentTextOutline size={16} />
                      Unduh PDF
                    </button>
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
              className={`tab items-center flex gap-1 tab-lg ${activeTab === 'analytics' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <SlGraph size={18} /> Grafik Analitik
            </button>
            <button
              className={`tab items-center flex gap-1 tab-lg ${activeTab === 'deteksi' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('deteksi')}
            >
              <IoInformationCircle size={18} /> Hasil Deteksi
            </button>
            <button
              className={`tab items-center flex gap-1 tab-lg ${activeTab === 'camera' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('camera')}
            >
              <FaVideo size={18} /> Video Camera
            </button>
          </div>
        )}

        {/* Content */}
        {!selectedCamera ? (
          <div className="card bg-white border-gray-100 border">
            <div className="card-body text-center py-16">
              <BiVideoRecording size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Pilih Kamera</h3>
              <p className="text-gray-500">Silakan pilih kamera dari daftar di atas untuk melihat dashboard analitik</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="stat bg-white border-gray-100 border rounded-lg">
                    <div className="stat-figure text-[#006db7]">
                      <SiSpeedtest size={32} />
                    </div>
                    <div className="stat-title">Total Deteksi Hari Ini</div>
                    <div className="stat-value text-[#006db7]">82</div>
                    <div className="stat-desc">↗︎ 15% dari kemarin</div>
                  </div>

                  <div className="stat bg-white border-gray-100 border rounded-lg">
                    <div className="stat-figure text-[#abc62b]">
                      <FaCheck size={32} />
                    </div>
                    <div className="stat-title">Tingkat Kepatuhan</div>
                    <div className="stat-value text-[#abc62b]">82%</div>
                    <div className="stat-desc">↗︎ 8% dari kemarin</div>
                  </div>

                  <div className="stat bg-white border-gray-100 border rounded-lg">
                    <div className="stat-figure text-[#ed1b2f]">
                      <IoWarningOutline size={32} />
                    </div>
                    <div className="stat-title">Pelanggaran</div>
                    <div className="stat-value text-[#ed1b2f]">15</div>
                    <div className="stat-desc">↘︎ 3% dari kemarin</div>
                  </div>

                  <div className="stat bg-white border-gray-100 border rounded-lg">
                    <div className="stat-figure text-[#FCB700]">
                      <BiTime size={32} />
                    </div>
                    <div className="stat-title">Rata-rata per Jam</div>
                    <div className="stat-value text-[#FCB700]">10.2</div>
                    <div className="stat-desc">Deteksi per jam</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Hourly Detection Chart */}
                  <div className="card bg-white border-gray-100 border xl:col-span-2">
                    <div className="card-body">
                      <h3 className="card-title text-lg mb-4">
                        <SlGraph size={18} />
                        Deteksi per Jam
                      </h3>
                      <div className="h-64">
                        <Line data={getHourlyDetectionData()} options={chartOptions} />
                      </div>
                    </div>
                  </div>

                  {/* Compliance Chart */}
                  <div className="card bg-white border-gray-100 border">
                    <div className="card-body">
                      <h3 className="card-title text-lg mb-4">Tingkat Kepatuhan</h3>
                      <div className="h-64">
                        <Doughnut data={getComplianceData()} options={doughnutOptions} />
                      </div>
                    </div>
                  </div>

                  {/* Weekly Trend Chart */}
                  <div className="card bg-white border-gray-100 border xl:col-span-3">
                    <div className="card-body">
                      <h3 className="card-title text-lg mb-4">
                        <SlGraph size={18} />
                        Tren Mingguan
                      </h3>
                      <div className="h-64">
                        <Bar data={getWeeklyTrendData()} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deteksi' && (
              <div className="card bg-white border-gray-100 border">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">Hasil Deteksi Terbaru</h3>

                  <div className="overflow-x-auto">
                    <table className="table table-md table-zebra w-full">
                      <thead>
                        <tr>
                          <th className="text-center">Waktu</th>
                          <th className="text-center">Jenis Deteksi</th>
                          <th className="text-center">Confidence</th>
                          <th className="text-center">Helm</th>
                          <th className="text-center">Rompi</th>
                          <th className="text-center">Sepatu</th>
                          <th className="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getDetectionResults().map((result) => (
                          <tr key={result.id} className="text-sm">
                            <td className="text-center">
                              <span className="text-sm">{result.timestamp}</span>
                            </td>
                            <td className="text-center">
                              <span className={`badge text-xs ${result.type === 'Pelanggaran APD' ? 'badge-error' : 'badge-success'
                                }`}>
                                {result.type}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="font-mono text-xs">{result.confidence}</span>
                            </td>
                            <td className="text-center">
                              <div className={`w-4 h-4 rounded-full mx-auto ${result.helmet ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                            </td>
                            <td className="text-center">
                              <div className={`w-4 h-4 rounded-full mx-auto ${result.vest ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                            </td>
                            <td className="text-center">
                              <div className={`w-4 h-4 rounded-full mx-auto ${result.boots ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                            </td>
                            <td className="text-center">
                              <div className="flex justify-center items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-green-600 text-xs">Recorded</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      Menampilkan 5 dari 24 hasil deteksi
                    </div>
                    <div className="btn-group">
                      <button className="btn btn-sm">«</button>
                      <button className="btn btn-sm btn-active">1</button>
                      <button className="btn btn-sm">2</button>
                      <button className="btn btn-sm">3</button>
                      <button className="btn btn-sm">»</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "camera" && (
              <div className="card bg-white border-gray-100 border">
                <div className="card-body text-center py-16">
                  <BiVideoRecording size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Kamera</h3>
                  <p className="text-gray-500">Kamera bermasalah atau tidak ada silahkan menunggu</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPerKamera;