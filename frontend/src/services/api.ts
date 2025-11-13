import { Staff, LeaveRequest, Document } from '@/types';

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
