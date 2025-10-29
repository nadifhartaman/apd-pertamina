const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const cameraApdModel = require("../models/cameraApdModel");
const outputDir = path.join(process.cwd(), "hls");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

function startStream (rtspUrl, streamKey) {
  const streamPath = path.join(outputDir, streamKey);
  if (!fs.existsSync(streamPath)) fs.mkdirSync(streamPath, { recursive: true });

  const outputFile = path.join(streamPath, "index.m3u8");

  console.log(`🎥 Starting FFmpeg stream for ${streamKey}`);
  console.log(`[INFO] Input: ${rtspUrl}`);
  console.log(`[INFO] Output: ${outputFile}`);

  const command = ffmpeg(rtspUrl)
    // .inputOptions(["-rtsp_transport tcp"])
    // .addOptions([
    //   "-fflags +genpts",
    //   "-preset veryfast",
    //   "-tune zerolatency",
    //   "-hls_time 2",
    //   "-hls_list_size 6",
    //   "-hls_flags delete_segments",
    //   "-f hls",
    //   "-loglevel debug",
    // ])

    .inputOptions([
      "-rtsp_transport tcp",
      "-stream_loop -1",
      "-re"
    ])
    .addOptions([
      "-preset veryfast",
      "-tune zerolatency",
      "-hls_time 4",
      "-hls_list_size 5",
      "-hls_flags delete_segments+append_list",
      "-f hls",
      "-loglevel error"
    ])
    .output(outputFile)
    .on("start", () => console.log(`✅ FFmpeg started for ${streamKey}`))
    .on("stderr", () => { })
    .on("error", (err) => console.error(`❌ FFmpeg error (${streamKey}):`, err.message))
    .on("end", () => console.log(`🛑 FFmpeg stopped for ${streamKey}`))
    .run();

  return command;
}
// .on("stderr", (line) => console.log(`[${streamKey}] ${line}`))

async function initializeStreams () {
  console.log("Initializing camera streams from database...");
  try {
    // get all cameras from database
    const { data: cameras } = await cameraApdModel.getAllCamera(1, 200);
    console.log(`Total cameras found: ${cameras.length}`);
    // console.log(`Total cameras found: ${JSON.stringify(cameras)}`);
    const activeCameras = cameras.filter((c) => c.status === "online" && c.rtsp_url.includes("rtsp") && c.rtsp_url);

    console.log(`Found ${activeCameras.length} active cameras to stream.`);
    activeCameras.forEach((cam) => {
      startStream(cam.rtsp_url, cam.channel);
    });
  } catch (err) {
    console.error("Failed to initialize camera streams:", err.message);
  }
}
module.exports = { startStream, initializeStreams };
