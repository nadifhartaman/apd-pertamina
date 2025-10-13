'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/apiService';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/authContext';
import { fakeToken, fakeUser } from '@/lib/fake';
// import { Eye, EyeOff } from 'lucide-react';

export default function AuthLogin () {
  const router = useRouter();
  const { loading, setLoading, setUserId, login, error } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      router.push('/');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    // Untuk testing dengan fake data
    if (
      email === 'admin' &&
      password === 'password'
    ) {
      login(fakeToken, fakeUser)
      router.push('/');
      return;
    }
    try {
      console.log('Attempting login with:', { email, password });
      const response = await authApi.login({
        email,
        password
      });

      console.log('Login response:', response);

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Token tidak ditemukan di response");
      }
      login(token, user);
      setRedirecting(true);
      setTimeout(() => {
        router.push('/');
      }, 1200);

    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      setErrorMessage(err.response?.data?.message || 'Gagal login. Coba lagi.');
      toast.error("Email atau Password salah", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
          <p className="text-gray-700 font-medium">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex md:flex-row-reverse">
      <div className="hidden md:flex md:flex-1 md:relative">
        <Image
          src="/image/pertamina-workers.jpg"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Sistem Deteksi APD Pertamina</h3>
          <p className="text-lg opacity-90">Memantau performa dan kepatuhan pegawai Pertamina</p>
        </div>
      </div>

      <div className="min-h-[50vh] h-screen flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-green-50">

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image src="/image/pertamina-logo.png" alt="Pertamina Logo" width={200} height={80} className="mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-900">Selamat Datang</h2>
            <p className="mt-2 text-gray-600">Masuk ke sistem monitoring APD Pertamina</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 p-6 border border-gray-200 bg-white/90 shadow-sm backdrop-blur-2xl rounded-lg gap-2 flex flex-col pt-5 pb-5 z-10"
          >
            <div>
              <h4 className="text-2xl font-bold text-gray-900">Login</h4>
              <p className="mt-1 text-sm text-gray-600">Masukkan kredensial Anda untuk mengakses dashboard</p>
            </div>
            <div>
              <label htmlFor="email" className="label">
                <span className="label-text">email</span>
              </label>
              <input
                id="email"
                type="text"
                className="input input-bordered w-full rounded-md"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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

            {errorMessage && (
              <div className="text-red-600 text-sm">{errorMessage}</div>
            )}
            <div className='w-full flex justify-between'>
              <a href='/auth/register' className='text-sm underline'>Register</a>
              <a href='/auth/forgot-password' className='text-sm underline'>Forgot Password</a>
            </div>
            <button
              type="submit"
              className="btn w-full bg-red-600 hover:bg-red-700 border-none text-white"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
