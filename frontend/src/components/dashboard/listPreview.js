"use client"
import { useCameraAPD } from '@/hooks/useCameraAPD';
import React, { useEffect, useState } from 'react';
import UniversalCameraPreview from "@/components/manager/universalCheck"
import { motion } from "framer-motion";
const ListPreview = () => {
  const { dataCamAPD, fetchCamAPD } = useCameraAPD();

  useEffect(() => {
    fetchCamAPD();
  }, []);

  const locations = dataCamAPD.map((cam) => ({
    id: cam.id,
    name: cam.name || `Camera ${cam.id}`,
    position: [parseFloat(cam.lat), parseFloat(cam.long)],
    description: cam.description || "Camera location",
    rtsp_url: cam.rtsp_url,
  }));
  return <div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {locations.map((location, index) => (
        location.rtsp_url.includes("rtsp") && (
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
                url={location?.rtsp_url.includes("rtsp") ? `http://localhost:3001/hls/Channel${location.id}/index.m3u8` : location?.rtsp_url}
                customcss={"w-full h-full object-cover"}
                cameraId={location?.id}
              />
            </div>
            <div className="absolute top-0 right-0 z-10 p-2">
              <h4 className="font-semibold text-[9px] bg-black/90 p-1 rounded-sm text-white truncate">{`http://localhost:3001/api/stream/Channel${location.id}`}</h4>
            </div>
          </motion.div>
        )
      ))}
    </div>
  </div>
};

export default ListPreview;