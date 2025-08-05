"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FaVideo, FaPlus, FaTrash, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";
import { MdVideoSettings, MdLocationOn, MdDescription, MdLink } from "react-icons/md";
import { IoInformationCircle, IoWarningOutline, IoEye } from "react-icons/io5";
import { BiVideoRecording, BiSearchAlt } from "react-icons/bi";
import { HiMiniPencil } from "react-icons/hi2";

const CCTVManager = () => {
  const [cameras, setCameras] = useState([
    {
      id: 'camera1',
      name: 'Kamera 1',
      location: 'Area Produksi A',
      channel: 'Channel 1',
      description: 'Monitoring area produksi utama',
      status: 'online',
      link: 'rtsp://192.168.1.101:554/stream1',
      resolution: '1920x1080',
      fps: 30
    },
    {
      id: 'camera2',
      name: 'Kamera 2',
      location: 'Gudang',
      channel: 'Channel 2',
      description: 'Monitoring area gudang penyimpanan',
      status: 'online',
      link: 'rtsp://192.168.1.102:554/stream1',
      resolution: '1920x1080',
      fps: 25
    },
    {
      id: 'camera3',
      name: 'Kamera 3',
      location: 'Area Produksi B',
      channel: 'Channel 3',
      description: 'Monitoring area produksi sekunder',
      status: 'online',
      link: 'rtsp://192.168.1.103:554/stream1',
      resolution: '1280x720',
      fps: 30
    },
    {
      id: 'camera4',
      name: 'Kamera 4',
      location: 'Kantor',
      channel: 'Channel 4',
      description: 'Monitoring area kantor',
      status: 'offline',
      link: 'rtsp://192.168.1.104:554/stream1',
      resolution: '1920x1080',
      fps: 30
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    channel: '',
    description: '',
    link: '',
    resolution: '1920x1080',
    fps: 30,
    status: 'online'
  });

  const maxCameras = 4;

  // Filter cameras based on search and status
  const filteredCameras = cameras.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      channel: '',
      description: '',
      link: '',
      resolution: '1920x1080',
      fps: 30,
      status: 'online'
    });
  };

  const handleAddCamera = () => {
    if (cameras.length >= maxCameras) {
      alert('Maksimal 4 kamera yang dapat ditambahkan');
      return;
    }
    setShowAddModal(true);
    resetForm();
  };

  const handleEditCamera = (camera) => {
    setSelectedCamera(camera);
    setFormData({
      name: camera.name,
      location: camera.location,
      channel: camera.channel,
      description: camera.description,
      link: camera.link,
      resolution: camera.resolution,
      fps: camera.fps,
      status: camera.status
    });
    setShowEditModal(true);
  };

  const handleShowMetadata = (camera) => {
    setSelectedCamera(camera);
    setShowMetadataModal(true);
  };

  const handleSaveCamera = () => {
    if (!formData.name || !formData.location || !formData.channel || !formData.link) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (showAddModal) {
      const newCamera = {
        id: `camera${Date.now()}`,
        ...formData
      };
      setCameras([...cameras, newCamera]);
      setShowAddModal(false);
    } else if (showEditModal) {
      setCameras(cameras.map(cam =>
        cam.id === selectedCamera.id ? { ...selectedCamera, ...formData } : cam
      ));
      setShowEditModal(false);
    }
    resetForm();
    setSelectedCamera(null);
  };

  const handleDeleteCamera = (cameraId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kamera ini?')) {
      setCameras(cameras.filter(cam => cam.id !== cameraId));
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowMetadataModal(false);
    setSelectedCamera(null);
    resetForm();
  };

  return (
    <div className="min-h-fit w-full p-6">
      <div className="w-full h-fit overflow-y-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CCTV Manager</h1>
          <p className="text-gray-600">Kelola dan monitoring sistem kamera CCTV</p>
        </div>

        {/* Controls */}
        <div className="card bg-white border-gray-100 border mb-6">
          <div className="card-body">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="form-control">
                  <div className="input-group flex gap-2">
                    <input
                      type="text"
                      placeholder="Cari kamera..."
                      className="input input-bordered input-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-sm btn-square">
                      <BiSearchAlt size={16} />
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <select
                    className="select select-sm select-bordered"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Semua Status</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleAddCamera}
                  disabled={cameras.length >= maxCameras}
                >
                  <FaPlus size={16} />
                  Tambah Kamera
                </button>
              </div>

              <div>
                <div className="flex flex-col gap-2">
                  <div className="stats stats-horizontal bg-base-100 border">
                    <div className="stat py-2 px-4">
                      <div className="stat-title text-xs">Total Kamera</div>
                      <div className="stat-value text-lg">{cameras.length}/{maxCameras}</div>
                    </div>
                    <div className="stat py-2 px-4">
                      <div className="stat-title text-xs">Online</div>
                      <div className="stat-value text-lg text-green-600">
                        {cameras.filter(c => c.status === 'online').length}
                      </div>
                    </div>
                    <div className="stat py-2 px-4">
                      <div className="stat-title text-xs">Offline</div>
                      <div className="stat-value text-lg text-red-600">
                        {cameras.filter(c => c.status === 'offline').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {cameras.length >= maxCameras && (
              <div className="alert alert-warning mt-4">
                <IoWarningOutline size={20} />
                <span>Maksimal 4 kamera telah tercapai. Hapus kamera yang tidak digunakan untuk menambah yang baru.</span>
              </div>
            )}
          </div>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCameras.map((camera) => (
            <div key={camera.id} className="card bg-white border-gray-100 border hover:shadow-lg transition-all">
              <div className="card-body">
                {/* Status Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="card-title text-lg">{camera.name}</h3>
                  <div className={`badge ${camera.status === 'online' ? 'badge-success' : 'badge-error'}`}>
                    {camera.status === 'online' ? 'Online' : 'Offline'}
                  </div>
                </div>

                {/* Camera Preview Placeholder */}
                <div className="bg-gray-100 rounded-lg mb-4 aspect-video flex items-center justify-center">
                  <BiVideoRecording size={48} className="text-gray-400" />
                </div>

                {/* Camera Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MdLocationOn size={16} />
                    <span>{camera.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdVideoSettings size={16} />
                    <span>{camera.channel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdDescription size={16} />
                    <span className="truncate">{camera.description}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions justify-end">
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleShowMetadata(camera)}
                      title="Lihat Metadata"
                    >
                      <IoEye size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleEditCamera(camera)}
                      title="Edit Kamera"
                    >
                      <HiMiniPencil size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-ghost text-red-600"
                      onClick={() => handleDeleteCamera(camera.id)}
                      title="Hapus Kamera"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCameras.length === 0 && (
          <div className="card bg-white border-gray-100 border">
            <div className="card-body text-center py-16">
              <BiVideoRecording size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak Ada Kamera</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tidak ada kamera yang sesuai dengan filter yang dipilih'
                  : 'Belum ada kamera yang ditambahkan. Klik tombol "Tambah Kamera" untuk memulai.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">
                {showAddModal ? 'Tambah Kamera Baru' : 'Edit Kamera'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Nama Kamera *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Kamera 1"
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Channel *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    placeholder="Contoh: Channel 1"
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Lokasi *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Contoh: Area Produksi A"
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Link Stream *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="rtsp://192.168.1.100:554/stream1"
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Resolusi</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.resolution}
                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                  >
                    <option value="1920x1080">1920x1080 (Full HD)</option>
                    <option value="1280x720">1280x720 (HD)</option>
                    <option value="854x480">854x480 (SD)</option>
                  </select>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">FPS</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.fps}
                    onChange={(e) => setFormData({ ...formData, fps: parseInt(e.target.value) })}
                    min="15"
                    max="60"
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Deskripsi</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi kamera..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-action">
                <button className="btn btn-sm btn-ghost" onClick={closeModal}>
                  <FaTimes size={16} />
                  Batal
                </button>
                <button className="btn btn-sm text-white bg-green-600" onClick={handleSaveCamera}>
                  <FaSave size={16} />
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Modal */}
        {showMetadataModal && selectedCamera && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <IoInformationCircle size={20} />
                Metadata Kamera - {selectedCamera.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">Nama Kamera</span>
                  </label>
                  <div className="input input-bordered bg-gray-50">{selectedCamera.name}</div>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">Channel</span>
                  </label>
                  <div className="input input-bordered bg-gray-50">{selectedCamera.channel}</div>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">Lokasi</span>
                  </label>
                  <div className="input input-bordered bg-gray-50">{selectedCamera.location}</div>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">Link Stream</span>
                  </label>
                  <div className="input input-bordered bg-gray-50 font-mono text-sm">{selectedCamera.link}</div>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">Resolusi</span>
                  </label>
                  <div className="input input-bordered bg-gray-50">{selectedCamera.resolution}</div>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">FPS</span>
                  </label>
                  <div className="input input-bordered bg-gray-50">{selectedCamera.fps}</div>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">Status</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`badge ${selectedCamera.status === 'online' ? 'badge-success' : 'badge-error'}`}>
                      {selectedCamera.status === 'online' ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">Deskripsi</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered bg-gray-50"
                    value={selectedCamera.description}
                    readOnly
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-action">
                <button className="btn btn-ghost" onClick={closeModal}>
                  Tutup
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    closeModal();
                    handleEditCamera(selectedCamera);
                  }}
                >
                  <HiMiniPencil size={16} />
                  Edit Kamera
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CCTVManager;