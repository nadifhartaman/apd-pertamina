import {getRequest, updateRequest, createRequest, deleteRequest} from "./apiService";

export const authAPI = {
  login: (data) => createRequest("/auth/login", data),
  getUserById: (id) => getRequest(`/auth/user/${id}`),
  uploadUserProfile: (id) => updateRequest(`/auth/user/${id}`),
}

export const vehicles = {
  getAll: (filter = 'day') => getRequest(`/vehicles/getChartMasukKeluar?filter=${filter}`),
  getByArah: (filter = 'day') => getRequest(`/vehicles/getMasukKeluarByArah?filter=${filter}`),
  getByJam: (filter = 'day') => getRequest(`/vehicles/getRataPerJam?filter=${filter}`),
  getByMinute: (filter = 'day') => getRequest(`/vehicles/getRataPer15Menit?filter=${filter}`),
  getByTipe: (filter = 'day') => getRequest(`/vehicles/getGroupTipeKendaraan?filter=${filter}`),
}

export const maps = {
  getAll: () => getRequest("/maps/buildings")
}

export const calendar = {
  getAll: (page, limit) => getRequest(`/holidays?page=${page}&limit=${limit}`)
}