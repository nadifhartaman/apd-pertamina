"use client"
import { useCameraAPD } from '@/hooks/useCameraAPD';
import React, { useEffect, useState } from 'react';
import UniversalCameraPreview from "@/components/manager/universalCheck"
import { motion } from "framer-motion";
const ListPreview = () => {
  const { dataCamAPD, fetchCamAPD } = useCameraAPD();
  const [streamKeys, setStreamKeys] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCamAPD();
  }, []);

  // Fetch stream keys dari backend
  useEffect(() => {
    const fetchStreamKeys = async () => {
      try {
        setLoading(true);
        const streamKeyMap = {};

        for (const cam of dataCamAPD) {
          if (cam.rtsp_url?.includes("rtsp")) {
            try {
              const response = await fetch(`http://localhost:3001/api/stream/${cam.channel || cam.id}`);
              const data = await response.json();
              streamKeyMap[cam.id] = data.streamKey;
              console.log(`✅ Stream key untuk ${cam.name}: ${data.streamKey}`);
            } catch (err) {
              console.error(`❌ Error fetching stream key for ${cam.name}:`, err);
              // Fallback ke channel name jika error
              streamKeyMap[cam.id] = cam.channel || `Channel${cam.id}`;
            }
          }
        }

        setStreamKeys(streamKeyMap);
      } catch (err) {
        console.error("Error fetching stream keys:", err);
      } finally {
        setLoading(false);
      }
    };

    if (dataCamAPD.length > 0) {
      fetchStreamKeys();
    }
  }, [dataCamAPD]);

  const locations = dataCamAPD.map((cam) => ({
    id: cam.id,
    name: cam.name || `Camera ${cam.id}`,
    channel: cam.channel,
    position: [parseFloat(cam.lat), parseFloat(cam.long)],
    description: cam.description || "Camera location",
    rtsp_url: cam.rtsp_url,
  }));

  return <div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-base-100 rounded-lg border-1 border-gray-100">
      {locations.map((location, index) => (
        location.rtsp_url.includes("rtsp") ? (
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
              {streamKeys[location.id] ? (
                <UniversalCameraPreview
                  url={`http://localhost:3001/hls/${streamKeys[location.id]}/index.m3u8`}
                  customcss={"w-full h-full object-cover"}
                  cameraId={location?.id}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">Loading stream...</span>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 z-10 p-2">
              <h4 className="font-semibold text-[9px] bg-black/90 p-1 rounded-sm text-white truncate">
                {/* {`http://localhost:3001/api/stream/${location.channel || location.id}`} */}
                {location.name}
              </h4>
            </div>
          </motion.div>
        ) : (

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
        )
      ))}
    </div>
  </div>
};

export default ListPreview;