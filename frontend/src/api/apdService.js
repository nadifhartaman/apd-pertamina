// api/apdService.js
import axios from 'axios';

export const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const cameraService = {
  // Get paginated camera data
  async getAllCameras(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/apd/camera/`, {
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

  // Add new camera
  async createCamera(cameraData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/apd/camera`, cameraData);
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
  async updateCamera(id, cameraData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/apd/camera/${id}`, cameraData);
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
  async deleteCamera(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/apd/camera/${id}`);
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
  // Get paginated APD data
  async getAllApd (page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/apd`, {
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
  // Get today count per hour (optional date)
  async getTodayCountPerHour (date) {
    try {
      const response = await axios.get(`${API_BASE_URL}/apd/today-per-hour`, {
        params: date ? { date } : {}, // kalau ada date → kirim, kalau tidak → kosong (default hari ini di backend)
      });
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
  // Get last record
  async getLastApd () {
    try {
      const response = await axios.get(`${API_BASE_URL}/apd/last`);
      return {
        success: true,
        data: response.data.data || null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};
