import axios from 'axios';

const api = axios.create({
  // Update this to your backend server address
  // For local development, use your computer's IP address
  baseURL: 'http://192.168.29.126:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors better
api.interceptors.response.use(
  (response) => {
    // Check if response is actually JSON
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      return response;
    }
    // If not JSON, it might be HTML error page
    throw new Error('Server returned non-JSON response. Check if backend is running.');
  },
  (error) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your network connection.';
    } else if (error.message === 'Network Error') {
      error.message = 'Cannot connect to server. Make sure backend is running on http://192.168.29.241:5000';
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      if (error.response.headers['content-type']?.includes('text/html')) {
        error.message = `Server returned HTML instead of JSON (Status: ${status}). Check backend routes.`;
      } else {
        error.message = `Server error (Status: ${status}): ${error.response.data?.error || error.response.data?.message || 'Unknown error'}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
