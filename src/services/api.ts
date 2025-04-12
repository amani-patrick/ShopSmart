import axios from 'axios';
import { toast } from 'sonner';
import type { User, AuthResponse, SignupCredentials, UserCredentials } from './auth';

const BASE_URL = 'http://localhost:8080/';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – adds token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handles 401s and other errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Your session has expired. Please login again.');
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

// ------------------------
// 🔐 Auth API Functions
// ------------------------

export const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', credentials);
  const { token, user } = response.data;

  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  const { message } = response.data;
  toast.success(message);
  window.location.href = '/dashboard';
  return { token, user, message };
};

export const signup = async (userData: SignupCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/signup', userData);
  const { token, user } = response.data;

  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return { token, user };
};
