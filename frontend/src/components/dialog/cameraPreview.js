// components/CameraPreview.jsx
"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Hls from "hls.js";

const CameraPreview = ({ url, customcss = "" }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [streamLoading, setStreamLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate unique ID dari URL untuk RTSP conversion
  const streamId = useMemo(() => {
    if (!url) return null;
    return Buffer.from(url).toString('hex').substring(0, 16);
  }, [url]);

  // Setup HLS streaming
  useEffect(() => {
    if (!url || !videoRef.current) return;

    setStreamLoading(true);
    setError(null);

    try {
      // Handle RTSP URLs - convert to HLS
      if (url.includes("rtsp")) {
        const hlsUrl = `http://localhost:3001/hls/${streamId}/index.m3u8`;
        setupHls(hlsUrl);
      }
      // Handle HLS (.m3u8)
      else if (url.endsWith(".m3u8") || url.includes("playlist.m3u8")) {
        setupHls(url);
      }
      // Handle TS directly
      else if (url.endsWith(".ts")) {
        videoRef.current.src = url;
        setStreamLoading(false);
      }
      // Handle other URL formats (MJPEG, etc)
      else {
        videoRef.current.src = url;
        setStreamLoading(false);
      }
    } catch (err) {
      console.error("❌ Error setting up stream:", err);
      setError("Failed to setup stream");
      setStreamLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, streamId]);

  const setupHls = (hlsUrl) => {
    if (!videoRef.current) return;

    // Destroy previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;

      hls.loadSource(hlsUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStreamLoading(false);
        videoRef.current?.play().catch(err => {
          console.warn("Autoplay failed:", err);
          setStreamLoading(false);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("❌ HLS Fatal Error:", data);
          setError("Stream error");
          setStreamLoading(false);
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari fallback
      videoRef.current.src = hlsUrl;
      setStreamLoading(false);
    } else {
      setError("HLS not supported");
      setStreamLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {streamLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="loading loading-spinner loading-sm text-white"></div>
            <div className="text-white text-xs">Connecting...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-red-500 text-sm text-center px-4">{error}</div>
        </div>
      )}

      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-cover bg-black ${customcss}`}
      />
    </div>
  );
};

export default CameraPreview;
