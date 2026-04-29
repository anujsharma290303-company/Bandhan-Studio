import apiClient from './client';
import type{ ApiResponse } from '../types';
import type{ Client } from './clients';

export type QuotationStatus = 'DRAFT' | 'FINALISED' | 'CONVERTED';
export type DiscountType    = 'PERCENT' | 'FLAT' | 'NONE';
export type TaxType         = 'IGST' | 'CGST_SGST' | 'NONE';

export interface LineItem {
  description: string;
  qty:         number;
  unit:        string;
  rate:        number;
  amount:      number;
}

export interface Quotation {
  id:              string;
  client_id:       string;
  quot_number:     string;
  status:          QuotationStatus;
  subject:         string | null;
  line_items:      LineItem[];
  discount_type:   DiscountType;
  discount_value:  number;
  tax_type:        TaxType;
  tax_rate:        number;
  subtotal:        number;
  discount_amount: number;
  taxable_amount:  number;
  tax_amount:      number;
  grand_total:     number;
  notes:           string | null;
  valid_till:      string | null;
  client?:         Client;
  created_at:      string;
  updated_at:      string;
}

export interface CreateQuotationData {
  client_id:       string;
  subject?:        string;
  line_items:      LineItem[];
  discount_type:   DiscountType;
  discount_value:  number;
  tax_type:        TaxType;
  tax_rate:        number;
  notes?:          string;
  valid_till?:     string;
}

export const quotationsApi = {
  list: async (params?: { status?: string; client_id?: string }): Promise<Quotation[]> => {
    const res = await apiClient.get<ApiResponse<Quotation[]>>('/quotations', { params });
    return res.data.data!;
  },

  get: async (id: string): Promise<Quotation> => {
    const res = await apiClient.get<ApiResponse<Quotation>>(`/quotations/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateQuotationData): Promise<Quotation> => {
    const res = await apiClient.post<ApiResponse<Quotation>>('/quotations', data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<CreateQuotationData>): Promise<Quotation> => {
    const res = await apiClient.put<ApiResponse<Quotation>>(`/quotations/${id}`, data);
    return res.data.data!;
  },

  finalise: async (id: string): Promise<Quotation> => {
    const res = await apiClient.post<ApiResponse<Quotation>>(`/quotations/${id}/finalise`);
    return res.data.data!;
  },
};
