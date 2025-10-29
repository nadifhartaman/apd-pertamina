const express = require("express");
const { startStream } = require("../middleware/ffmpegService");
const cameraApdModel = require("../models/cameraApdModel");
const { dbApd } = require("../db");

const router = express.Router();

router.get("/:cameraName", async (req, res) => {
  try {
    const { cameraName } = req.params;

    // Ambil kamera berdasarkan nama
    const [camera] = (
      await dbApd.query("SELECT * FROM cameras WHERE channel = ?", [cameraName])
    )[0] || [];

    if (!camera) {
      return res.status(404).json({ error: `Camera '${cameraName}' not found in database` });
    }

    if (!camera.rtsp_url) {
      return res.status(400).json({ error: `RTSP URL is missing for camera '${cameraName}'` });
    }

    // Mulai stream via FFmpeg
    startStream(camera.rtsp_url, cameraName);

    const playlist = `/hls/${cameraName}/index.m3u8`;

    res.json({
      message: `Stream started for ${cameraName}`,
      playlist,
      camera,
    });
  } catch (err) {
    console.error("Stream error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { data: cameras } = await cameraApdModel.getAllCamera(1, 100);
    const activeCameras = cameras.filter((c) => c.status === "active");

    activeCameras.forEach((cam) => {
      startStream(cam.rtsp_url, cam.channel);
    });

    res.json({
      message: `Started ${activeCameras.length} active camera streams`,
      cameras: activeCameras.map((c) => ({
        name: c.name,
        playlist: `/hls/${c.name}/index.m3u8`,
      })),
    });
  } catch (err) {
    console.error("Failed to start camera streams:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
