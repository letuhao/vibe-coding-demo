/**
 * @fileoverview API Service - Centralized API communication service
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
  RefreshTokenResponse,
  ApiResponse,
} from '../types/auth.types';

/**
 * API Service handles all HTTP communication with the backend
 * Provides centralized configuration and error handling
 */
class ApiService {
  private api: AxiosInstance;

  /**
   * Constructor for API Service
   * Initializes axios instance with base configuration
   */
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   * Handles token management and error responses
   */
  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken({ refreshToken });
              localStorage.setItem('accessToken', response.accessToken);
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearAuth();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Clear authentication data from localStorage
   */
  private clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * User registration
   * @param data - Registration data
   * @returns Promise with auth response
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
    return response.data;
  }

  /**
   * User login
   * @param data - Login data
   * @returns Promise with auth response
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
    return response.data;
  }

  /**
   * Refresh access token
   * @param data - Refresh token data
   * @returns Promise with new access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response: AxiosResponse<RefreshTokenResponse> = await this.api.post('/auth/refresh', data);
    return response.data;
  }

  /**
   * Get user profile
   * @returns Promise with user profile
   */
  async getProfile(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/auth/profile');
    return response.data;
  }

  /**
   * Generic GET request
   * @param url - Request URL
   * @param params - Query parameters
   * @returns Promise with response data
   */
  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { params });
    return response.data;
  }

  /**
   * Generic POST request
   * @param url - Request URL
   * @param data - Request data
   * @returns Promise with response data
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data);
    return response.data;
  }

  /**
   * Generic PUT request
   * @param url - Request URL
   * @param data - Request data
   * @returns Promise with response data
   */
  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data);
    return response.data;
  }

  /**
   * Generic DELETE request
   * @param url - Request URL
   * @returns Promise with response data
   */
  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url);
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
