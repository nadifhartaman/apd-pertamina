import { useState, useRef } from "react";

export default function VideoFormatDetector() {
  const [url, setUrl] = useState("https://cctv.jogjakota.go.id/61ff5dcd-d57a-4be5-840f-97ff368414d7");
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("ready");
  const videoRef = useRef(null);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const checkVideoFormat = async () => {
    if (!url) return;
    
    clearLogs();
    setStatus("checking");
    addLog(`Checking format for: ${url}`);

    try {
      // Method 1: Try fetch to check headers
      addLog("Fetching headers...");
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // Handle CORS
      });
      
      addLog(`Response status: ${response.status}`);
      addLog(`Response type: ${response.type}`);
      
      // Get content type if available
      const contentType = response.headers.get('content-type');
      if (contentType) {
        addLog(`Content-Type: ${contentType}`);
      } else {
        addLog("Content-Type header not accessible (CORS)");
      }

    } catch (error) {
      addLog(`Fetch error: ${error.message}`);
    }

    // Method 2: Try with video element
    addLog("Testing with video element...");
    const video = videoRef.current;
    if (video) {
      video.src = url;
      
      video.addEventListener('loadstart', () => {
        addLog("Video: loadstart event fired");
      });

      video.addEventListener('loadedmetadata', () => {
        addLog("Video: metadata loaded successfully");
        addLog(`Video duration: ${video.duration}s`);
        addLog(`Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
        setStatus("video-compatible");
      });

      video.addEventListener('canplay', () => {
        addLog("Video: can play - format is supported");
        setStatus("playable");
      });

      video.addEventListener('error', (e) => {
        addLog(`Video error: ${e.message || 'Unknown error'}`);
        addLog(`Error code: ${video.error?.code}`);
        addLog(`Error message: ${video.error?.message}`);
        setStatus("video-error");
      });

      // Test different formats
      const formats = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'application/vnd.apple.mpegurl', // HLS
        'video/mp2t', // MPEG-TS
        'image/jpeg' // MJPEG
      ];

      addLog("Testing format support:");
      formats.forEach(format => {
        const support = video.canPlayType(format);
        addLog(`${format}: ${support || 'not supported'}`);
      });
    }

    // Method 3: Try as image (for MJPEG streams)
    addLog("Testing as image (MJPEG check)...");
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      addLog("Image loaded successfully - might be MJPEG stream");
      setStatus("mjpeg-compatible");
    };
    
    img.onerror = () => {
      addLog("Not a valid image format");
    };
    
    img.src = url;
  };

  const testDirectPlay = () => {
    addLog("Attempting direct playback...");
    const video = videoRef.current;
    if (video) {
      video.src = url;
      video.play()
        .then(() => {
          addLog("Direct playback successful!");
          setStatus("playing");
        })
        .catch(err => {
          addLog(`Direct playback failed: ${err.message}`);
        });
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "playing": return "bg-green-500";
      case "playable": return "bg-blue-500";
      case "video-compatible": return "bg-cyan-500";
      case "mjpeg-compatible": return "bg-purple-500";
      case "checking": return "bg-yellow-500";
      case "video-error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Video Format Detector</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Video URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter video URL"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={checkVideoFormat}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={status === "checking"}
        >
          Check Format
        </button>
        <button
          onClick={testDirectPlay}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Direct Play
        </button>
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="font-semibold">Status: {status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Video Player Test:</h3>
          <video
            ref={videoRef}
            className="w-full max-w-md h-auto bg-black border"
            controls
            muted
            playsInline
            style={{ minHeight: '200px' }}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Debug Logs:</h3>
          <div className="bg-gray-100 p-3 rounded max-h-60 overflow-y-auto">
            <div className="text-sm font-mono">
              {logs.length === 0 ? (
                <div className="text-gray-500">Click "Check Format" to start testing...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <h4 className="font-semibold mb-2">Format Detection Guide:</h4>
        <ul className="text-sm space-y-1">
          <li><strong>HLS (.m3u8):</strong> Use HLS.js component</li>
          <li><strong>MP4/WebM:</strong> Use standard video element</li>
          <li><strong>MJPEG:</strong> Use img element with refresh</li>
          <li><strong>WebRTC:</strong> Requires WebRTC API</li>
          <li><strong>RTMP:</strong> Needs conversion or special player</li>
        </ul>
      </div>
    </div>
  );
}