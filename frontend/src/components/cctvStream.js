"use client";

import { useState, useEffect } from "react";

export default function CCTVStream ({ data, title, customLarge, large = false, onClick, heightCamera }) {
  const [imageError, setImageError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Get message data with fallback
  const { message } = data || {};
  // Extract values with fallbacks
  const {
    image_url,
    timestamp = "",
    fps = 0,
    id_simpang = "",
    count = 0,
  } = message || {};

  // Reset error state when image URL changes
  useEffect(() => {
    if (image_url) {
      setImageError(false);
    }
  }, [image_url]);

  useEffect(() => {
    if (data?.message?.detections?.length > 0) {
      // console.log(data);
      // const filtered = data.filter(item => item.detections?.length > 0);
      // console.log('Data with detections:', filtered);
    }
  }, [data])

  // Check if image_url is empty or undefined
  const isValidImageUrl = image_url && image_url !== "";

  // Show waiting screen if no data, error with image, or invalid image URL
  const showWaitingScreen = !data || imageError || !isValidImageUrl;

  return (
    <>
      <div
        className={`flex flex-col w-full ${customLarge ?? ""} ${large ? "h-fit" : "h-fit"}`}
        onClick={onClick}
      >
        <div className="bg-black text-white p-3 flex justify-between items-center">
          <h3 className="font-normal text-xs text-nowrap truncate">{title || "CCTV Stream"}</h3>
          {!showWaitingScreen && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-500 px-2 py-1 rounded-full truncate text-nowrap">
                {(typeof fps === 'number' ? fps.toFixed(1) : '0.0')} FPS
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullScreen(true);
                }}
                title="View Fullscreen"
                className="text-xs bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
              >
                Fullscreen
              </button>
            </div>
          )}
        </div>

        <div className={`flex-grow bg-black relative overflow-hidden max-h-[420px] flex items-center justify-center ${heightCamera ? "h-full" : " min-h-[420px]"} `}>
          {showWaitingScreen ? (
            <div className="flex items-center justify-center text-white text-sm w-full text-center min-w-52 min-h-52 h-full flex-col relative">
              {/* <img
                src={"/image/no-camera.jpg"}
                alt={`CCTV Stream ${id_simpang || title}`}
                className={`w-full h-full object-contain`}
                onError={() => setImageError(true)}
              >
              </img> */}
              <div className="absolute top-[40%] w-full text-center text-sm ">
                Waiting for connection...
              </div>
              <div className="h-15 bg-black">
              </div>
            </div>
          ) : (
            <img
              src={isValidImageUrl ? image_url : null}
              alt={`CCTV Stream ${id_simpang || title}`}
              className={`w-full h-full object-contain`}
              onError={() => setImageError(true)}
            />
          )}

          {!showWaitingScreen && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-xs">
              <div className="flex justify-between">
                <span>ID: {id_simpang || "N/A"}</span>
                <span>Frame: {count || 0}</span>
              </div>
              <div className="mt-1">
                {timestamp ? new Date(timestamp).toLocaleString() : "Timestamp not available"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen && !showWaitingScreen && isValidImageUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={image_url}
              alt="Fullscreen CCTV"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}