// components/CameraFormModal.jsx
import React from 'react';
import { FaSave, FaTimes } from "react-icons/fa";

const CameraFormModal = ({ 
  isOpen, 
  isEdit, 
  formData, 
  setFormData, 
  onSave, 
  onClose, 
  submitting 
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.link) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }
    onSave();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {isEdit ? 'Edit Kamera' : 'Tambah Kamera Baru'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Nama Kamera *</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Camera Simpang A"
                required
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Lokasi *</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Contoh: Bandung Timur"
                required
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Link Stream *</span>
              </label>
              <input
                type="url"
                className="input input-bordered w-full"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="http://example.com/stream"
                required
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Status *</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-action">
            <button 
              type="button"
              className="btn btn-sm btn-ghost" 
              onClick={onClose}
              disabled={submitting}
            >
              <FaTimes size={16} />
              Batal
            </button>
            <button 
              type="submit"
              className="btn btn-sm text-white bg-green-600" 
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FaSave size={16} />
              )}
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CameraFormModal;