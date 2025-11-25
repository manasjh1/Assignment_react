import axios from 'axios';

const API_BASE_URL = 'https://assignment-e8x8.onrender.com';

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch (refreshError) {
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

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// --- SEARCH INTERFACES ---
export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  total_results: number;
  status: string;
  search_engine: string;
  protocol: string;
  error?: string;
}

// --- IMAGE GENERATION INTERFACES ---
export interface ImageResponse {
  image_url: string;
  prompt: string;
  status: string;
  provider: string;
  error?: string;
}

export const authAPI = {
  register: (data: RegisterData) => 
    api.post<{ message: string; phone_number: string; temp_id: string }>('/auth/register', data),
  
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
  
  refreshToken: () => 
    api.post<AuthResponse>('/auth/refresh'),
};

// --- SEARCH API FUNCTION ---
export const searchAPI = {
  search: (query: string) => 
    api.post<SearchResponse>('/search', { query, max_results: 10 }),
};

// --- IMAGE API FUNCTION ---
export const imageAPI = {
  generate: (prompt: string, model: string = "flux", width: number = 1024, height: number = 1024) =>
    api.post<ImageResponse>('/image/generate', { prompt, model, width, height }),
};

export default api;