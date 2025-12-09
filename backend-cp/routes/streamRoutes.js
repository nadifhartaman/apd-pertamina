const express = require("express");
const crypto = require("crypto");
const { startStream } = require("../middleware/ffmpegService");
const cameraApdModel = require("../models/cameraApdModel");
const { dbApd } = require("../db");

const router = express.Router();

// Generate unique streamKey dari URL RTSP (sama seperti di ffmpegService)
function generateStreamKey(rtspUrl) {
  return crypto.createHash('md5').update(rtspUrl).digest('hex').substring(0, 12);
}

router.get("/:cameraName", async (req, res) => {
  try {
    const { cameraName } = req.params;

    // Ambil kamera berdasarkan nama atau channel
    let camera;
    try {
      const result = await dbApd.query("SELECT * FROM cameras WHERE channel = ? OR id = ? LIMIT 1", [cameraName, cameraName]);
      camera = result[0]?.[0];
    } catch (dbErr) {
      console.error(`❌ Database error fetching camera ${cameraName}:`, dbErr.message);
      return res.status(503).json({ error: `Database connection error: ${dbErr.message}` });
    }

    if (!camera) {
      return res.status(404).json({ error: `Camera '${cameraName}' not found in database` });
    }

    if (!camera.rtsp_url) {
      return res.status(400).json({ error: `RTSP URL is missing for camera '${cameraName}'` });
    }

    // Mulai stream via FFmpeg
    const { uniqueStreamKey } = startStream(camera.rtsp_url, cameraName);

    // Tunggu sebentar agar HLS files ter-generate
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return unique key, bukan channel name!
    const playlist = `/hls/${uniqueStreamKey}/index.m3u8`;

    res.json({
      message: `Stream started for ${cameraName}`,
      playlist,
      streamKey: uniqueStreamKey,
      camera: {
        id: camera.id,
        name: camera.name,
        channel: camera.channel,
        rtsp_url: camera.rtsp_url
      },
    });
  } catch (err) {
    console.error("Stream error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update stream URL untuk kamera tertentu (tanpa restart)
router.post("/:cameraName/update", async (req, res) => {
  try {
    const { cameraName } = req.params;
    const { rtsp_url } = req.body;

    if (!rtsp_url) {
      return res.status(400).json({ error: "rtsp_url is required" });
    }

    // Ambil kamera dari database
    const [camera] = (
      await dbApd.query("SELECT * FROM cameras WHERE channel = ? OR id = ?", [cameraName, cameraName])
    )[0] || [];

    if (!camera) {
      return res.status(404).json({ error: `Camera '${cameraName}' not found` });
    }

    // Update URL di database
    await dbApd.query("UPDATE cameras SET rtsp_url = ? WHERE id = ?", [rtsp_url, camera.id]);
    console.log(`✏️ Updated RTSP URL for ${cameraName}: ${rtsp_url}`);

    // Mulai stream dengan URL baru (akan auto kill stream lama)
    const { uniqueStreamKey } = startStream(rtsp_url, cameraName);

    // Tunggu sebentar agar HLS files ter-generate
    await new Promise(resolve => setTimeout(resolve, 2000));

    const playlist = `/hls/${uniqueStreamKey}/index.m3u8`;

    res.json({
      message: `Stream updated for ${cameraName}`,
      playlist,
      streamKey: uniqueStreamKey,
      camera: {
        id: camera.id,
        name: camera.name,
        rtsp_url: rtsp_url,
      },
    });
  } catch (err) {
    console.error("Stream update error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { data: cameras } = await cameraApdModel.getAllCamera(1, 100);
    const activeCameras = cameras.filter((c) => c.status === "active");

    const streamsList = activeCameras.map((cam) => {
      const { uniqueStreamKey } = startStream(cam.rtsp_url, cam.channel);
      return {
        id: cam.id,
        name: cam.name,
        channel: cam.channel,
        playlist: `/hls/${uniqueStreamKey}/index.m3u8`,
        streamKey: uniqueStreamKey,
      };
    });

    res.json({
      message: `Started ${activeCameras.length} active camera streams`,
      cameras: streamsList,
    });
  } catch (err) {
    console.error("Failed to start camera streams:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
