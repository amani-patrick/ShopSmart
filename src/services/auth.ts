/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from './api';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  shopName?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string; // Make message optional
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  shopName?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    const res = await api.post<AuthResponse>('/auth/signup', credentials);
    const { token, user } = res.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    toast.success('Signup successful');
    return { token, user };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Signup failed';
    toast.error(message);
    throw new Error(message);
  }
};

export const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
  try {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = res.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    toast.success('Login successful');
    return { token, user };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
    throw new Error(message);
  }
};


export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
  toast.success('You have been logged out');
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'admin';
};
