/**
 * @fileoverview useAuth Hook - Authentication hook for React components
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { useEffect } from 'react';
import { useAuthStore } from '../services/auth.store';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

/**
 * useAuth hook provides authentication functionality
 * @returns Authentication state and actions
 */
export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    setLoading,
    initialize,
  } = useAuthStore();

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * Login user with credentials
   * @param credentials - Login credentials
   */
  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials);
    } catch (error) {
      // Error is handled in the store
      throw error;
    }
  };

  /**
   * Register new user
   * @param userData - Registration data
   */
  const handleRegister = async (userData: RegisterRequest) => {
    try {
      await register(userData);
    } catch (error) {
      // Error is handled in the store
      throw error;
    }
  };

  /**
   * Logout current user
   */
  const handleLogout = () => {
    logout();
  };

  /**
   * Clear error message
   */
  const handleClearError = () => {
    clearError();
  };

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
