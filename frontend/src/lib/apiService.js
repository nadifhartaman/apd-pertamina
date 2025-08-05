import axiosInstance from "./apiClient";

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

export const authApi = {
  // (All Role)
  updateProfile: () => updateRequest(`/auth/profile/`),
  login: (data) => {
    // console.log('Login data being sent:', data); // Debug log
    return createRequest(`/auth/login/`, data);
  },
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
}

export const maps = {
  getAll: () => getRequest(`/maps/buildings`),
  getAllFull: () => getRequest(`/maps/buildings-full`),
  getById: (id) => getRequest(`/simpang/${id}`),
  getAllSimpang: () => getRequest(`/simpang`),
  updateById: (id, data) => updateRequest(`/simpang/${id}`, data),
  createData: (data) => createRequest(`/simpang`, data),
  deleteById: (id) => deleteRequest(`/simpang/${id}`)
}

export const cameras = {
  getAll: () => getRequest(`/cameras/`),
  updateById: (id, data) => updateRequest(`/cameras/${id}`, data),
  createData: (data) => createRequest(`/cameras`, data),
  deleteById: (id) => deleteRequest(`/cameras/${id}`)

}

export const calendar = {
  getAll: (page, limit) => getRequest(`/holidays?page=${page}&limit=${limit}`),
  // Upload Excel FormData
  uploadFile: (file, mode = 'append') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    return axiosInstance.post('/holidays/import', formData);
  },
  createData: (data) => createRequest(`/holidays`, data),
  updateById: (id, data) => updateRequest(`/holidays/${id}`, data),
  deleteById: (id) => deleteRequest(`/holidays/${id}`)
};

export const logCamera = {
  getById: (id) => getRequest(`/cameras/${id}/status-log`)
}

export const survey = {
  //daillyRange, dailyMonth, monthly, yearly
  getAll: (camera_id, date, interval, approach, classification, reportType, direction, month, year, startDate, endDate) => {
    // let params = [`camera_id=${camera_id}`, `date=${date}`];
    let params = [`simpang_id=${camera_id}`, `date=${date}`];

    if (interval) params.push(`interval=${interval}`);
    if (approach) params.push(`approach=${approach}`);
    if (direction) params.push(`direction=${direction}`);
    if (classification) params.push(`classification=${classification}`);
    if (reportType) params.push(`reportType=${reportType}`);
    if (reportType === 'dailyRange' && startDate && endDate) {
      params.push(`startDate=${startDate}`);
      params.push(`endDate=${endDate}`);
    }
    if (reportType === 'dailyMonth' && month && year) {
      params.push(`month=${month}`);
      params.push(`year=${year}`);
    }
    if (reportType === 'monthly' && year) {
      params.push(`year=${year}`);
    }
    if (reportType === 'yearly' && startDate) {
      params.push(`startDate=${startDate}`);
    }

    return getRequest(`/surveys/data-summary?${params.join('&')}`);
  },

  getAllKM: (simpang_id, date, interval, approach) => {
    // let params = [`simpang_id=${simpang_id}`, `date=${date}`];
    let params = [`simpang_id=${simpang_id}`, `date=${date}`];

    if (interval) params.push(`interval=${interval}`);
    if (approach) params.push(`approach=${approach}`);

    return getRequest(`/surveys/km-tabel?${params.join('&')}`);
  },
  getProporsi: (simpang_id, type, date) => getRequest(`/survey-proporsi?ID_Simpang=${simpang_id}${type ? '&type=' + type + '' : ''}&date=${date}`)
}
