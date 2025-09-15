# 🚧 APD Pertamina

Sistem monitoring dan analitik rekap kepatuhan APD Pertamina.

## 📁 Struktur Proyek

```
.
├── backend/        # API server (Node.js + Express + MySQL Raw Query)
└── frontend/       # Dashboard web (Next.js + Tailwind CSS)
```

---

## ⚙️ Teknologi yang Digunakan

| Layer    | Stack                                          |
| -------- | ---------------------------------------------- |
| Backend  | Node.js, Express, MySQL (Raw Query), Socket.IO |
| Frontend | Next.js (React, App Router), Tailwind CSS      |
| Database | MySQL / MariaDB                                |

---

## 🔄 Integrasi

Frontend berkomunikasi dengan backend melalui REST API berbasis Express.
Socket.IO digunakan untuk komunikasi real-time (contoh: notifikasi & update kamera).

Detail integrasi lebih lanjut bisa dilihat di [INTEGRATION.md](./INTEGRATION.md).

---

## 🚀 Instalasi & Jalankan

### ✅ 1. Clone Repository

```bash
git clone https://github.com/sccicitb/pertamina-detection.git
cd pertamina-detection
```

---

### ✅ 2. Setup Backend (Node.js + Express)

#### 📦 Install dependencies:

```bash
cd backend
npm install
```

#### 🛠️ Konfigurasi `.env`

```bash
cp .env.example .env
```

Isi dengan konfigurasi database:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pertamina_apd
PORT=3001
```

#### ▶️ Jalankan backend:

```bash
npm start
```

Akses backend: [http://localhost:3001](http://localhost:3001)

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

Contoh isi:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### ▶️ Jalankan frontend:

```bash
npm run dev
```

Akses frontend: [http://localhost:3000](http://localhost:3000)

---

## 📊 Fitur Utama

* Autentikasi (Register, Login, Logout, Reset Password via Email)
* CCTV Manager (tambah, edit, hapus, preview)
* Monitoring Real-time (CCTV streaming + status APD)
* Grafik Analitik Rekap Kepatuhan APD (>80% akurasi)
* Filter (waktu, lokasi, kamera)
* Export Rekap (PDF / Excel)
* Dashboard dengan statistik harian/bulanan
* Integrasi Socket.IO untuk notifikasi real-time

---

## 🧪 Testing

Jika tersedia skrip test:

```bash
npm run test
```

---

## 👨‍💻 Developer

Proyek dikembangkan oleh:

* **Smart City & Community Innovation Center (SCCIC)** — Institut Teknologi Bandung
* Bekerja sama dengan **Pertamina**

---

> Untuk kontribusi atau pertanyaan, silakan kontak tim SCCIC atau open issue di GitHub.

---

⚡Pertanyaan: mau aku bikinin juga **contoh struktur folder backend (routes, controllers, db, raw query)** biar README makin jelas, atau cukup high-level kayak di atas?
