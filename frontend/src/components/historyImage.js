"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ImageHistory = ({ location }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    name: "",
    date: "",
  });
  const router = useRouter();
  function capitalizeText(string) {
    if (!string || typeof string !== "string") return "";
    return string
      .split("_") // Pisahkan berdasarkan underscore
      .map(part =>
        part
          .split(" ") // Pisahkan setiap kata dalam bagian ini
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ") // Gabungkan kembali kata dalam bagian ini
      )
      .join("_"); // Gabungkan kembali bagian dengan underscore
  }
  

  const loadImages = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (filter.name) params.append("name", filter.name);
      if (filter.date) params.append("date", filter.date);
      
      const response = await fetch(`/api/image-history?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Format the data to match the component's expectations
      // The backend returns results in a different structure
     // Fungsi bantuan untuk capitalize string
  
    // Menggunakan fungsi capitalize pada data
    const formattedImages = data.results ? data.results.map(item => ({
      name: capitalizeText(item.name),
      location: capitalizeText(item.location),
      filename: item.filename,
      url: item.path, // Use the path from the API response
      timestamp: item.timestamp,
      date: item.date,
      createdAt: item.timestamp // For compatibility with the existing formatDate function
    })) : [];
      
      setImages(formattedImages);
    } catch (err) {
      console.error("Failed to fetch image history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [location]);

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadImages();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString || 'Unknown date';
    }
  };

  return (
    <div className="bg-base-300 p-5 m-2 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Riwayat Gambar {location ? `- ${location.split('_').slice(2).join(' ')}` : ''}</h2>
      
      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit} className="mb-4">
        <div className="flex flex-wrap gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Nama:</label>
            <input
              type="text"
              name="name"
              value={filter.name}
              onChange={handleFilterChange}
              className="p-2 border rounded"
              placeholder="e.g. nadif"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal:</label>
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              className="p-2 border rounded"
            />
          </div>
          
          <div className="self-end">
            <button
              type="submit"
              className="p-2 bg-blue-500 text-base-300 rounded"
            >
              Filter
            </button>
          </div>
        </div>
      </form>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <p>Loading images...</p>
      ) : images.length === 0 ? (
        <p>Tidak ada gambar ditemukan</p>
      ) : (
        <div>
          <p className="mb-2">Ditemukan {images.length} gambar</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={`${image.filename}-${index}`} className="rounded-lg overflow-hidden bg-base-300 shadow-md">
                <img
                  src={image.url}
                  alt={`${image.name} detection`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.png"; // Fallback image
                    e.target.alt = "Image not available";
                  }}
                />
                <div className="p-3 capitalize">
                  <p className="font-semibold capitalize">Nama: {capitalizeText(image.name)}</p>
                  <p className="text-sm ">Lokasi: {capitalizeText(image.location)}</p>
                  <p className="text-sm capitalize">Tanggal: {image.date || 'N/A'}</p>
                  <p className="text-sm capitalize">Waktu: {formatDate(image.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageHistory;