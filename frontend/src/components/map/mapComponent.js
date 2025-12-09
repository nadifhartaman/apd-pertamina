"use client";

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCameraAPD } from '@/hooks/useCameraAPD';
import { pertamina } from '@/lib/apiService'
import CameraPreview from "@/components/manager/cameraPreview";
import UniversalCameraPreview from "@/components/manager/universalCheck"

const MapComponent = () => {
  const { dataCamAPD, fetchCamAPD } = useCameraAPD();
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState(null);
  const [ReactLeaflet, setReactLeaflet] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Pagination settings
  const camerasPerPage = 6;

  useEffect(() => {
    setIsClient(true);

    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const leaflet = await import('leaflet');
        const reactLeaflet = await import('react-leaflet');

        delete leaflet.default.Icon.Default.prototype._getIconUrl;
        leaflet.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        setL(leaflet.default);
        setReactLeaflet(reactLeaflet);
      }
    };

    loadLeaflet();
    fetchCamAPD(); // ambil data kamera saat mount
  }, []);

  // Format locations dari dataCamAPD
  const locations = dataCamAPD.map((cam) => ({
    id: cam.id,
    name: cam.name || `Camera ${cam.id}`,
    position: [parseFloat(cam.lat), parseFloat(cam.long)],
    description: cam.description || "Camera location",
    rtsp_url: cam.rtsp_url,
  }));

  // Pagination
  const totalPages = Math.ceil(locations.length / camerasPerPage);
  const startIndex = currentPage * camerasPerPage;
  const endIndex = startIndex + camerasPerPage;
  const currentCameras = locations.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (!isClient || !ReactLeaflet) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = ReactLeaflet;

  return (
    <div className="w-full p-4 border border-gray-100 my-5 rounded-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-neutral-700 mb-1">Peta Lokasi Kamera</h2>
        <p className="text-neutral-600 text-sm">titik penyebaran lokasi kamera</p>
      </div>

      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-300">
        <MapContainer
          center={[-6.9175, 107.6191]} // Bandung
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <Marker key={location.id} position={location.position}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-lg text-gray-800">{location.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{location.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              delay: index * 0.1
            }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="font-semibold text-gray-800">{location.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{location.description}</p>
            <div className="text-xs text-gray-500 mt-2">
              Lat: {location.position[0]}, Lng: {location.position[1]}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Camera Grid Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Live Camera Feed</h3>
            <p className="text-sm text-gray-600">
              Halaman {currentPage + 1} dari {totalPages} • {locations.length} kamera total
            </p>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={totalPages <= 1}
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>

              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                {currentPage + 1} / {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={totalPages <= 1}
              >
                <FaChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Camera Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentCameras.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: index * 0.1
              }}
              whileHover={{ scale: 1.02 }}
              className="rounded-lg relative shadow-md border border-gray-200 overflow-hidden bg-white"
            >
              <div className="aspect-video">
                <UniversalCameraPreview
                  url={location?.rtsp_url}
                  customcss={"w-full h-full object-cover"}
                  cameraId={location?.id}
                />
              </div>
              <div className="absolute top-0 right-0 z-10 p-2">
                <h4 className="font-semibold text-[9px] bg-black/90 p-1 rounded-sm text-white truncate">{location.name}</h4>
              </div>
            </motion.div>
          ))}
        </div> */}

        {/* Empty state when no cameras */}
        {locations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Tidak ada kamera tersedia</div>
            <p className="text-gray-500 text-sm">Silakan periksa koneksi atau coba lagi nanti</p>
          </div>
        )}

        {/* Page indicator dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${i === currentPage
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default MapComponent;