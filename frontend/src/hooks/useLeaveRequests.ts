import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveRequestApi } from '@/services/api';
import type { LeaveRequest } from '@/types';

export const leaveRequestKeys = {
  all: ['leaveRequests'] as const,
  lists: () => [...leaveRequestKeys.all, 'list'] as const,
  list: (filters?: any) => [...leaveRequestKeys.lists(), { filters }] as const,
  byStaff: (staffId: number) => [...leaveRequestKeys.all, 'staff', staffId] as const,
};

export function useLeaveRequests() {
  return useQuery({
    queryKey: leaveRequestKeys.lists(),
    queryFn: () => leaveRequestApi.getAll(),
  });
}

export function useLeaveRequestsByStaff(staffId: number) {
  return useQuery({
    queryKey: leaveRequestKeys.byStaff(staffId),
    queryFn: () => leaveRequestApi.getByStaffId(staffId),
    enabled: !!staffId,
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, leaveRequest }: { staffId: number; leaveRequest: LeaveRequest }) =>
      leaveRequestApi.create(staffId, leaveRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveRequestKeys.lists() });
    },
  });
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leaveRequestApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveRequestKeys.lists() });
    },
  });
}

export function useRejectLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      leaveRequestApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveRequestKeys.lists() });
    },
  });
}

export function useDeleteLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leaveRequestApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveRequestKeys.lists() });
    },
  });
}
