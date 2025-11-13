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
