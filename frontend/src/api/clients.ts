import apiClient from './client';
import type { ApiResponse } from '../types';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  gstin: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
}

export const clientsApi = {
  list: async (search?: string): Promise<Client[]> => {
    const params = search ? { search } : {};
    const res = await apiClient.get<ApiResponse<Client[]>>('/clients', { params });
    return res.data.data!;
  },

  get: async (id: string): Promise<Client> => {
    const res = await apiClient.get<ApiResponse<Client>>(`/clients/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateClientData): Promise<Client> => {
    const res = await apiClient.post<ApiResponse<Client>>('/clients', data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<CreateClientData>): Promise<Client> => {
    const res = await apiClient.put<ApiResponse<Client>>(`/clients/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};
