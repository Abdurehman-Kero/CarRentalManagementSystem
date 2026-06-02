import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens or logging
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and success responses
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Handle different types of errors
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || 'Bad request - please check your input';
          break;
        case 401:
          if (error.config?.url?.includes('/auth/login')) {
            errorMessage = data.error || data.message || 'Invalid email or password';
          } else {
            errorMessage = 'Unauthorized - please log in again';
            // Clear auth token on 401
            localStorage.removeItem('authToken');
            // Redirect to login page
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
          break;
        case 403:
          errorMessage = 'Forbidden - you do not have permission';
          break;
        case 404:
          errorMessage = data.message || 'Resource not found';
          break;
        case 409:
          errorMessage = data.message || 'Conflict - resource already exists';
          break;
        case 422:
          errorMessage = data.message || 'Validation error';
          break;
        case 500:
          errorMessage = 'Server error - please try again later';
          break;
        default:
          errorMessage = data.message || `Error ${status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      // Network error or no response
      errorMessage = 'Network error - please check your connection';
    } else {
      // Request setup error
      errorMessage = error.message || 'Request configuration error';
    }
    
    // Show error toast notification, but skip for login errors so we can handle them inline
    if (!error.config?.url?.includes('/auth/login')) {
      toast.error(errorMessage);
    }
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', error);
    }
    
    // Return structured error object
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error
    });
  }
);

// Helper functions for common API operations
export const apiHelpers = {
  // GET request with loading state
  async get(url, options = {}) {
    try {
      const response = await api.get(url, options);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    }
  },

  // POST request with loading state
  async post(url, data, options = {}) {
    try {
      const response = await api.post(url, data, options);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    }
  },

  // PUT request with loading state
  async put(url, data, options = {}) {
    try {
      const response = await api.put(url, data, options);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    }
  },

  // DELETE request with loading state
  async delete(url, options = {}) {
    try {
      const response = await api.delete(url, options);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Upload file with progress
  async uploadFile(url, file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        };
      }
      
      const response = await api.post(url, formData, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    }
  }
};

export default api;