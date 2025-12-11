# 🚧 APD Pertamina

Sistem monitoring dan analitik rekap kepatuhan APD Pertamina dengan CCTV streaming real-time dan deteksi menggunakan ML.

## 📁 Struktur Proyek

```
.
├── backend/           # API server Python (FastAPI/Flask) - DEPRECATED
├── backend-cp/        # API server Node.js + Express + MySQL (AKTIF)
└── frontend/          # Dashboard web (Next.js + Tailwind CSS)
```

---

## ⚙️ Teknologi yang Digunakan

| Layer      | Stack                                                    |
| ---------- | -------------------------------------------------------- |
| Backend    | Node.js, Express.js, MySQL 8.0+, Socket.IO, FFmpeg      |
| Frontend   | Next.js 14+, React, Tailwind CSS, Chart.js, Axios       |
| Database   | MySQL 8.0+                                               |
| Streaming  | HLS (HTTP Live Streaming), RTSP, FFmpeg                  |
| Real-time  | Socket.IO untuk notifikasi & update live                |

---

## 📂 Backend Structure (backend-cp)

```
backend-cp/
├── controllers/           # Business logic
│   ├── apdController.js   # APD detection & statistics
│   ├── authApdController.js
│   └── cameraApdController.js
├── models/                # Database queries
│   ├── apdModel.js        # Container & violation queries
│   ├── cameraApdModel.js  # Camera management
│   └── userApdModel.js    # User authentication
├── routes/                # API endpoints
│   ├── apdRoutes.js       # APD endpoints
│   ├── authApdRoutes.js   # Auth endpoints
│   ├── streamRoutes.js    # HLS/RTSP streaming
│   └── publicRoutes.js
├── middleware/
│   ├── authApdMiddleware.js
│   └── ffmpegService.js   # FFmpeg streaming service
├── hls/                   # HLS segments storage
├── .env                   # Environment variables
├── db.js                  # MySQL pool connection
├── server.js              # Express app setup
└── package.json
```

### 🔑 API Endpoints Utama

| Method | Endpoint                      | Deskripsi                      |
| ------ | ----------------------------- | ------------------------------ |
| GET    | `/api/apd`                    | List deteksi dengan pagination |
| GET    | `/api/apd/daily-stats`        | Statistik harian/mingguan      |
| GET    | `/api/apd/summary-violation`  | Ringkasan pelanggaran          |
| GET    | `/api/apd/count-per-week`     | Grafik per minggu              |
| GET    | `/api/apd/today-per-hour`     | Grafik per jam                 |
| GET    | `/api/apd/camera`             | Daftar kamera                  |
| POST   | `/api/auth/login`             | User login                     |
| POST   | `/api/auth/register`          | User registration              |
| GET    | `/api/stream/:cameraName`     | Get streaming URL              |

---

## 📂 Frontend Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.js             # Dashboard utama
│   │   ├── auth/
│   │   │   ├── login/page.js
│   │   │   └── register/page.js
│   │   ├── camera/
│   │   │   ├── page.js         # Camera list
│   │   │   ├── manager/page.js # Camera management
│   │   │   └── [id]/test/page.js
│   │   └── layout.js           # Main layout
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── cctvRecap.js
│   │   │   ├── timeSeries.js
│   │   │   ├── violationBreakdown.js
│   │   │   ├── statsCard.js
│   │   │   └── listPreview.js
│   │   ├── manager/            # CCTV manager components
│   │   │   └── wsPreview.js
│   │   ├── layout/
│   │   │   └── layoutMain.js
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/
│   │   ├── useAPD.js           # APD data fetching & filtering
│   │   └── useCameraAPD.js
│   ├── api/
│   │   ├── apdService.js       # APD API calls
│   │   ├── authService.js      # Auth API calls
│   │   ├── cameraService.js    # Camera API calls
│   │   └── apiInstance.js      # Axios instance
│   ├── lib/                    # Utilities
│   │   └── apiClient.js
│   └── contexts/               # React contexts
├── public/
│   ├── image/
│   └── models/                 # ML models for browser
├── .env.local                  # Environment variables
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🔄 Integrasi API

Frontend berkomunikasi dengan backend melalui REST API dengan Axios.

### Contoh: Fetch Weekly Statistics
```javascript
// Frontend (useAPD.js)
const result = await apdService.getDailyStats('week');

// API Call: GET /api/apd/daily-stats?type=week
// Response:
// {
//   success: true,
//   date: "2025-12-11",
//   hourly: [{ hour: 0, count: 5 }, ...],
//   totalChange: { total: 150, percentage: "12.50%", status: "increase" },
//   violationSummary: { ... }
// }
```

### Filter Types Supported
- `today` - Data hari ini
- `yesterday` - Data kemarin  
- `week` - 7 hari terakhir (auto-generate range)
- `month` - Bulan ini
- `custom` - Custom date range (dengan startDate, endDate)

Detail integrasi lengkap: [INTEGRATION.md](./INTEGRATION.md)

---

## 🚀 Instalasi & Jalankan

### ✅ Prasyarat

- Node.js 16+ & npm
- MySQL 8.0+
- FFmpeg (untuk HLS streaming)

### ✅ 1. Clone Repository

```bash
git clone https://github.com/sccicitb/pertamina-detection.git
cd pertamina-detection
```

---

### ✅ 2. Setup Backend (Node.js + Express)

#### 📦 Install dependencies:

```bash
cd backend-cp
npm install
```

#### 🛠️ Konfigurasi `.env`

```bash
cp .env.example .env
```

Isi dengan konfigurasi:

```env
# Database
DB2_HOST=localhost
DB2_USER=root
DB2_PASSWORD=your_password
DB2_NAME=pertamina_detection
DB2_PORT=3306

# Server
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key-here

# FFmpeg & Streaming
ENABLE_HLS_CONVERSION=true
FFMPEG_PRESET=balanced
```

#### ▶️ Jalankan backend:

```bash
npm start
```

Server berjalan di: [http://localhost:3001](http://localhost:3001)

---

### ✅ 3. Setup Frontend (Next.js)

#### 📦 Install dependencies:

```bash
cd ../frontend
npm install
```

#### 🛠️ Konfigurasi `.env.local`

```bash
cp .env.example .env.local
```

Isi dengan:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### ▶️ Jalankan frontend (dev mode):

```bash
npm run dev
```

Akses dashboard: [http://localhost:3000](http://localhost:3000)

#### 📦 Build untuk production:

```bash
npm run build
npm start
```

---

## 📊 Fitur Utama

✅ **Autentikasi**
- Register, Login, Logout
- Reset Password via Email
- JWT token-based auth

✅ **CCTV Management**
- Tambah, edit, hapus kamera
- Preview RTSP/HLS stream
- Test streaming connection

✅ **Real-time Monitoring**
- CCTV streaming (HLS/RTSP)
- Live status APD violations
- WebSocket notifications

✅ **Analitik & Rekap**
- Deteksi APD real-time
- Statistik harian/mingguan/bulanan
- Grafik trend kepatuhan (>80% akurasi)
- Breakdown pelanggaran per jenis (Safety Vest, Hardhat, Mask)

✅ **Filter & Export**
- Filter by time, location, camera
- Export rekap (PDF, Excel)
- Pagination & search

✅ **Streaming Options**
- HLS (HTTP Live Streaming) - via FFmpeg
- Direct RTSP mode
- Configurable FFmpeg presets (low_latency, balanced, high_quality)

---

## 🎬 HLS Streaming Configuration

### Enable/Disable HLS

File `.env`:
```env
ENABLE_HLS_CONVERSION=true  # Gunakan FFmpeg untuk HLS
# atau
ENABLE_HLS_CONVERSION=false # Direct RTSP only
```

### FFmpeg Presets

| Preset       | CPU Usage | Bandwidth | Latency | Use Case               |
| ------------ | --------- | --------- | ------- | ---------------------- |
| low_latency  | Very Low  | ~100KB/s  | 0.5s    | Mobile, monitoring     |
| balanced     | Low       | ~150KB/s  | 1-2s    | Production (RECOMMENDED) |
| high_quality | Medium    | ~300KB/s  | 2-5s    | Detail viewing, archive |
| copy_stream  | Minimum   | Source    | 2-5s    | No re-encoding         |

---

## 🧪 Testing

Jalankan test suite (jika tersedia):

```bash
cd backend-cp
npm test

cd ../frontend
npm test
```

---

## 🐛 Troubleshooting

### RTSP Stream Tidak Muncul
1. Verifikasi URL RTSP valid dan server hidup
2. Check firewall rules
3. Lihat logs: `tail -f logs/stream.log`

### Database Connection Error
1. Pastikan MySQL running: `mysql -u root -p`
2. Cek credentials di `.env`
3. Buat database: `CREATE DATABASE pertamina_detection;`

### Frontend API Calls Fail
1. Pastikan backend running di port 3001
2. Update `NEXT_PUBLIC_API_URL` di `.env.local`
3. Check browser DevTools → Network tab

---

## 📚 Dokumentasi Lengkap

- [INTEGRATION.md](./INTEGRATION.md) - API integration details
- [AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md) - Authentication flow
- [STREAMING_OPTIMIZATION.md](./STREAMING_OPTIMIZATION.md) - Streaming optimization tips

---

## 👨‍💻 Tim Developer

Proyek dikembangkan oleh:

- **Smart City & Community Innovation Center (SCCIC)** — Institut Teknologi Bandung
- Bekerja sama dengan **Pertamina**

---

## 📝 License

Proprietary - PT Pertamina (Persero)

---

> Untuk kontribusi, pertanyaan, atau melaporkan issue, silakan hubungi tim SCCIC atau open issue di GitHub.

**Last Updated**: December 11, 2025
