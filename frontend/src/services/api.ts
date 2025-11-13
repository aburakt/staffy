import { Staff, LeaveRequest, Document, AttendanceRecord, MonthlyReport, DashboardStats, StaffDocumentStatus } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';

// Staff API
export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    const response = await fetch(`${API_BASE_URL}/staff`);
    if (!response.ok) throw new Error('Failed to fetch staff');
    return response.json();
  },

  getById: async (id: number): Promise<Staff> => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`);
    if (!response.ok) throw new Error('Failed to fetch staff');
    return response.json();
  },

  create: async (staff: Staff): Promise<Staff> => {
    const response = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff),
    });
    if (!response.ok) throw new Error('Failed to create staff');
    return response.json();
  },

  update: async (id: number, staff: Staff): Promise<Staff> => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff),
    });
    if (!response.ok) throw new Error('Failed to update staff');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete staff');
  },
};

// Leave Request API
export const leaveRequestApi = {
  getAll: async (): Promise<LeaveRequest[]> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests`);
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    return response.json();
  },

  getByStaffId: async (staffId: number): Promise<LeaveRequest[]> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/staff/${staffId}`);
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    return response.json();
  },

  create: async (staffId: number, leaveRequest: LeaveRequest): Promise<LeaveRequest> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/staff/${staffId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveRequest),
    });
    if (!response.ok) throw new Error('Failed to create leave request');
    return response.json();
  },

  approve: async (id: number): Promise<LeaveRequest> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}/approve`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to approve leave request');
    return response.json();
  },

  reject: async (id: number, reason: string): Promise<LeaveRequest> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error('Failed to reject leave request');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete leave request');
  },
};

// Document API
export const documentApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  getByStaffId: async (staffId: number): Promise<Document[]> => {
    const response = await fetch(`${API_BASE_URL}/documents/staff/${staffId}`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  create: async (staffId: number, document: Document): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/staff/${staffId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document),
    });
    if (!response.ok) throw new Error('Failed to create document');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete document');
  },
};

// Attendance API
export const attendanceApi = {
  getAll: async (): Promise<AttendanceRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/attendance`);
    if (!response.ok) throw new Error('Failed to fetch attendance records');
    return response.json();
  },

  getById: async (id: number): Promise<AttendanceRecord> => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`);
    if (!response.ok) throw new Error('Failed to fetch attendance record');
    return response.json();
  },

  getByStaffId: async (staffId: number): Promise<AttendanceRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/attendance/staff/${staffId}`);
    if (!response.ok) throw new Error('Failed to fetch staff attendance');
    return response.json();
  },

  getTodayAttendance: async (staffId: number): Promise<AttendanceRecord | null> => {
    const response = await fetch(`${API_BASE_URL}/attendance/staff/${staffId}/today`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch today attendance');
    return response.json();
  },

  getByDateRange: async (staffId: number, startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
    const response = await fetch(
      `${API_BASE_URL}/attendance/staff/${staffId}/range?startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) throw new Error('Failed to fetch attendance range');
    return response.json();
  },

  clockIn: async (staffId: number, location?: string): Promise<AttendanceRecord> => {
    const response = await fetch(`${API_BASE_URL}/attendance/staff/${staffId}/clock-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: location || 'Web App' }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to clock in');
    }
    return response.json();
  },

  clockOut: async (staffId: number, location?: string): Promise<AttendanceRecord> => {
    const response = await fetch(`${API_BASE_URL}/attendance/staff/${staffId}/clock-out`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: location || 'Web App' }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to clock out');
    }
    return response.json();
  },

  startBreak: async (staffId: number): Promise<AttendanceRecord> => {
    const response = await fetch(`${API_BASE_URL}/attendance/staff/${staffId}/break-start`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to start break');
    return response.json();
  },

  endBreak: async (staffId: number): Promise<AttendanceRecord> => {
    const response = await fetch(`${API_BASE_URL}/attendance/staff/${staffId}/break-end`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to end break');
    return response.json();
  },

  approve: async (id: number, approver: string): Promise<AttendanceRecord> => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approver }),
    });
    if (!response.ok) throw new Error('Failed to approve attendance');
    return response.json();
  },

  update: async (id: number, attendance: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendance),
    });
    if (!response.ok) throw new Error('Failed to update attendance');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete attendance');
  },

  getMonthlyReport: async (staffId: number, year: number, month: number): Promise<MonthlyReport> => {
    const response = await fetch(
      `${API_BASE_URL}/attendance/staff/${staffId}/monthly-report?year=${year}&month=${month}`
    );
    if (!response.ok) throw new Error('Failed to fetch monthly report');
    return response.json();
  },

  getPendingApprovals: async (): Promise<AttendanceRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/attendance/pending-approvals`);
    if (!response.ok) throw new Error('Failed to fetch pending approvals');
    return response.json();
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  getDocumentCompletion: async (): Promise<StaffDocumentStatus[]> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/document-completion`);
    if (!response.ok) throw new Error('Failed to fetch document completion');
    return response.json();
  },
};

// Certificate API
export const certificateApi = {
  downloadLeaveCertificate: async (leaveRequestId: number): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${leaveRequestId}/certificate`);
    if (!response.ok) throw new Error('Failed to download certificate');
    return response.blob();
  },
};
