"use client";

import React from "react";
import CameraPreview from "./cameraPreview"; // HLS/Direct video component
import WebSocketCameraPreview from "./wsPreview"; // WebSocket/SocketIO component

const UniversalCameraPreview = ({ 
  url, 
  cameraId, 
  customcss,
  forceType = null // 'hls', 'websocket', 'socketio', or null for auto-detect
}) => {
  // Auto-detect stream type based on URL
  const detectStreamType = (url) => {
    if (!url) return null;
    
    if (forceType) return forceType;
    
    // HLS streams
    if (url.endsWith(".m3u8") || url.includes("playlist.m3u8")) {
      return "hls";
    }
    
    // Transport Stream files
    if (url.endsWith(".ts")) {
      return "hls"; // Use HLS component for TS files too
    }
    
    // Direct video files
    if (url.match(/\.(mp4|webm|ogg|avi|mov)$/i)) {
      return "hls"; // Use HLS component for direct video
    }
    
    // WebSocket streams
    if (url.startsWith("ws://") || url.startsWith("wss://")) {
      return "websocket";
    }
    
    // Socket.IO streams (custom protocol)
    if (url.startsWith("socket://")) {
      return "socketio";
    }
    
    // RTMP/RTSP (might need special handling)
    if (url.startsWith("rtmp://") || url.startsWith("rtsp://")) {
      return "hls"; // Assume converted to HLS
    }
    
    // Default to HLS for HTTP(S) URLs
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return "hls";
    }
    
    return "unknown";
  };

  const streamType = detectStreamType(url);

  // Render error for unknown stream types
  if (streamType === "unknown" || !url) {
    return (
      <div className={`relative w-full h-full rounded-lg bg-black overflow-hidden flex items-center justify-center ${customcss || ""}`}>
        <div className="text-red-400 text-center p-4">
          <div className="text-sm font-medium mb-1">Unsupported Stream</div>
          <div className="text-xs opacity-75">
            {!url ? "No URL provided" : `Unknown stream format: ${url}`}
          </div>
        </div>
      </div>
    );
  }

  // Use appropriate component based on stream type
  if (streamType === "websocket" || streamType === "socketio") {
    return (
      <WebSocketCameraPreview
        url={url}
        cameraId={cameraId}
        customcss={customcss}
        streamType={streamType}
      />
    );
  }

  // Default to HLS component for video streams
  return (
    <CameraPreview
      url={url}
      customcss={customcss}
    />
  );
};

export default UniversalCameraPreview;