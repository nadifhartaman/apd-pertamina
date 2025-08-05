import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://63.250.52.19:9090/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 70000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(function (config) {
  const token = Cookies.get('token');
  if (token && token !== 'mocked.jwt.token') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Debug logging (remove in production)
  // console.log('API Request:', {
  //   url: config.url,
  //   method: config.method,
  //   data: config.data,
  //   headers: config.headers
  // });

  return config;
}, function (error) {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    // Hanya tampilkan log selain 401
    if (status !== 401) {
      console.error('Response interceptor error:', error);

      // Detailed error logging
      if (error.response) {
        console.error('Error Details:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
          config: error.config
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }

      // Handle 401 Unauthorized
      if (status === 401) {
        Cookies.remove('token');
        Cookies.remove('id_user');

        // if (typeof window !== 'undefined') {
        //   window.location.href = '/auth';
        // }
      }

      // return Promise.reject(error);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;