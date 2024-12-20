import axios from 'axios';

// Base URL configuration
export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Create an axios instance with base configuration
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding authentication token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;