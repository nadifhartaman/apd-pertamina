"use client"
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-lg text-neutral-600 mt-2">Oops! Halaman yang Anda cari tidak tersedia.</p>
      <button onClick={() => (window.location.href = "/")} className="mt-4 px-4 py-2 bg-neutral-800 text-white cursor-pointer rounded-lg">
        Kembali ke Beranda
      </button>
    </div>
  );
}
