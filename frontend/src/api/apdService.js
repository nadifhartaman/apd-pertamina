import api from "./apiInstance";

export const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const cameraService = {
  // Get paginated camera data
  async getAllCameras (page = 1, limit = 10) {
    try {
      const response = await api.get(`${API_BASE_URL}/apd/camera/`, {
        params: { page, limit },
      });
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
  // Get camera by ID
  async getCameraById (id) {
    try {
      const response = await api.get(`${API_BASE_URL}/apd/camera/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Add new camera
  async createCamera (cameraData) {
    try {
      const response = await api.post(`${API_BASE_URL}/apd/camera`, cameraData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Update camera
  async updateCamera (id, cameraData) {
    try {
      const response = await api.put(`${API_BASE_URL}/apd/camera/${id}`, cameraData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Delete camera
  async deleteCamera (id) {
    try {
      const response = await api.delete(`${API_BASE_URL}/apd/camera/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export const apdService = {
  async getAllApd(page = 1, limit = 10, filterType = "today", startDate, endDate, idCamera) {
    try {
      const params = { page, limit, type: filterType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (idCamera) params.id_camera = idCamera;

      const response = await api.get(`${API_BASE_URL}/apd`, {
        params
      });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async getTodayCountPerHour(filterType = "today", startDate, endDate, idCamera) {
    try {
      const params = { type: filterType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (idCamera) params.id_camera = idCamera;

      const response = await api.get(`${API_BASE_URL}/apd/today-per-hour`, {
        params
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async getTodayCountPerWeek(filterType = "today", startDate, endDate, idCamera) {
    try {
      const params = { type: filterType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (idCamera) params.id_camera = idCamera;

      const response = await api.get(`${API_BASE_URL}/apd/count-per-week`, {
        params
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },


  async getDailyStats(filterType = "today", startDate, endDate, idCamera) {
    try {
      // Build params object, excluding null/undefined values
      const params = { type: filterType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (idCamera) params.id_camera = idCamera;

      const response = await api.get(`${API_BASE_URL}/apd/daily-stats`, {
        params
      });
      return {
        success: true,
        hourly: response.data.hourly,
        date: response.data.date,
        totalChange: response.data.totalChange,
        violationSummary: response.data.violationSummary,
      };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async getSummaryViolation(filterType = "today", startDate, endDate, idCamera) {
    try {
      const params = { type: filterType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (idCamera) params.id_camera = idCamera;

      const response = await api.get(`${API_BASE_URL}/apd/summary-violation`, {
        params
      });
      return { success: true, summary: response.data.summary };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async getLastApd(filterType = "today", startDate, endDate, idCamera) {
    try {
      const params = { type: filterType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (idCamera) params.id_camera = idCamera;

      const response = await api.get(`${API_BASE_URL}/apd/last`, {
        params
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};