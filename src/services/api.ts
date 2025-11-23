import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        
        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

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
}

export interface ResetPasswordData {
  phone_number: string;
  otp_code: string;
  new_password: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authAPI = {
  register: (data: RegisterData) => 
    api.post<{ message: string }>('/auth/register', data),
  
  verifyRegistration: (data: VerifyOTPData) => 
    api.post<AuthResponse>('/auth/verify-registration', data),
  
  login: (data: LoginData) => 
    api.post<AuthResponse>('/auth/login', data),
  
  forgotPassword: (phone_number: string) => 
    api.post<{ message: string }>('/auth/forgot-password', { phone_number }),
  
  resetPassword: (data: ResetPasswordData) => 
    api.post<{ message: string }>('/auth/reset-password', data),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getCurrentUser: () => 
    api.get<User>('/auth/me'),
  
  refreshToken: () => 
    api.post<{ access_token: string }>('/auth/refresh'),
};

export default api;
