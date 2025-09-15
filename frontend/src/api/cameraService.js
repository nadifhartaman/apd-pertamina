// api/cameraService.js
import axios from 'axios';

// const API_BASE_URL = 'http://103.30.195.159:3001/api';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_THIRD_CAMERA_URL = process.env.NEXT_PUBLIC_CAMERA_API_URL;

export const cameraService = {
  // Get all cameras
  async getCameras () {
    try {
      const response = await axios.get(`${API_BASE_URL}/cameras`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Create new camera
  async createCamera (cameraData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/cameras`, cameraData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Update camera
  async updateCamera (id, cameraData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/cameras/${id}`, cameraData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Delete camera
  async deleteCamera (id) {
    try {
      await axios.delete(`${API_BASE_URL}/cameras/${id}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export const counting = {
  async getInDaysCount () {
    try {
      const response = await axios.get(`${API_THIRD_CAMERA_URL}/api/get_24hours_crowd_count`);
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message
      }
    }
  },
  async getByCameraCount (start_date, end_date) {
    try {
      let url = `${API_THIRD_CAMERA_URL}/api/get_filter_crowd_count`;
      if (start_date || end_date) {
        url += `?start_date=${start_date}&end_date=${end_date}`;
      }
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }

}