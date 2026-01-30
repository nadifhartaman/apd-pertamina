import axiosInstance from "./apiClient";
import axios from 'axios';

// const baseURLPertamina = process.env.NEXT_PUBLIC_API_PERTAMINA
//   ? `${process.env.NEXT_PUBLIC_API_PERTAMINA}/api`
//   : 'http://localhost:3001/api';

const baseURLPertamina = `${process.env.NEXT_PUBLIC_API_URL}/api`
// generic func to fetch data
export const apiRequest = async (method, url, data = null) => {
  try {
    const config = { method, url }
    if (data) config.data = data
    // console.log('API Request Config:', config);
    const response = await axiosInstance(config)
    // console.log('API Response:', response.data);
    return response
  }
  catch (error) {
    if (error?.response?.status !== 401) {
      console.error("Failed to fetch data:", error);
    } throw error
  }
}

export const getRequest = (url) => apiRequest('get', url)
export const deleteRequest = (url) => apiRequest('delete', url)
export const updateRequest = (url, data) => apiRequest('put', url, data)
export const createRequest = (url, data) => apiRequest('post', url, data)

export const pertamina = {
  getAllCamera: () => {

    return axios.get(`${baseURLPertamina}/cameras/public`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const authApi = {
  login: (data) => axios.post(`${baseURLPertamina}/auth/login`, data),
  register: (data) => axios.post(`${baseURLPertamina}/auth/register`, data),
  logout: () => createRequest(`/auth/logout/`),
  
  // User Management Endpoints (Admin Only)
  getAllUser: () => getRequest(`/users`),
  createNewUser: (data) => createRequest(`/users`, data),
  updateUser: (id, data) => updateRequest(`/users/${id}`, data),
  getByIdUser: () => getRequest(`/users`),
  deleteByIdUser: (id) => deleteRequest(`/users/${id}`),
  
  // Assign role to user
  addUserRole: (id, data) => createRequest(`/users/${id}/role`, data),
  deleteUserRole: (id, role_id) => deleteRequest(`/users/${id}/role/${role_id}`, { role_id: role_id }),
};

export const apdApi = {
  // Get APD data dengan filter
  getApdData: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters // spread filters (type, startDate, endDate, id_camera, dll)
    });
    return getRequest(`/apd?${params.toString()}`);
  },
  
  // Get APD by ID
  getApdById: (id) => getRequest(`/apd/${id}`),
  
  // Get today APD summary
  getTodayApdSummary: () => getRequest(`/apd/today/summary`),
  
  // Get APD per hour
  getApdPerHour: (date) => getRequest(`/apd/per-hour?date=${date}`),
};