import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi } from '@/services/api';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  byStaff: (staffId: number) => [...documentKeys.all, 'staff', staffId] as const,
  detail: (id: number) => [...documentKeys.all, 'detail', id] as const,
};

export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: () => documentApi.getAll(),
  });
}

export function useDocumentsByStaff(staffId: number) {
  return useQuery({
    queryKey: documentKeys.byStaff(staffId),
    queryFn: () => documentApi.getByStaffId(staffId),
    enabled: !!staffId,
  });
}

export function useDocumentById(id: number) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentApi.getById(id),
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, formData }: { staffId: number; formData: FormData }) =>
      documentApi.upload(staffId, formData),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.byStaff(staffId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => documentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
}
