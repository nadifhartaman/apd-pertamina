# Integrasi Autentikasi Frontend dan Backend

## Ringkasan

Dokumen ini menjelaskan integrasi sistem autentikasi antara frontend React/Next.js dan backend FastAPI untuk aplikasi Pertamina Detection.

## Endpoint Autentikasi Backend

Backend FastAPI menyediakan endpoint berikut untuk autentikasi:

- **POST /auth/register**: Mendaftarkan pengguna baru
  - Payload: `{"username": string, "email": string, "full_name": string, "password": string, "is_active": boolean}`
  - Response: Data pengguna tanpa password

- **POST /auth/login**: Login pengguna
  - Payload: Form data dengan field `username` dan `password`
  - Response: `{"access_token": string, "token_type": string}`

## Implementasi Frontend

### API Service

File `apiService.js` menyediakan fungsi untuk berkomunikasi dengan backend:

```javascript
export const authApi = {
  // (All Role)
  updateProfile: () => updateRequest(`/auth/profile/`),
  login: (data) => {
    // Menggunakan FormData untuk kompatibilitas dengan OAuth2PasswordRequestForm di FastAPI
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    return axios.post(`${baseURL}/auth/login/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  register: (data) => {
    // Menggunakan JSON untuk endpoint register
    return createRequest(`/auth/register/`, data);
  },
  logout: () => createRequest(`/auth/logout/`),
  // ... other functions
};
```

### Halaman Register

Halaman register (`/auth/register/page.js`) mengumpulkan data pengguna dan mengirimkannya ke backend:

1. Mengumpulkan data: username, email, full_name, password
2. Memvalidasi input (password confirmation, required fields)
3. Mengirim data ke backend melalui `authApi.register()`
4. Setelah registrasi berhasil, melakukan login otomatis
5. Menyimpan token dan mengarahkan ke halaman utama

### Halaman Login

Halaman login (`/auth/login/page.js`) memproses autentikasi pengguna:

1. Mengumpulkan username dan password
2. Mengirim data ke backend melalui `authApi.login()`
3. Menyimpan token dan mengarahkan ke halaman utama

### Context Autentikasi

File `authContext.js` mengelola status autentikasi di seluruh aplikasi:

1. Menyimpan token di cookie browser
2. Mengekstrak informasi pengguna dari token JWT
3. Menyediakan fungsi login dan logout
4. Melindungi rute yang memerlukan autentikasi

## Alur Autentikasi

### Registrasi

1. Pengguna mengisi form registrasi
2. Frontend mengirim data ke endpoint `/auth/register`
3. Backend memvalidasi data dan membuat pengguna baru
4. Frontend menerima respons dan melakukan login otomatis

### Login

1. Pengguna mengisi form login
2. Frontend mengirim data ke endpoint `/auth/login`
3. Backend memvalidasi kredensial dan mengembalikan token JWT
4. Frontend menyimpan token dan mengekstrak informasi pengguna

## Keamanan

- Token JWT digunakan untuk autentikasi
- Token disimpan di cookie browser dengan masa berlaku terbatas
- Password di-hash sebelum disimpan di database
- Validasi input dilakukan di frontend dan backend

## Pengujian

Untuk menguji integrasi autentikasi:

1. Pastikan backend berjalan di `http://localhost:8000`
2. Pastikan frontend berjalan di `http://localhost:3000`
3. Buka halaman register dan buat akun baru
4. Coba login dengan akun yang baru dibuat
5. Verifikasi bahwa pengguna diarahkan ke halaman utama setelah login berhasil