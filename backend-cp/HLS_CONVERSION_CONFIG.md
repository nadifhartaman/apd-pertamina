# HLS Conversion Configuration

## Overview
Environment variable `ENABLE_HLS_CONVERSION` mengontrol apakah FFmpeg service untuk HLS streaming aktif atau tidak.

## Configuration

### Enable HLS (Default)
```env
ENABLE_HLS_CONVERSION=true
```
- FFmpeg service akan berjalan saat server startup
- Semua kamera RTSP akan dikonversi ke HLS format
- Client menerima `/hls/{streamKey}/index.m3u8` playlist URL
- Memerlukan CPU untuk encoding

### Disable HLS (Direct RTSP Mode)
```env
ENABLE_HLS_CONVERSION=false
```
- FFmpeg service **TIDAK** akan dijalankan
- Client menerima direct RTSP URL dari database
- Hemat CPU, tapi client harus support RTSP playback
- Perlu media player yang support RTSP (VLC, HLS.js dengan plugin khusus, dll)

## API Response

### Dengan HLS Enabled (true)
```json
{
  "message": "Stream started for camera1",
  "playlist": "/hls/876e358dd8a5/index.m3u8",
  "streamKey": "876e358dd8a5",
  "mode": "hls",
  "camera": { ... }
}
```

### Dengan HLS Disabled (false)
```json
{
  "message": "HLS conversion disabled. Returning direct RTSP stream for camera1",
  "streamKey": "876e358dd8a5",
  "rtsp_url": "rtsp://camera-ip/stream",
  "mode": "direct_rtsp",
  "camera": { ... }
}
```

## Use Cases

| Scenario | Setting | Alasan |
|----------|---------|--------|
| Web browser playback | `ENABLE_HLS_CONVERSION=true` | Browser hanya support HLS, tidak bisa RTSP |
| Server resources limited | `ENABLE_HLS_CONVERSION=false` | Hemat CPU/bandwidth, pakai direct RTSP |
| Mobile app support | `ENABLE_HLS_CONVERSION=true` | Mobile app lebih support HLS |
| High latency acceptable | `ENABLE_HLS_CONVERSION=false` | Direct RTSP lebih cepat, low-latency |

## Implementation Details

1. **server.js** - Conditional initialization of FFmpeg service
2. **ffmpegService.js** - Check ENABLE_HLS before starting streams
3. **streamRoutes.js** - Return appropriate response based on HLS status
4. **.env.example** - Documentation tentang flag ini

## Console Output

### HLS Enabled
```
Server running at http://localhost:3001
HLS Conversion: ENABLED ✓
Initializing camera streams from database...
Total cameras found: 5
Found 3 active cameras to stream.
```

### HLS Disabled
```
Server running at http://localhost:3001
HLS Conversion: DISABLED (Direct RTSP mode only)
```

## Client Implementation

### Untuk HLS Mode (browser based)
```javascript
// Use HLS.js atau video.js
const video = document.querySelector('video');
if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource('http://localhost:3001/hls/{streamKey}/index.m3u8');
  hls.attachMedia(video);
}
```

### Untuk Direct RTSP Mode
```javascript
// Gunakan VLC atau server-side proxy
// Client: rtsp://localhost:3001/api/stream/{cameraName}
// Atau gunakan ffmpeg untuk transcode di client-side
```
