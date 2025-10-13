import { useState, useEffect } from "react";
import { apdService } from "./../api/apdService";

export const useAPD = () => {
  const [filterType, setFilterType] = useState("today");
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("all");
  const [loadData, setLoadData] = useState(false);
  const [dataApd, setDataApd] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [dailyStats, setDailyStats] = useState({ totalChange: 0, hourly: [] });
  const [summaryViolation, setSummaryViolation] = useState(null);
  const [todayPerHour, setTodayPerHour] = useState([]);
  const [lastRecord, setLastRecord] = useState(null);
  const [dataReportApd, setDataReportApd] = useState([]);
  const [todayPerWeek ,setTodayPerWeek] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  const fetchApd = async () => {
    setLoadData(true);
    setLoading(true);
    const result = await apdService.getAllApd(
      page,
      limit,
      filterType,
      startDate,
      endDate,
      selectedLocationFilter === "all" ? null : selectedLocationFilter
    );
    if (result.success) {
      setDataApd(result.data);
      setPagination(result.pagination);
      setLoadData(false);
    } else {
      setLoadData(false);
    }
    setLoading(false);
  };

  // for export
  const fetchAllApd = async () => {
    setLoading(true);
    const result = await apdService.getAllApd(
      1,
      0,
      filterType,
      startDate,
      endDate,
      selectedLocationFilter === "all" ? null : selectedLocationFilter
    );
    if (result.success) {
      setDataReportApd(result.data);
      setLoadData(false);
    } else {
      setLoadData(false);
    }
    setLoading(false);
  };

  const fetchDailyStats = async () => {
    const result = await apdService.getDailyStats(
      filterType,
      startDate,
      endDate,
      selectedLocationFilter === "all" ? null : selectedLocationFilter
    );
    if (result.success) {
      setDailyStats(result)
    } else {
      setLoadData(false);
    }
  };

  const fetchTodayPerWeek = async () => {
    const result = await apdService.getTodayCountPerWeek(
      filterType,
      startDate,
      endDate,
      selectedLocationFilter === "all" ? null : selectedLocationFilter
    );
    if (result.success) {
      setTodayPerWeek(result.data);
    }
    else {
      setLoadData(false);
    }
  };

  const fetchSummaryViolation = async () => {
    const result = await apdService.getSummaryViolation(
      filterType,
      startDate,
      endDate,
      selectedLocationFilter === "all" ? null : selectedLocationFilter
    );
    if (result.success) {
      setSummaryViolation(result.summary);
    } else {
      setLoadData(false);
    }
  };

  const fetchTodayPerHour = async () => {
    const result = await apdService.getTodayCountPerHour(
      filterType,
      startDate,
      endDate,
      selectedLocationFilter === "all" ? null : selectedLocationFilter
    );
    if (result.success) {
      setTodayPerHour(result.data);
    } else {
      setLoadData(false);
    }
  };

  const fetchLastApd = async () => {
    const result = await apdService.getLastApd(
      filterType,
      startDate,
      endDate,
      selectedLocationFilter === "all" ? null : selectedLocationFilter
    );
    if (result.success) {
      setLastRecord(result.data);
    } else {
      setLoadData(false);
    }
  };

  useEffect(() => {
    fetchApd();
    fetchLastApd();
    fetchTodayPerHour();
    fetchDailyStats();
    fetchSummaryViolation();
    fetchAllApd();
    fetchTodayPerWeek();
    console.log(todayPerWeek)
  }, [page, filterType, startDate, endDate, selectedLocationFilter]);

  return {
    dataApd,
    pagination,
    dailyStats,
    summaryViolation,
    todayPerHour,
    lastRecord,
    page,
    setPage,
    filterType,
    setFilterType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    fetchApd,
    selectedLocationFilter,
    setSelectedLocationFilter,
    fetchAllApd,
    loadData,
    dataReportApd,
    todayPerWeek,
    today
  };
};
