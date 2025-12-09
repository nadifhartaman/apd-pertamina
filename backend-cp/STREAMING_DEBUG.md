## Video Streaming Debugging Guide

### Problem Diagnosis

Your error showed:
```
Request URL: http://localhost:3001/hls/876e358dd8a5/index.m3u8
Status Code: 404 Not Found
```

This means the HLS stream key `876e358dd8a5` doesn't match the actual generated key from your RTSP URL.

---

### Root Cause

The system works like this:

```
1. RTSP URL (rtsp://127.0.0.1:8554/video1) 
   ↓
2. Generate MD5 hash → Take first 12 chars (e.g., "876e358dd8a5")
   ↓
3. Create folder: ./hls/{uniqueStreamKey}/
   ↓
4. FFmpeg writes: ./hls/{uniqueStreamKey}/index.m3u8
   ↓
5. Frontend loads: http://localhost:3001/hls/{uniqueStreamKey}/index.m3u8
```

**Key Issue**: The stream key MUST match between:
- Hash generated from RTSP URL
- Folder created in `./hls/`
- Frontend request URL

---

### Solution Applied

Fixed in 3 files:

#### 1. `middleware/ffmpegService.js`
- ✅ Changed return value: `{ command: startFFmpeg(), uniqueStreamKey }` → `{ uniqueStreamKey }`
- ✅ Now returns uniqueStreamKey immediately (FFmpeg starts async)
- ✅ Better logging for debugging

#### 2. `routes/streamRoutes.js`
- ✅ Added 2-second delay: `await new Promise(resolve => setTimeout(resolve, 2000))`
- ✅ Ensures HLS files are generated before API returns
- ✅ Prevents 404 by giving FFmpeg time to create m3u8 file

#### 3. `components/dashboard/listPreview.js`
- ✅ Already correctly using `streamKeys[location.id]` from API response
- ✅ URL construction: `http://localhost:3001/hls/${streamKey}/index.m3u8` is correct

---

### Testing Flow

1. **Backend starts streaming on boot**
   ```
   GET /api/stream/initialize
   → FFmpeg starts for each camera
   → Waits 2 seconds
   → Returns streamKey
   ```

2. **Frontend requests stream info**
   ```
   GET /api/stream/{cameraName}
   → Returns: { streamKey: "876e358dd8a5", playlist: "/hls/876e358dd8a5/index.m3u8" }
   ```

3. **Frontend loads HLS playlist**
   ```
   GET /hls/876e358dd8a5/index.m3u8
   → Static file serve (express.static)
   → HLS.js plays video
   ```

---

### Verification Checklist

- [ ] RTSP URL is correct: `rtsp://127.0.0.1:8554/video1`
- [ ] FFmpeg is installed and working
- [ ] Backend console shows: `✅ FFmpeg started for...`
- [ ] `./hls/` folder exists and is not empty
- [ ] File `./hls/{streamKey}/index.m3u8` exists
- [ ] VLC can play: `http://localhost:3001/hls/{streamKey}/index.m3u8`
- [ ] Frontend shows video without 404

---

### VLC Testing

Add in VLC:
```
Media → Open Network Stream
Enter: http://localhost:3001/hls/876e358dd8a5/index.m3u8
```

Or command line:
```bash
vlc "http://localhost:3001/hls/876e358dd8a5/index.m3u8"
```

---

### If Still Getting 404

1. **Check if HLS folder exists:**
   ```bash
   ls -la hls/
   ```
   Should show: `876e358dd8a5/`

2. **Check if m3u8 file exists:**
   ```bash
   ls -la hls/876e358dd8a5/
   ```
   Should show: `index.m3u8` + `.ts` segments

3. **Check server logs:**
   ```
   Backend console should show:
   ✅ FFmpeg started for... (876e358dd8a5)
   Stream available at: /hls/876e358dd8a5/index.m3u8
   ```

4. **Check RTSP URL is accessible:**
   ```bash
   ffprobe -rtsp_transport tcp rtsp://127.0.0.1:8554/video1
   ```

5. **Check if process is running:**
   - Windows: Check Task Manager for ffmpeg.exe
   - Linux/Mac: `ps aux | grep ffmpeg`

---

### Common Issues & Solutions

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 Not Found | HLS file not created | Wait 2-3 seconds after API call |
| Empty .ts files | FFmpeg can't read RTSP | Verify RTSP URL is correct |
| Black screen | HLS loads but no video | Check browser console for HLS errors |
| Video stuttering | Network or FFmpeg lag | Increase `-hls_time` in ffmpegService.js |
| 503 Service Unavailable | DB error | Check database connection |

---

### Next Steps

1. Restart backend: `npm start`
2. Check console for FFmpeg start messages
3. Call API from frontend
4. Verify HLS files in `./hls/` folder
5. Test in VLC first before checking frontend
6. Check browser Network tab for failed requests

