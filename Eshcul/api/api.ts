// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from 'axios';

// /*
//  IMPORTANT:
//  Backend is deployed on PUBLIC SERVER
//  Postman works on this IP
//  Mobile app MUST use the SAME IP
// */
// const api = axios.create({
//   baseURL:  'http://192.168.29.100:5000',  // ✅ YOUR SERVER IP
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// /* ===================== REQUEST INTERCEPTOR (JWT) ===================== */
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const role = await AsyncStorage.getItem("role");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       if (role) {
//         config.headers["x-user-role"] = role; // ✅ ADD THIS
//       }
//     } catch (e) {
//       console.log("Token read error:", e);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ===================== RESPONSE INTERCEPTOR ===================== */
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.code === 'ECONNABORTED') {
//       error.message = 'Request timeout. Please check your internet connection.';
//     } else if (error.message === 'Network Error') {
//       error.message = 'Cannot connect to server. Check server IP or internet.';
//     } else if (error.response) {
//       error.message =
//         error.response.data?.error ||
//         error.response.data?.message ||
//         `Server error (Status: ${error.response.status})`;
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.29.100:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== REQUEST INTERCEPTOR ===================== */
api.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const role = await AsyncStorage.getItem("role");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (role) {
      config.headers["x-user-role"] = role;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR (AUTO REFRESH) ===================== */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          "http://192.168.29.100:5000/student-auth/refresh-token",
          { refreshToken }
        );

        await AsyncStorage.setItem("accessToken", res.data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired → force logout
        await AsyncStorage.multiRemove([
          "accessToken",
          "refreshToken",
          "student",
          "role",
        ]);
        return Promise.reject(refreshError);
      }
    }

    // Other errors
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Check internet.";
    } else if (error.message === "Network Error") {
      error.message = "Cannot connect to server.";
    } else if (error.response) {
      error.message =
        error.response.data?.error ||
        error.response.data?.message ||
        `Server error (${error.response.status})`;
    }

    return Promise.reject(error);
  }
);

export default api;

