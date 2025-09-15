// components/CameraCard.jsx
import React from 'react';
import { FaTrash } from "react-icons/fa";
import { MdLocationOn, MdLink } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { BiVideoRecording } from "react-icons/bi";
import { HiMiniPencil } from "react-icons/hi2";
import CameraPreview from "@/components/manager/cameraPreview";

const CameraCard = ({
  camera,
  onEdit,
  onDelete,
  onShowMetadata
}) => {
  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kamera ini?')) {
      onDelete(camera.id);
    }
  };

  return (
    <div className="card bg-white border-gray-100 border hover:shadow-lg transition-all">
      <div className="card-body">
        {/* Status Indicator */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="card-title text-lg">{camera.name}</h3>
          <div className={`badge ${camera.status === 'active' ? 'badge-success' : 'badge-error'}`}>
            {camera.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>

        {/* Camera Preview Placeholder */}
        <div className="bg-gray-100 rounded-lg mb-4 aspect-video flex items-center justify-center overflow-hidden">
          {camera.link ? (
            <CameraPreview url={camera.link} cameraId={1}/>
          ) : (
            <BiVideoRecording size={48} className="text-gray-400" />
          )}
        </div>

        {/* Camera Info */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <MdLocationOn size={16} />
            <span>{camera.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdLink size={16} />
            <span className="truncate font-mono text-xs">{camera.link}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions justify-end">
          <div className="btn-group">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onShowMetadata(camera)}
              title="Lihat Metadata"
            >
              <IoEye size={16} />
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onEdit(camera)}
              title="Edit Kamera"
            >
              <HiMiniPencil size={16} />
            </button>
            <button
              className="btn btn-sm btn-ghost text-red-600"
              onClick={handleDelete}
              title="Hapus Kamera"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCard;