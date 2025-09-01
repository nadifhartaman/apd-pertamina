// components/CameraPreview.jsx
"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const CameraPreview = ({ url, customcss }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!url || !videoRef.current) return;

    // HLS (.m3u8)
    if (url.endsWith(".m3u8") || url.includes("playlist.m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        return () => hls.destroy();
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = url; // Safari
      }
    } 
    
    // TS langsung (kadang bisa langsung via <video>)
    else if (url.endsWith(".ts")) {
      videoRef.current.src = url;
    } 
    
    // WebSocket (misalnya ws:// / wss://) → fallback pakai MJPEG
    else if (url.startsWith("ws")) {
      // untuk WebRTC/WS MJPEG butuh lib tambahan, contoh minimal pakai <img>
      // bisa ganti jadi komponen khusus tergantung format stream
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      playsInline
      className={`w-full h-full rounded-lg bg-black ${customcss || ""}`}
    />
  );
};

export default CameraPreview;
