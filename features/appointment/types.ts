export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED"
  | "NO_SHOW";

export type AppointmentType = "VIDEO" | "IN_PERSON" | "CHAT" | "VOICE";

export type RescheduleStatus = "REQUESTED" | "APPROVED" | null;

export interface Appointment {
  id: string;
  createdAt: string;
  doctorId: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  reason: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  meetLink: string | null;
  doctorName: string | null;
  doctorSpecialty: string | null;
  patientName: string;
  rescheduleRequestId: string | null;
  rescheduleStatus: RescheduleStatus;
  latestRescheduleStatus: string | null;
}

export interface AppointmentPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetAppointmentsResponse {
  appt: Appointment[];
  pagination: AppointmentPagination;
}
