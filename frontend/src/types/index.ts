// Staff Management Types
export interface Staff {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  hireDate: string;
  dateOfBirth: string;
  annualLeaveDays: number;
  usedLeaveDays: number;
  remainingLeaveDays: number;
  active: boolean;
}

export interface LeaveRequest {
  id?: number;
  staff?: Staff;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  reason: string;
  rejectionReason?: string;
  daysRequested?: number;
  requestDate?: string;
  approvalDate?: string;
}

export enum LeaveType {
  ANNUAL = "ANNUAL",
  SICK = "SICK",
  PERSONAL = "PERSONAL",
  MATERNITY = "MATERNITY",
  PATERNITY = "PATERNITY",
  UNPAID = "UNPAID",
  EMERGENCY = "EMERGENCY"
}

export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}

export interface Document {
  id?: number;
  staff?: Staff;
  documentName: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate?: string;
  uploadedBy: string;
  notes: string;
}

export enum DocumentType {
  CONTRACT = "CONTRACT",
  ID_CARD = "ID_CARD",
  PASSPORT = "PASSPORT",
  RESUME = "RESUME",
  CERTIFICATE = "CERTIFICATE",
  MEDICAL = "MEDICAL",
  TAX_FORM = "TAX_FORM",
  OTHER = "OTHER"
}

// Attendance Types
export interface AttendanceRecord {
  id?: number;
  staff?: Staff;
  date: string;
  clockInTime?: string;
  clockOutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  status: AttendanceStatus;
  totalWorkMinutes?: number;
  overtimeMinutes?: number;
  breakMinutes?: number;
  breakDurationMinutes?: number;
  location?: string;
  clockInLocation?: string;
  clockOutLocation?: string;
  clockInIpAddress?: string;
  clockOutIpAddress?: string;
  notes?: string;
  approved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EARLY_LEAVE = "EARLY_LEAVE",
  OVERTIME = "OVERTIME",
  HALF_DAY = "HALF_DAY",
  ON_BREAK = "ON_BREAK"
}

export enum AttendanceType {
  CLOCK_IN = "CLOCK_IN",
  CLOCK_OUT = "CLOCK_OUT",
  BREAK_START = "BREAK_START",
  BREAK_END = "BREAK_END"
}

export interface MonthlyReport {
  staffId: number;
  year: number;
  month: number;
  totalWorkHours: number;
  totalOvertimeHours: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  workingDays: number;
  records: AttendanceRecord[];
}

// Dashboard Stats Types
export interface DashboardStats {
  totalStaff: number;
  activeStaff: number;
  onLeaveStaff: number;
  staffOnLeaveList: StaffOnLeave[];
  pendingLeaveRequests: number;
  documentCompletionStats: Record<string, number>;
  totalDocumentsRequired: number;
  totalDocumentsUploaded: number;
}

export interface StaffOnLeave {
  staffId: number;
  staffName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  daysUntilReturn: number;
  leaveRequestId: number;
}

export interface StaffDocumentStatus {
  staffId: number;
  staffName: string;
  totalDocuments: number;
  missingDocuments: number;
  missingDocumentTypes: string[];
}
