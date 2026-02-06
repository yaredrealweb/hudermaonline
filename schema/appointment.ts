import { z } from "zod";

export const bookAppointmentSchema = z.object({
  availabilityId: z.string(),
  reason: z.string().optional(),
  appointmentType: z.enum(["VIDEO", "IN_PERSON", "CHAT", "VOICE"]),
});

export const confirmAppointmentSchema = z.object({
  appointmentId: z.string(),
});

export const cancelAppointmentSchema = z.object({
  appointmentId: z.string(),
  reason: z.string().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  appointmentId: z.string(),
  newAvailabilityId: z.string(),
});

export const appointmentFilterSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELED", "NO_SHOW", "ALL"])
    .optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});
