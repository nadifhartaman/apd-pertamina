"use client";

import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";

export default function SimpleVideoTest({ videoUrl }) {
  const [status, setStatus] = useState("initializing");
  const [logs, setLogs] = useState([]);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    if (!videoUrl) {
      setStatus("no-url");
      addLog("No video URL provided");
      return;
    }

    addLog(`Starting initialization with URL: ${videoUrl}`);
    setStatus("loading");

    const initVideo = () => {
      if (!videoRef.current) {
        addLog("Video ref not ready, waiting...");
        setTimeout(initVideo, 100);
        return;
      }

      const video = videoRef.current;
      addLog("Video element is ready, starting HLS initialization");

      if (Hls.isSupported()) {
        addLog("HLS.js is supported, creating instance");
        
        const hls = new Hls({
          debug: true,
          enableWorker: false,
          manifestLoadingTimeOut: 20000,
          manifestLoadingMaxRetry: 3,
          fragLoadingTimeOut: 30000,
          fragLoadingMaxRetry: 3
        });

        hlsRef.current = hls;

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          addLog("HLS media attached");
        });

        hls.on(Hls.Events.MANIFEST_LOADING, () => {
          addLog("HLS manifest loading started");
        });

        hls.on(Hls.Events.MANIFEST_LOADED, () => {
          addLog("HLS manifest loaded successfully");
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          addLog("HLS manifest parsed - ready to play");
          setStatus("ready");
          
          video.muted = true;
          video.play()
            .then(() => {
              addLog("Video playback started");
              setStatus("playing");
            })
            .catch(err => {
              addLog(`Play error: ${err.message}`);
              setStatus("play-error");
            });
        });

        hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
          addLog(`Level loaded: ${data.details}`);
        });

        hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
          addLog(`Fragment loading: ${data.frag.url}`);
        });

        hls.on(Hls.Events.FRAG_LOADED, () => {
          addLog("Fragment loaded successfully");
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          addLog(`HLS Error: ${data.type} - ${data.details} - ${data.fatal ? 'FATAL' : 'NON-FATAL'}`);
          
          if (data.fatal) {
            setStatus("error");
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                addLog("Fatal network error - attempting recovery");
                setTimeout(() => hls.startLoad(), 1000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                addLog("Fatal media error - attempting recovery");
                setTimeout(() => hls.recoverMediaError(), 1000);
                break;
              default:
                addLog("Unrecoverable error");
                break;
            }
          }
        });

        addLog("Loading HLS source...");
        hls.loadSource(videoUrl);
        hls.attachMedia(video);

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        addLog("Using native HLS support");
        video.src = videoUrl;
        video.muted = true;
        
        video.addEventListener('loadeddata', () => {
          addLog("Native HLS loaded successfully");
          setStatus("ready");
          video.play()
            .then(() => {
              addLog("Native HLS playback started");
              setStatus("playing");
            })
            .catch(err => {
              addLog(`Native HLS play error: ${err.message}`);
              setStatus("play-error");
            });
        });

        video.addEventListener('error', (e) => {
          addLog(`Native HLS error: ${e.message || 'Unknown error'}`);
          setStatus("error");
        });

      } else {
        addLog("HLS not supported in this browser");
        setStatus("not-supported");
      }
    };

    initVideo();

    return () => {
      if (hlsRef.current) {
        addLog("Cleaning up HLS instance");
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl]);

  const getStatusColor = () => {
    switch (status) {
      case "playing": return "bg-green-500";
      case "ready": return "bg-blue-500";
      case "loading": return "bg-yellow-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="font-semibold">Status: {status}</span>
      </div>

      <div className="mb-4">
        <video
          ref={videoRef}
          className="w-full max-w-md h-auto bg-black"
          controls
          muted
          playsInline
          style={{ minHeight: '200px' }}
        />
      </div>

      <div className="bg-gray-100 p-3 rounded">
        <h4 className="font-semibold mb-2">Debug Logs:</h4>
        <div className="max-h-40 overflow-y-auto text-sm font-mono">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>
      </div>

      {/* <div className="mt-3 text-sm text-gray-600">
        <p><strong>URL:</strong> {videoUrl}</p>
        <p><strong>HLS.js Support:</strong> {Hls.isSupported() ? "Yes" : "No"}</p>
        <p><strong>Native HLS:</strong> {document.createElement('video').canPlayType('application/vnd.apple.mpegurl') ? "Yes" : "No"}</p>
      </div> */}
    </div>
  );
}