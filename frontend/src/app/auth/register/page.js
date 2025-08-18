'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/apiService';
import { useAuth } from '@/contexts/authContext';

export default function AuthRegister() {
  const router = useRouter();
  const { loading, setLoading, login } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      router.push('/');
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setErrorMessage('Username, email, dan password harus diisi.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password dan konfirmasi tidak cocok.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const userData = {
        username,
        email,
        full_name: fullName,
        password,
        is_active: true
      };
      
      const response = await authApi.register(userData);
      
      // Setelah registrasi berhasil, login dengan kredensial yang sama
      console.log('Registration successful, attempting login with:', { username, password });
      const loginResponse = await authApi.login({
        username: username,
        password: password
      });
      
      console.log('Login response after registration:', loginResponse);
      const { access_token } = loginResponse.data;
      
      login(access_token); // simpan token di context
      router.push('/'); // redirect ke dashboard/home
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage(err.response?.data?.detail || 'Gagal registrasi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      <div className="flex-1 relative">
        <Image
          src="/image/pertamina-workers.jpg"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Sistem Monitoring Kendaraan</h3>
          <p className="text-lg opacity-90">Memantau performa dan keamanan armada Pertamina</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/image/pertamina-logo.png"
              alt="Pertamina Logo"
              width={200}
              height={80}
              className="mx-auto mb-8"
            />
            <h2 className="text-3xl font-bold text-gray-900">Selamat Datang</h2>
            <p className="mt-2 text-gray-600">Buat akun baru untuk mengakses sistem</p>
          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-4 p-6 border border-gray-200 bg-white/90 shadow-sm backdrop-blur-2xl rounded-lg"
          >
            <div>
              <h4 className="text-2xl font-bold text-gray-900">Register</h4>
              <p className="mt-1 text-sm text-gray-600">
                Masukkan kredensial baru Anda untuk mengakses dashboard
              </p>
            </div>

            <div>
              <label htmlFor="username" className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                id="username"
                type="text"
                className="input input-bordered w-full rounded-md"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                className="input input-bordered w-full rounded-md"
                placeholder="nama@pertamina.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="fullName" className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                id="fullName"
                type="text"
                className="input input-bordered w-full rounded-md"
                placeholder="Nama Lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative rounded-md">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input input-bordered w-full pr-12"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 h-full px-3 text-sm text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Sembunyi' : 'Lihat'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmpassword" className="label">
                <span className="label-text">Konfirmasi Password</span>
              </label>
              <div className="relative rounded-md">
                <input
                  id="confirmpassword"
                  type={showCPassword ? 'text' : 'password'}
                  className="input input-bordered w-full pr-12"
                  placeholder="Konfirmasi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 h-full px-3 text-sm text-gray-500 cursor-pointer"
                  onClick={() => setShowCPassword(!showCPassword)}
                >
                  {showCPassword ? 'Sembunyi' : 'Lihat'}
                </button>
              </div>
            </div>

            {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}

            <a href="/auth/login" className="text-sm underline">
              Sudah punya akun? Masuk
            </a>

            <button
              type="submit"
              className="btn w-full bg-red-600 hover:bg-red-700 border-none text-white my-2"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
