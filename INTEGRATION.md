# Integrasi Frontend dan Backend Pertamina APD Detection

## Konfigurasi

### Backend (FastAPI)

1. **Konfigurasi Lingkungan**
   - File `.env` telah dibuat dengan konfigurasi dasar
   - Database menggunakan SQLite lokal: `sqlite:///./apd_detection.db`
   - Secret key untuk JWT: `pertamina-apd-detection-secret-key`
   - Token JWT berlaku selama 60 menit
   - Server berjalan di `0.0.0.0:8000`

2. **CORS**
   - CORS dikonfigurasi untuk mengizinkan akses dari frontend
   - Origins yang diizinkan: `http://localhost:3000`, `http://127.0.0.1:3000`, `http://localhost:8000`, `http://127.0.0.1:8000`

3. **API Endpoints**
   - Semua endpoint API tersedia di bawah prefix `/api`
   - Autentikasi: `/api/auth`
   - Kamera: `/api/cameras`
   - Kendaraan: `/api/vehicles`
   - Peta: `/api/maps`
   - Kalender: `/api/holidays`
   - Deteksi: `/api/detection`

4. **Socket.IO**
   - Socket.IO tersedia di endpoint `/socket.io`
   - Digunakan untuk komunikasi real-time antara frontend dan backend

### Frontend (React/Next.js)

1. **Konfigurasi Lingkungan**
   - File `.env` telah dibuat dengan konfigurasi dasar
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
   - `NEXT_PUBLIC_MAPTILER_API_KEY=MIHFairYWh2jhZGEMMk7`

2. **API Client**
   - Menggunakan axios untuk komunikasi HTTP dengan backend
   - Base URL: `http://localhost:8000/api`
   - Interceptor untuk menambahkan token JWT ke header Authorization

3. **Socket.IO Client**
   - Menggunakan socket.io-client untuk komunikasi real-time
   - Terhubung ke `http://localhost:8000`

## Menjalankan Aplikasi

### Backend

```bash
cd /path/to/pertamina-detection/backend
python -m uvicorn main:app --reload
```

Backend akan berjalan di `http://localhost:8000`

### Frontend

```bash
cd /path/to/pertamina-detection/frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Autentikasi

1. **Login**
   - Endpoint: `POST /api/auth/login`
   - Request body: `{"username": "user", "password": "password"}`
   - Response: `{"access_token": "jwt_token", "token_type": "bearer"}`

2. **Register**
   - Endpoint: `POST /api/auth/register`
   - Request body: `{"username": "user", "email": "user@example.com", "password": "password"}`

3. **Get Current User**
   - Endpoint: `GET /api/auth/me`
   - Header: `Authorization: Bearer jwt_token`

## Komunikasi Real-time

Frontend dapat berlangganan ke berbagai event Socket.IO yang dipancarkan oleh backend:

1. **Deteksi APD**
   - Event: `apd_detection_result`
   - Data: Hasil deteksi APD dari kamera

2. **Status Kamera**
   - Event: `camera_status_update`
   - Data: Pembaruan status kamera (online/offline)

## Troubleshooting

1. **CORS Error**
   - Pastikan origin frontend terdaftar di konfigurasi CORS backend
   - Periksa apakah frontend mengakses backend dengan URL yang benar

2. **Autentikasi Gagal**
   - Periksa apakah token JWT disimpan dengan benar di cookies
   - Pastikan token belum kedaluwarsa

3. **Socket.IO Tidak Terhubung**
   - Periksa apakah URL Socket.IO di frontend benar
   - Pastikan server Socket.IO di backend berjalan dengan benar