import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ... (Keep interceptors.response and other interfaces like RegisterData, LoginData, etc. unchanged) ...

export interface RegisterData {
  email: string;
  password: string;
  phone_number: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOTPData {
  phone_number: string;
  otp_code: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ResetPasswordData {
  phone_number: string;
  otp_code: string;
  new_password: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  created_at?: string;
}

// --- UPDATE THIS INTERFACE ---
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User; // <--- This tells TypeScript that 'data.user' exists!
}

export const authAPI = {
  register: (data: RegisterData) => 
    api.post<{ message: string; phone_number: string; temp_id: string }>('/auth/register', data),
  
  verifyRegistration: (data: VerifyOTPData) => 
    api.post<AuthResponse>('/auth/verify-registration', data), // Updated return type
  
  login: (data: LoginData) => 
    api.post<AuthResponse>('/auth/login', data),
  
  forgotPassword: (phone_number: string) => 
    api.post<{ message: string }>('/auth/forgot-password', { phone_number }),
  
  resetPassword: (data: ResetPasswordData) => 
    api.post<{ message: string }>('/auth/reset-password', data),
  
  logout: () => 
    api.post('/auth/logout'),
  
  refreshToken: () => 
    api.post<AuthResponse>('/auth/refresh'), // Updated return type
};

export default api;