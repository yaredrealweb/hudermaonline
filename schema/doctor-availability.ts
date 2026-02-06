import z from "zod";

export const listAvailabilitySchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  doctorId: z.string().optional(),
  isBooked: z.boolean().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  search: z.string().optional(),
});

export const createTimeOffSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  reason: z.string().optional(),
});
