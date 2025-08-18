# Pertamina APD Detection Backend

Backend API untuk sistem deteksi Alat Pelindung Diri (APD) Pertamina menggunakan FastAPI.

## Fitur

- Autentikasi dan manajemen pengguna
- Manajemen kamera dan status kamera
- Deteksi APD (helm, rompi, sarung tangan, sepatu)
- Statistik deteksi dan pelanggaran
- Manajemen kendaraan dan statistik
- Manajemen peta dan bangunan
- Manajemen kalender dan hari libur
- Komunikasi real-time menggunakan Socket.IO

## Persyaratan

- Python 3.8+
- PostgreSQL (atau database lain yang didukung SQLAlchemy)
- Dependensi lain (lihat requirements.txt)

## Instalasi

1. Clone repositori ini

```bash
git clone <repository-url>
cd pertamina-detection/backend
```

2. Buat dan aktifkan virtual environment

```bash
python -m venv venv
source venv/bin/activate  # Untuk Linux/Mac
# atau
venv\Scripts\activate  # Untuk Windows
```

3. Instal dependensi

```bash
pip install -r requirements.txt
```

4. Salin file .env.example ke .env dan sesuaikan konfigurasi

```bash
cp .env.example .env
# Edit file .env sesuai kebutuhan
```

5. Jalankan aplikasi

```bash
python main.py
```

Atau dengan uvicorn:

```bash
uvicorn main:app --reload
```

## Struktur Proyek

```
backend/
├── app/
│   ├── database/       # Konfigurasi database
│   ├── models/         # Model SQLAlchemy
│   ├── routers/        # Router API
│   ├── schemas/        # Skema Pydantic
│   ├── services/       # Layanan bisnis
│   ├── socket/         # Konfigurasi Socket.IO
│   └── utils/          # Utilitas
├── uploads/            # Direktori upload gambar
├── .env                # Konfigurasi lingkungan
├── .env.example        # Contoh konfigurasi lingkungan
├── main.py             # Entrypoint aplikasi
└── requirements.txt    # Dependensi Python
```

## API Endpoints

### Autentikasi

- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/register` - Registrasi pengguna baru
- `GET /api/auth/me` - Mendapatkan informasi pengguna saat ini

### Kamera

- `GET /api/cameras/` - Mendapatkan semua kamera
- `GET /api/cameras/{camera_id}` - Mendapatkan kamera berdasarkan ID
- `POST /api/cameras/` - Membuat kamera baru
- `PUT /api/cameras/{camera_id}` - Memperbarui kamera
- `DELETE /api/cameras/{camera_id}` - Menghapus kamera
- `GET /api/cameras/{camera_id}/status-log` - Mendapatkan log status kamera
- `GET /api/cameras/{camera_id}/detections` - Mendapatkan deteksi dari kamera

### Deteksi

- `POST /api/detection/process-image` - Memproses gambar untuk deteksi APD
- `GET /api/detection/statistics` - Mendapatkan statistik deteksi

### Kendaraan

- `GET /api/vehicles/getChartMasukKeluar` - Mendapatkan data grafik masuk keluar
- `GET /api/vehicles/getMasukKeluarByArah` - Mendapatkan data masuk keluar berdasarkan arah
- `GET /api/vehicles/getRataPerJam` - Mendapatkan data rata-rata per jam
- `GET /api/vehicles/getRataPer15Menit` - Mendapatkan data rata-rata per 15 menit
- `GET /api/vehicles/getGroupTipeKendaraan` - Mendapatkan data berdasarkan tipe kendaraan

### Peta

- `GET /api/maps/buildings` - Mendapatkan semua bangunan
- `GET /api/maps/buildings-full` - Mendapatkan semua bangunan dengan detail lengkap
- `GET /api/maps/buildings/{building_id}` - Mendapatkan bangunan berdasarkan ID
- `POST /api/maps/buildings` - Membuat bangunan baru
- `PUT /api/maps/buildings/{building_id}` - Memperbarui bangunan
- `DELETE /api/maps/buildings/{building_id}` - Menghapus bangunan

### Kalender

- `GET /api/holidays/` - Mendapatkan semua hari libur
- `GET /api/holidays/{holiday_id}` - Mendapatkan hari libur berdasarkan ID
- `POST /api/holidays/` - Membuat hari libur baru
- `PUT /api/holidays/{holiday_id}` - Memperbarui hari libur
- `DELETE /api/holidays/{holiday_id}` - Menghapus hari libur
- `POST /api/holidays/import` - Mengimpor hari libur dari file Excel

## Socket.IO Events

- `connect` - Koneksi klien
- `disconnect` - Pemutusan koneksi klien
- `subscribe_camera` - Berlangganan ke kamera tertentu
- `result_detection_2` - Hasil deteksi untuk kamera tertentu
- `detection_broadcast` - Broadcast hasil deteksi ke semua klien

## Lisensi

Hak Cipta © 2023 Pertamina