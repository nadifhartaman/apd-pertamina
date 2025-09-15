import { useState, useEffect } from "react";
import { cameraService } from "./../api/apdService";

export const useCameraAPD = () => {
  const [dataCamAPD, setDataCameraAPD] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- helper: pisah location string jadi { lat, long } ---
  const parseLocation = (location) => {
    if (!location) return { lat: "", long: "" };
    const [lat, long] = location.split(",");
    return { lat: lat?.trim() || "", long: long?.trim() || "" };
  };

  // --- helper: gabung { lat, long } jadi string "lat,long" ---
  const formatLocation = (lat, long) => {
    if (!lat || !long) return "";
    return `${lat},${long}`;
  };

  // Fetch Camera APD
  const fetchCamAPD = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);

      const result = await cameraService.getAllCameras(currentPage, limit);

      if (result.success) {
        // map data → pisah location
        const parsed = result.data.map((cam) => ({
          ...cam,
          ...parseLocation(cam.location),
        }));

        setDataCameraAPD(parsed);
        setPagination(result.pagination);
      } else {
        setError(`Gagal memuat data camera: ${result.error}`);
      }
    } catch (err) {
      setError(`Gagal memuat data camera: ${err.message}`);
      console.error("Error fetching dataCamAPD:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create Camera
  const createCamAPD = async (formData) => {
    const location = formatLocation(formData.lat, formData.long);
    return await cameraService.createCamera({ ...formData, location });
  };

  // Update Camera
  const updateCamAPD = async (id, formData) => {
    const location = formatLocation(formData.lat, formData.long);
    return await cameraService.updateCamera(id, { ...formData, location });
  };

  // Delete Camera
  const deleteCamAPD = async (id) => {
    return await cameraService.deleteCamera(id);
  };

  useEffect(() => {
    fetchCamAPD(page);

    // auto-refresh tiap 8 detik
    const interval = setInterval(() => {
      fetchCamAPD(page);
    }, 8000);

    return () => clearInterval(interval);
  }, [page]);

  return {
    dataCamAPD,
    pagination,
    page,
    setPage,
    loading,
    error,
    fetchCamAPD,
    createCamAPD,
    updateCamAPD,
    deleteCamAPD,
  };
};
