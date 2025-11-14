import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/services/api';
import type { Staff } from '@/types';

export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters?: any) => [...staffKeys.lists(), { filters }] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: number) => [...staffKeys.details(), id] as const,
};

export function useStaff() {
  return useQuery({
    queryKey: staffKeys.lists(),
    queryFn: () => staffApi.getAll(),
  });
}

export function useStaffById(id: number) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staff: Staff) => staffApi.create(staff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staff }: { id: number; staff: Staff }) =>
      staffApi.update(id, staff),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}
