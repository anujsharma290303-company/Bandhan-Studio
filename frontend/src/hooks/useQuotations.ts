import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotationsApi} from '../api/quotations';
import type { CreateQuotationData } from '../api/quotations';

export const useQuotations = (params?: { status?: string; client_id?: string }) =>
  useQuery({
    queryKey: ['quotations', params],
    queryFn:  () => quotationsApi.list(params),
    staleTime: 30_000,
  });

export const useQuotation = (id: string) =>
  useQuery({
    queryKey: ['quotations', id],
    queryFn:  () => quotationsApi.get(id),
    enabled:  !!id,
  });

export const useCreateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuotationData) => quotationsApi.create(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
};

export const useUpdateQuotation = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateQuotationData>) => quotationsApi.update(id, data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
};

export const useFinaliseQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quotationsApi.finalise(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
};
