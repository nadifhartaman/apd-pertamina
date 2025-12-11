const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cameraApdModel = require("../models/cameraApdModel");
const outputDir = path.join(process.cwd(), "hls");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Track active ffmpeg processes
const activeProcesses = {};

// Configuration presets untuk berbagai kebutuhan
const FFMPEG_PRESETS = {
  low_latency: {
    inputOptions: [
      "-rtsp_transport tcp",
      "-analyzeduration 1000000",
      "-probesize 1000000",
      "-timeout 5000000"
    ],
    outputOptions: [
      "-c:v libx264",
      "-preset ultrafast",
      "-crf 30",
      "-c:a aac",
      "-b:a 96k",
      "-hls_time 0.5",
      "-hls_list_size 30",
      "-hls_flags delete_segments+append_list+independent_segments",
      "-f hls"
    ]
  },
  balanced: {
    inputOptions: [
      "-rtsp_transport tcp",
      "-analyzeduration 2000000",
      "-probesize 2000000",
      "-timeout 7000000"
    ],
    outputOptions: [
      "-c:v libx264",
      "-preset veryfast",
      "-crf 28",
      "-c:a aac",
      "-b:a 128k",
      "-hls_time 1",
      "-hls_list_size 20",
      "-hls_flags delete_segments+append_list+independent_segments",
      "-f hls"
    ]
  },
  high_quality: {
    inputOptions: [
      "-rtsp_transport tcp",
      "-analyzeduration 5000000",
      "-probesize 5000000",
      "-timeout 10000000"
    ],
    outputOptions: [
      "-c:v libx264",
      "-preset fast",
      "-crf 23",
      "-c:a aac",
      "-b:a 192k",
      "-hls_time 2",
      "-hls_list_size 15",
      "-hls_flags delete_segments+append_list+independent_segments",
      "-f hls"
    ]
  },
  copy_stream: {
    inputOptions: [
      "-rtsp_transport tcp",
      "-analyzeduration 5000000",
      "-probesize 5000000",
      "-timeout 10000000"
    ],
    outputOptions: [
      "-c:v copy",
      "-c:a copy",
      "-hls_time 2",
      "-hls_list_size 10",
      "-hls_flags delete_segments+append_list+independent_segments",
      "-f hls"
    ]
  }
};

// Default preset
const DEFAULT_PRESET = process.env.FFMPEG_PRESET || "balanced";

// Generate unique streamKey dari URL RTSP
function generateStreamKey(rtspUrl) {
  return crypto.createHash('md5').update(rtspUrl).digest('hex').substring(0, 12);
}

// Hapus semua segment lama di folder
function clearSegments(streamPath) {
  try {
    if (fs.existsSync(streamPath)) {
      const files = fs.readdirSync(streamPath);
      files.forEach(file => {
        if (file.endsWith('.ts') || file.endsWith('.m3u8')) {
          fs.unlinkSync(path.join(streamPath, file));
        }
      });
      console.log(`✅ Cleared old segments in ${streamPath}`);
    }
  } catch (err) {
    console.error(`❌ Error clearing segments:`, err.message);
  }
}

function startStream (rtspUrl, streamKey) {
  // Gunakan unique key dari URL
  const uniqueStreamKey = generateStreamKey(rtspUrl);
  const streamPath = path.join(outputDir, uniqueStreamKey);
  
  if (!fs.existsSync(streamPath)) {
    fs.mkdirSync(streamPath, { recursive: true });
  } else {
    // Hapus segment lama
    clearSegments(streamPath);
  }

  const outputFile = path.join(streamPath, "index.m3u8");

  console.log(`🎥 Starting FFmpeg stream for ${streamKey}`);
  console.log(`[INFO] Unique Key: ${uniqueStreamKey}`);
  console.log(`[INFO] Stream Path: ${streamPath}`);
  console.log(`[INFO] Input RTSP: ${rtspUrl}`);
  console.log(`[INFO] Output HLS: ${outputFile}`);

  // Kill existing process untuk streamKey yang sama
  if (activeProcesses[uniqueStreamKey]) {
    console.log(`⚠️ Killing existing process for ${uniqueStreamKey}`);
    try {
      activeProcesses[uniqueStreamKey].kill('SIGTERM');
    } catch (e) {
      console.error(`Error killing process: ${e.message}`);
    }
    delete activeProcesses[uniqueStreamKey];
  }

  let retryCount = 0;
  const maxRetries = 3;

  const startFFmpeg = () => {
    const preset = FFMPEG_PRESETS[DEFAULT_PRESET] || FFMPEG_PRESETS.balanced;
    
    const command = ffmpeg(rtspUrl)
      .inputOptions(preset.inputOptions)
      .addOptions(preset.outputOptions)
      .addOptions(["-loglevel warning"])
      .output(outputFile)
      .on("start", (cmdline) => {
        console.log(`✅ FFmpeg started for ${streamKey} (${uniqueStreamKey})`);
        console.log(`   Preset: ${DEFAULT_PRESET}`);
        console.log(`   Stream available at: /hls/${uniqueStreamKey}/index.m3u8`);
        activeProcesses[uniqueStreamKey] = command;
        retryCount = 0; // Reset retry count on success
      })
      .on("stderr", (stderrLine) => {
        if (stderrLine.includes("error") || stderrLine.includes("Error")) {
          console.error(`[FFMPEG ERROR] ${stderrLine}`);
        }
      })
      .on("error", (err, stdout, stderr) => {
        retryCount++;
        console.error(`❌ FFmpeg error attempt ${retryCount}/${maxRetries} (${streamKey}):`, err.message);
        
        if (stderr && stderr.includes("404")) {
          console.error(`⚠️ RTSP URL returned 404 Not Found: ${rtspUrl}`);
          console.error(`   Please verify the RTSP URL is correct and the server is running.`);
        }
        
        delete activeProcesses[uniqueStreamKey];
        
        // Retry dengan exponential backoff
        if (retryCount < maxRetries) {
          const delay = 5000 * retryCount; // 5s, 10s, 15s
          console.log(`🔄 Retrying stream in ${delay}ms... (attempt ${retryCount}/${maxRetries})`);
          setTimeout(startFFmpeg, delay);
        } else {
          console.error(`❌ Max retries reached for ${streamKey}. Stream failed permanently.`);
          console.error(`   Please update the RTSP URL in database and try again.`);
        }
      })
      .on("end", () => {
        console.log(`🛑 FFmpeg stopped for ${streamKey}`);
        delete activeProcesses[uniqueStreamKey];
      })
      .run();

    return command;
  };

  // Mulai FFmpeg process (async)
  startFFmpeg();
  
  // Return uniqueStreamKey langsung (stream akan siap dalam beberapa detik)
  return { uniqueStreamKey };
}

async function initializeStreams () {
  // Check if HLS conversion is enabled
  const ENABLE_HLS = process.env.ENABLE_HLS_CONVERSION !== 'false';
  
  if (!ENABLE_HLS) {
    console.log("HLS Conversion is disabled. Skipping FFmpeg initialization.");
    return;
  }

  console.log("Initializing camera streams from database...");
  try {
    const { data: cameras } = await cameraApdModel.getAllCamera(1, 200);
    console.log(`Total cameras found: ${cameras.length}`);
    const activeCameras = cameras.filter((c) => c.status === "online" && c.rtsp_url.includes("rtsp") && c.rtsp_url);

    console.log(`Found ${activeCameras.length} active cameras to stream.`);
    activeCameras.forEach((cam) => {
      startStream(cam.rtsp_url, cam.channel);
    });
  } catch (err) {
    console.error("Failed to initialize camera streams:", err.message);
  }
}

// Cleanup semua process saat shutdown
process.on('SIGINT', () => {
  console.log("Shutting down ffmpeg processes...");
  Object.values(activeProcesses).forEach(proc => {
    if (proc) proc.kill('SIGTERM');
  });
  process.exit(0);
});

module.exports = { startStream, initializeStreams };
