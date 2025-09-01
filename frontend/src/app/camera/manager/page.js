"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FaVideo, FaPlus, FaTrash, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";
import { MdVideoSettings, MdLocationOn, MdDescription, MdLink } from "react-icons/md";
import { IoInformationCircle, IoWarningOutline, IoEye } from "react-icons/io5";
import { BiVideoRecording, BiSearchAlt } from "react-icons/bi";
import CameraPreview from "@/components/dialog/cameraPreview";
import { HiMiniPencil } from "react-icons/hi2";
import { cameras } from '@/lib/apiService';
import { toast } from 'react-toastify';

const CCTVManager = () => {
  const [dataCameras, setDataCameras] = useState([
    // {
    //   id: 'camera1',
    //   name: 'Kamera 1',
    //   location: 'Area Produksi A',
    //   channel: 'Channel 1',
    //   description: 'Monitoring area produksi utama',
    //   status: 'online',
    //   link: 'rtsp_url://192.168.1.101:554/stream1',
    //   resolution: '1920x1080',
    //   fps: 30
    // },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIdCam, setSelectedIdCam] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    lat: '',
    long: '',
    channel: '',
    description: '',
    rtsp_url: '',
    resolution: '1920x1080',
    fps: 30,
    status: 'online'
  });

  const maxCameras = 4;

  // Filter dataCameras based on search and status
  const filteredCameras = dataCameras.filter(camera => {
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
      lat: '',
      long: '',
      channel: '',
      description: '',
      rtsp_url: '',
      resolution: '1920x1080',
      fps: 30,
      status: 'online'
    });
  };

  const deleteDataCamera = async (id) => {
    await toast.promise(
      cameras.deleteById(id, formData),
      {
        pending: "Menghapus kamera...",
        success: "Kamera berhasil dihapus",
        error: "Gagal menghapus kamera"
      },
      {
        position: "top-right"
      }
    )
      .then((response) => {
        console.log("Camera data:", response.data);
        getDataCameras();
      })
      .catch((error) => {
        console.error("Error fetching camera data:", error);
      });
  }

  const createDataCamera = async (id = 0) => {
    // satukan lat & long ke dalam location
    const payload = {
      ...formData,
      location: `${formData.lat},${formData.long}`, // gabung lat long
    };

    if (id === 0) {
      await toast.promise(
        cameras.createData(payload),
        {
          pending: "Menyimpan kamera...",
          success: "Kamera berhasil ditambahkan",
          error: "Gagal menambahkan kamera",
        },
        { position: "top-right" }
      )
        .then((response) => {
          console.log("Camera data:", response.data);
          getDataCameras();
        })
        .catch((error) => {
          console.error("Error fetching camera data:", error);
        });
    } else {
      await toast.promise(
        cameras.updateById(id, payload),
        {
          pending: "Merubah data kamera...",
          success: "Kamera berhasil dirubah",
          error: "Gagal merubah data kamera",
        },
        { position: "top-right" }
      )
        .then((response) => {
          console.log("Camera data:", response.data);
          getDataCameras();
        })
        .catch((error) => {
          console.error("Error fetching camera data:", error);
        });
    }
    setSelectedIdCam(0);
  };



  const handleAddCamera = () => {
    if (dataCameras.length >= maxCameras) {
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
      lat: camera.lat,
      long: camera.long,
      channel: camera.channel,
      description: camera.description,
      rtsp_url: camera.rtsp_url,
      resolution: camera.resolution,
      fps: camera.fps,
      status: camera.status
    });
    console.log(camera.id)
    setSelectedIdCam(camera.id)
    setShowEditModal(true);
  };

  const handleShowMetadata = (camera) => {
    setSelectedCamera(camera);
    setShowMetadataModal(true);
  };

  const handleSaveCamera = () => {
    if (!formData.name || !formData.location || !formData.channel || !formData.rtsp_url) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (showAddModal) {
      createDataCamera();
      setShowAddModal(false);
    } else if (showEditModal) {
      createDataCamera(selectedIdCam);
      setShowEditModal(false);
    }
    resetForm();
    setSelectedCamera(null);
  };

  const handleDeleteCamera = (cameraId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kamera ini?')) {
      deleteDataCamera(cameraId)
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowMetadataModal(false);
    setSelectedCamera(null);
    resetForm();
  };

  const getDataCameras = async () => {
    try {
      const response = await cameras.getAll();
      console.log("Camera data:", response.data);

      const formatted = response.data.map((cam) => {
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

      setDataCameras(formatted);
      console.log("Formatted camera locations:", formatted);
    } catch (error) {
      console.error("Error fetching camera data:", error);
    }
  };


  useEffect(() => {
    getDataCameras();
  }, []);

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
                  disabled={dataCameras.length >= maxCameras}
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
                      <div className="stat-value text-lg">{dataCameras.length}/{maxCameras}</div>
                    </div>
                    <div className="stat py-2 px-4">
                      <div className="stat-title text-xs">Online</div>
                      <div className="stat-value text-lg text-green-600">
                        {dataCameras.filter(c => c.status === 'online').length}
                      </div>
                    </div>
                    <div className="stat py-2 px-4">
                      <div className="stat-title text-xs">Offline</div>
                      <div className="stat-value text-lg text-red-600">
                        {dataCameras.filter(c => c.status === 'offline').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {dataCameras.length >= maxCameras && (
              <div className="alert alert-warning mt-4">
                <IoWarningOutline size={20} />
                <span>Maksimal 4 kamera telah tercapai. Hapus kamera yang tidak digunakan untuk menambah yang baru.</span>
              </div>
            )}
          </div>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5">
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
                <div className="bg-gray-100 rounded-lg mb-4 aspect-video flex items-center justify-center overflow-hidden">
                  {camera.rtsp_url ? (
                    <CameraPreview url={camera.rtsp_url} />
                  ) : (
                    <BiVideoRecording size={48} className="text-gray-400" />
                  )}
                </div>

                {/* Camera Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MdLocationOn size={16} />
                    <span className='overflow-hidden text-ellipsis'>{camera.location}</span>
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
                      onClick={() => { handleEditCamera(camera), setSelectedIdCam(camera.id) }}
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
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-lg mb-4">
                {showAddModal ? 'Tambah Kamera Baru' : 'Edit Kamera'}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Nama Kamera *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
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
                    className="input input-bordered w-full"
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    placeholder="Contoh: Channel 1"
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Lat *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    placeholder="Contoh: Area Produksi A"
                  />
                </div>
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Long *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.long}
                    onChange={(e) => setFormData({ ...formData, long: e.target.value })}
                    placeholder="Contoh: Area Produksi A"
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Link Stream *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.rtsp_url}
                    onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
                    placeholder="rtsp://192.168.1.100:554/stream1"
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text">Resolusi</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
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
                    className="input input-bordered w-full"
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
                    className="select select-bordered w-full"
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
                    className="textarea textarea-bordered w-full"
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
                  <div className="input input-bordered bg-gray-50 font-mono text-sm overflow-x-auto">{selectedCamera.rtsp_url}</div>
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