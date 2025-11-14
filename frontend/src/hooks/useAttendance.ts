import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/services/api';

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  byStaff: (staffId: number) => [...attendanceKeys.all, 'staff', staffId] as const,
  today: (staffId: number) => [...attendanceKeys.byStaff(staffId), 'today'] as const,
  monthly: (staffId: number, year: number, month: number) =>
    [...attendanceKeys.byStaff(staffId), 'monthly', year, month] as const,
  pendingApprovals: () => [...attendanceKeys.all, 'pending'] as const,
};

export function useAttendance() {
  return useQuery({
    queryKey: attendanceKeys.lists(),
    queryFn: () => attendanceApi.getAll(),
  });
}

export function useAttendanceByStaff(staffId: number) {
  return useQuery({
    queryKey: attendanceKeys.byStaff(staffId),
    queryFn: () => attendanceApi.getByStaffId(staffId),
    enabled: !!staffId,
  });
}

export function useTodayAttendance(staffId: number) {
  return useQuery({
    queryKey: attendanceKeys.today(staffId),
    queryFn: () => attendanceApi.getTodayAttendance(staffId),
    enabled: !!staffId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMonthlyReport(staffId: number, year: number, month: number) {
  return useQuery({
    queryKey: attendanceKeys.monthly(staffId, year, month),
    queryFn: () => attendanceApi.getMonthlyReport(staffId, year, month),
    enabled: !!staffId && !!year && !!month,
  });
}

export function usePendingApprovals() {
  return useQuery({
    queryKey: attendanceKeys.pendingApprovals(),
    queryFn: () => attendanceApi.getPendingApprovals(),
  });
}

export function useClockIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, location }: { staffId: number; location?: string }) =>
      attendanceApi.clockIn(staffId, location),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today(staffId) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.byStaff(staffId) });
    },
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, location }: { staffId: number; location?: string }) =>
      attendanceApi.clockOut(staffId, location),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today(staffId) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.byStaff(staffId) });
    },
  });
}

export function useStartBreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: number) => attendanceApi.startBreak(staffId),
    onSuccess: (_, staffId) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today(staffId) });
    },
  });
}

export function useEndBreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: number) => attendanceApi.endBreak(staffId),
    onSuccess: (_, staffId) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today(staffId) });
    },
  });
}
