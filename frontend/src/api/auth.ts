import apiClient from './client';
import type { ApiResponse, AuthResponse, LoginCredentials } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return res.data.data!;
  },

  me: async (): Promise<AuthResponse['user']> => {
    const res = await apiClient.get<ApiResponse<AuthResponse['user']>>(
      '/auth/me'
    );
    return res.data.data!;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};