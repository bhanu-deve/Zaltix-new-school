import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
 IMPORTANT:
 Backend is deployed on PUBLIC SERVER
 Postman works on this IP
 Mobile app MUST use the SAME IP
*/
const api = axios.create({
  baseURL:  'http://192.168.29.126:5000',  // ✅ YOUR SERVER IP
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ===================== REQUEST INTERCEPTOR (JWT) ===================== */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log("Token read error:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your internet connection.';
    } else if (error.message === 'Network Error') {
      error.message = 'Cannot connect to server. Check server IP or internet.';
    } else if (error.response) {
      error.message =
        error.response.data?.error ||
        error.response.data?.message ||
        `Server error (Status: ${error.response.status})`;
    }
    return Promise.reject(error);
  }
);

export default api;
