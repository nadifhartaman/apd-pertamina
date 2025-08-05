"use client";

import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";

export default function AdaptiveVideoPlayer ({ videoUrl, title, large }) {
  const [status, setStatus] = useState("initializing");
  const [logs, setLogs] = useState([]);
  const [detectedFormat, setDetectedFormat] = useState(null);
  const [playerType, setPlayerType] = useState(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const mjpegIntervalRef = useRef(null);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  // Format detection function
  const detectVideoFormat = async (url) => {
    addLog("Starting format detection...");
    setStatus("detecting");

    try {
      // Check URL extension first
      const urlLower = url.toLowerCase();
      if (urlLower.includes('.m3u8')) {
        addLog("Format detected by extension: HLS (.m3u8)");
        return { format: 'hls', confidence: 'high' };
      }
      if (urlLower.includes('.mp4')) {
        addLog("Format detected by extension: MP4");
        return { format: 'mp4', confidence: 'high' };
      }
      if (urlLower.includes('.webm')) {
        addLog("Format detected by extension: WebM");
        return { format: 'webm', confidence: 'high' };
      }

      // Try to fetch headers
      addLog("Attempting to fetch headers...");
      let contentType = null;
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'cors'
        });
        contentType = response.headers.get('content-type');
        addLog(`Content-Type header: ${contentType || 'not available'}`);
      } catch (corsError) {
        addLog("CORS prevented header check, trying alternative methods");
      }

      // Analyze content type
      if (contentType) {
        if (contentType.includes('application/vnd.apple.mpegurl') || contentType.includes('application/x-mpegURL')) {
          return { format: 'hls', confidence: 'high' };
        }
        if (contentType.includes('video/mp4')) {
          return { format: 'mp4', confidence: 'high' };
        }
        if (contentType.includes('video/webm')) {
          return { format: 'webm', confidence: 'high' };
        }
        if (contentType.includes('image/jpeg') || contentType.includes('multipart/x-mixed-replace')) {
          return { format: 'mjpeg', confidence: 'high' };
        }
      }

      // Try video element test
      addLog("Testing with video element...");
      return new Promise((resolve) => {
        const testVideo = document.createElement('video');
        testVideo.muted = true;
        testVideo.preload = 'metadata';

        let resolved = false;
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            addLog("Video element test timeout - trying MJPEG detection");
            resolve({ format: 'mjpeg', confidence: 'low' });
          }
        }, 3000);

        testVideo.addEventListener('loadedmetadata', () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            addLog("Video metadata loaded - format is standard video");
            resolve({ format: 'video', confidence: 'medium' });
          }
        });

        testVideo.addEventListener('error', () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            addLog("Video element failed - likely not standard video format");
            resolve({ format: 'mjpeg', confidence: 'low' });
          }
        });

        testVideo.src = url;
      });

    } catch (error) {
      addLog(`Format detection error: ${error.message}`);
      return { format: 'unknown', confidence: 'none' };
    }
  };

  // Initialize appropriate player based on detected format
  const initializePlayer = (format) => {
    const video = videoRef.current;
    if (!video) return;

    addLog(`Initializing ${format} player...`);

    switch (format) {
      case 'hls':
        initHLSPlayer();
        setPlayerType('hls');
        break;
      case 'mp4':
      case 'webm':
      case 'video':
        initStandardVideoPlayer();
        setPlayerType('standard');
        break;
      case 'mjpeg':
        initMJPEGPlayer();
        setPlayerType('mjpeg');
        break;
      default:
        // Try standard video as fallback
        addLog("Unknown format, trying standard video player as fallback");
        initStandardVideoPlayer();
        setPlayerType('fallback');
    }
  };

  // HLS Player
  const initHLSPlayer = () => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      addLog("Initializing HLS.js player");

      const hls = new Hls({
        debug: false,
        enableWorker: false,
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 3,
        fragLoadingTimeOut: 30000,
        fragLoadingMaxRetry: 3
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_LOADED, () => {
        addLog("HLS manifest loaded successfully");
        setStatus("ready");
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        addLog("HLS manifest parsed - starting playback");
        video.muted = true;
        video.play()
          .then(() => {
            addLog("HLS playback started");
            setStatus("playing");
          })
          .catch(err => {
            addLog(`HLS play error: ${err.message}`);
            setStatus("play-error");
          });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          addLog(`HLS Fatal Error: ${data.details}`);
          setStatus("error");
        }
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      addLog("Using native HLS support");
      video.src = videoUrl;
      video.muted = true;

      video.addEventListener('canplay', () => {
        addLog("Native HLS ready to play");
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
    }
  };

  // Standard Video Player
  const initStandardVideoPlayer = () => {
    const video = videoRef.current;
    addLog("Initializing standard video player");

    video.src = videoUrl;
    video.muted = true;

    video.addEventListener('loadedmetadata', () => {
      addLog(`Video loaded: ${video.videoWidth}x${video.videoHeight}, ${video.duration}s`);
      setStatus("ready");
    });

    video.addEventListener('canplay', () => {
      addLog("Video ready to play");
      video.play()
        .then(() => {
          addLog("Video playback started");
          setStatus("playing");
        })
        .catch(err => {
          addLog(`Video play error: ${err.message}`);
          setStatus("play-error");
        });
    });

    video.addEventListener('error', (e) => {
      addLog(`Video error: ${video.error?.message || 'Unknown error'}`);
      setStatus("error");
    });
  };

  // MJPEG Player (using img element with refresh)
  const initMJPEGPlayer = () => {
    addLog("Initializing MJPEG player (image refresh method)");
    setStatus("ready");

    // Hide video element and show image-based player
    const video = videoRef.current;
    if (video) {
      video.style.display = 'none';
    }

    // Create image element for MJPEG
    const container = video.parentElement;
    let mjpegImg = container.querySelector('.mjpeg-img');

    if (!mjpegImg) {
      mjpegImg = document.createElement('img');
      mjpegImg.className = 'mjpeg-img w-full h-auto bg-stone-800';
      mjpegImg.style.minHeight = '400px';
      container.appendChild(mjpegImg);
    }

    // Add timestamp to prevent caching
    const refreshMJPEG = () => {
      const timestamp = new Date().getTime();
      mjpegImg.src = `${videoUrl}?t=${timestamp}`;
    };

    mjpegImg.onload = () => {
      if (status !== "playing") {
        addLog("MJPEG stream started");
        setStatus("playing");
      }
    };

    mjpegImg.onerror = () => {
      addLog("MJPEG load error");
      setStatus("error");
    };

    // Refresh every 100ms for smooth playback
    refreshMJPEG();
    mjpegIntervalRef.current = setInterval(refreshMJPEG, 100);
  };

  useEffect(() => {
    if (!videoUrl) {
      setStatus("no-url");
      addLog("No video URL provided");
      return;
    }

    const initializeVideo = async () => {
      addLog(`Starting initialization with URL: ${videoUrl}`);

      // Wait for video ref to be ready
      if (!videoRef.current) {
        setTimeout(initializeVideo, 100);
        return;
      }

      // Detect format first
      const detection = await detectVideoFormat(videoUrl);
      setDetectedFormat(detection);
      addLog(`Format detected: ${detection.format} (confidence: ${detection.confidence})`);

      // Initialize appropriate player
      initializePlayer(detection.format);
    };

    initializeVideo();

    return () => {
      // Cleanup
      if (hlsRef.current) {
        addLog("Cleaning up HLS instance");
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (mjpegIntervalRef.current) {
        addLog("Cleaning up MJPEG interval");
        clearInterval(mjpegIntervalRef.current);
        mjpegIntervalRef.current = null;
      }
      // Clean up MJPEG image element
      const video = videoRef.current;
      if (video && video.parentElement) {
        const mjpegImg = video.parentElement.querySelector('.mjpeg-img');
        if (mjpegImg) {
          mjpegImg.remove();
        }
      }
    };
  }, [videoUrl]);

  const getStatusColor = () => {
    switch (status) {
      case "playing": return "bg-green-500";
      case "ready": return "bg-blue-500";
      case "detecting":
      case "loading": return "bg-yellow-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPlayerTypeDisplay = () => {
    switch (playerType) {
      case 'hls': return 'HLS Player';
      case 'standard': return 'Standard Video Player';
      case 'mjpeg': return 'MJPEG Stream Player';
      case 'fallback': return 'Fallback Player';
      default: return 'Detecting...';
    }
  };

  return (
    <div className=" bg-black text-white py-1.5">
      <div className="flex items-center gap-1 p-2 m-1 text-xs">
        <div className="w-full flex justify-between">
          <span className="font-semibold">{title}</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="font-semibold">Status: {status}</span>
          </div>
        </div>
        {/* {playerType && (
          <span className="ml-4 px-2 py-2 bg-gray-800 text-xs rounded">
            {getPlayerTypeDisplay()}
          </span>
        )} */}
      </div>

      <div className="">
        <video
          ref={videoRef}
          className={`w-full h-auto ${large ? 'min-h-96' : 'min-h-52'} bg-black`}
          controls
          muted
          playsInline
          onError={() => console.error("Video failed to load (possible CORS error).")}
          style={{ backgroundColor: 'black', width: '100%', height: '100%' }} />
      </div>
      {/* 
      <div className="bg-gray-100 p-3 rounded mb-4">
        <h4 className="font-semibold mb-2">Debug Logs:</h4>
        <div className="max-h-40 overflow-y-auto text-sm font-mono">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>
      </div> */}

      {/* <div className="text-sm text-gray-600">
        <p><strong>URL:</strong> {videoUrl}</p>
        <p><strong>Detected Format:</strong> {detectedFormat ? `${detectedFormat.format} (${detectedFormat.confidence} confidence)` : 'Detecting...'}</p>
        <p><strong>Player Type:</strong> {getPlayerTypeDisplay()}</p>
        <p><strong>HLS.js Support:</strong> {Hls.isSupported() ? "Yes" : "No"}</p>
        <p><strong>Native HLS:</strong> {document.createElement('video').canPlayType('application/vnd.apple.mpegurl') ? "Yes" : "No"}</p>
      </div> */}
    </div>
  );
}