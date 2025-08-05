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
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('today');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('analytics');

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

  const timeSeriesData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      label: 'Deteksi Pelanggaran',
      data: [5, 8, 15, 22, 18, 12],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4
    }]
  };

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

  // Mock CCTV recordings data
  const cctvRecordings = [
    { id: 1, camera: 'Kamera 1', timestamp: '2024-08-04 14:30:00', type: 'Pelanggaran APD', location: 'Area Produksi A' },
    { id: 2, camera: 'Kamera 3', timestamp: '2024-08-04 14:15:00', type: 'Normal', location: 'Area Produksi B' },
    { id: 3, camera: 'Kamera 2', timestamp: '2024-08-04 14:00:00', type: 'Pelanggaran APD', location: 'Gudang' },
    { id: 4, camera: 'Kamera 4', timestamp: '2024-08-04 13:45:00', type: 'Normal', location: 'Kantor' },
  ];

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
                  <Doughnut data={complianceData} options={doughnutOptions} />
                </div>
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="card bg-white border-gray-100 border lg:col-span-2 xl:col-span-1">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4"><SlGraph size={18} /> Tren Waktu</h3>
                <div className="h-64">
                  <Line data={timeSeriesData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="lg:col-span-2 xl:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat bg-white border-gray-100 border rounded-lg">
                  <div className="stat-figure text-[#abc62b]">
                    <SiSpeedtest size={32} />
                  </div>
                  <div className="stat-title">Total Deteksi</div>
                  <div className="stat-value text-[#abc62b]">117</div>
                  <div className="stat-desc">↗︎ 12% dari kemarin</div>
                </div>

                <div className="stat bg-white border-gray-100 border rounded-lg">
                  <div className="stat-figure text-[#FCB700]">
                    <FaCheck size={32} />
                  </div>
                  <div className="stat-title">Kepatuhan APD</div>
                  <div className="stat-value text-[#FCB700]">75%</div>
                  <div className="stat-desc">↗︎ 5% dari kemarin</div>
                </div>

                <div className="stat bg-white border-gray-100 border rounded-lg">
                  <div className="stat-figure text-[#ed1b2f]">
                    <IoWarningOutline size={32} />
                  </div>
                  <div className="stat-title">Pelanggaran</div>
                  <div className="stat-value text-[#ed1b2f]">29</div>
                  <div className="stat-desc">↘︎ 2% dari kemarin</div>
                </div>

                <div className="stat bg-white border-gray-100 border rounded-lg">
                  <div className="stat-figure text-[#006db7]">
                    <BiVideoRecording size={32} />
                  </div>
                  <div className="stat-title">Kamera Aktif</div>
                  <div className="stat-value text-[#006db7]">5/5</div>
                  <div className="stat-desc">Semua online</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cctv' && (
          <div className="card bg-white border-gray-100 border">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">📹 Rekap CCTV yang Diaktifkan</h3>

              <div className="overflow-x-auto">
                <table className="table table-md table-zebra w-full">
                  <thead>
                    <tr>
                      <th className='text-center'>Kamera</th>
                      <th className='text-center'>Waktu</th>
                      <th className='text-center'>Jenis Deteksi</th>
                      <th className='text-center'>Lokasi</th>
                      <th className='text-center'>Status</th>
                      <th className='text-center'>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cctvRecordings.map((record) => (
                      <tr key={record.id} className='text-sm'>
                        <td className='text-center place-items-center'>
                          <div className="flex items-center space-x-3">
                            <div className="avatar placeholder">
                              <BiVideoRecording size={18} />
                            </div>
                            <div>
                              <div className="font-semibold">{record.camera}</div>
                            </div>
                          </div>
                        </td>
                        <td className='text-center'>
                          <span className="text-sm">{record.timestamp}</span>
                        </td>
                        <td className='text-center'>
                          <span className={`badge text-xs ${record.type === 'Pelanggaran APD' ? 'badge-error' : 'badge-success'}`}>
                            {record.type}
                          </span>
                        </td>
                        <td className='text-center'>
                          {record.location}</td>
                        <td className='text-center'>
                          <div className="flex justify-center items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-600">Online</span>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div className="flex justify-center space-x-2">
                            <button className="btn btn-ghost btn-sm">Lihat</button>
                            <button className="btn btn-ghost btn-sm">Simpan</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Menampilkan 4 dari 24 rekaman
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
      </div>
      <MapComponent/>
    </div>
  );
};

export default DashboardSummary;