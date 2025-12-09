/**
 * Test script untuk memverifikasi HLS streaming
 * Jalankan: node test-stream.js
 */

const crypto = require("crypto");

// Simulasi RTSP URL dari database
const RTSP_URL = "rtsp://127.0.0.1:8554/video1";

function generateStreamKey(rtspUrl) {
  return crypto.createHash('md5').update(rtspUrl).digest('hex').substring(0, 12);
}

const streamKey = generateStreamKey(RTSP_URL);

console.log("\n=== HLS Stream Testing ===\n");
console.log(`RTSP URL: ${RTSP_URL}`);
console.log(`Generated Stream Key: ${streamKey}`);
console.log(`\nExpected HLS URL in browser/VLC:`);
console.log(`http://localhost:3001/hls/${streamKey}/index.m3u8`);
console.log(`\nExpected HLS folder: ./hls/${streamKey}/`);

console.log("\n=== Testing Steps ===\n");
console.log("1. Ensure FFmpeg is installed");
console.log("2. Start backend: npm start");
console.log("3. Call GET /api/stream/camera-channel");
console.log("4. Get streamKey from response");
console.log("5. Open in VLC: http://localhost:3001/hls/{streamKey}/index.m3u8");
console.log("6. Or use frontend: http://localhost:3000 to view stream\n");

console.log("=== Troubleshooting ===\n");
console.log("❌ 404 Error?");
console.log("  - Check if FFmpeg process started successfully");
console.log("  - Verify RTSP URL is accessible from server");
console.log("  - Check ./hls/ folder exists");
console.log("  - Wait 2-3 seconds after API call for HLS files to generate\n");

console.log("❌ 503 Error?");
console.log("  - Check database connection");
console.log("  - Verify camera record exists in database\n");

console.log("❌ Streaming starts but video doesn't play?");
console.log("  - Check browser console for HLS.js errors");
console.log("  - Verify network tab shows m3u8 and .ts files loading");
console.log("  - Try VLC player as fallback\n");
