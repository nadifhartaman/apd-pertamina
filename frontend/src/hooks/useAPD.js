// hooks/useAPD.js
import { useState, useEffect } from "react";
import { apdService, today } from "./../api/apdService";

export const useAPD = () => {
  const [dataApd, setDataApd] = useState([]);
  const [lastRecord, setLastRecord] = useState(null);
  const [todayPerHour, setTodayPerHour] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [dailyStats, setDailyStats] = useState({ total: 0, hourly: [] });
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch APD data
  const fetchApd = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apdService.getAllApd(currentPage, limit);

      if (result.success) {
        setDataApd(result.data);
        setPagination(result.pagination);
      } else {
        setError(`Gagal memuat data APD: ${result.error}`);
      }
    } catch (err) {
      setError(`Gagal memuat data APD: ${err.message}`);
      console.error("Error fetching dataApd:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch last record
  const fetchLastApd = async () => {
    try {
      const result = await apdService.getLastApd();
      if (result.success) {
        setLastRecord(result.data);
      } else {
        console.error("Gagal ambil last record:", result.error);
      }
    } catch (err) {
      console.error("Error fetching last record:", err);
    }
  };

  const fetchDailyStats = async () => {
    try {
      const result = await apdService.getDailyStats(today);
      if (result.success) {
        setDailyStats({
          hourly: result.hourly,
          // yesterday: result.yesterday,
          totalChange: result.totalChange,
          violationSummary: result.violationSummary,
        });
      } else {
        console.error("Gagal ambil daily stats:", result.error);
      }
    } catch (err) {
      console.error("Error fetching daily stats:", err);
    }
  };


  // Fetch today per hour
  const fetchTodayPerHour = async () => {
    try {
      // (YYYY-MM-DD)
      // const today = new Date().toISOString().slice(0, 10);
      const result = await apdService.getTodayCountPerHour(today);
      if (result.success) {
        setTodayPerHour(result.data);
      } else {
        console.error("Gagal ambil data grafik:", result.error);
      }
    } catch (err) {
      console.error("Error fetching today per hour:", err);
    }
  };

  useEffect(() => {
    // saat page berubah
    fetchApd(page);
    fetchLastApd();
    fetchTodayPerHour();
    fetchDailyStats();

    // auto-refresh 8 detik
    const interval = setInterval(() => {
      fetchApd(page);
      fetchLastApd();
      fetchTodayPerHour();
      fetchDailyStats();
    }, 8000);

    // clear interval
    return () => clearInterval(interval);
  }, [page]);

  return {
    dataApd,
    lastRecord,
    todayPerHour,
    pagination,
    page,
    setPage,
    loading,
    error,
    fetchApd,
    dailyStats,
    fetchDailyStats,
    fetchLastApd,
    fetchTodayPerHour,
  };
};
