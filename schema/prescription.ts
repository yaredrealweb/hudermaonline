import { z } from "zod";

export const createPrescriptionSchema = z.object({
  patientId: z.string().min(1),
  imageUrl: z.string().url().or(z.string().startsWith("/uploads/")),
  title: z.string().max(120).optional().or(z.literal("")),
  note: z.string().max(1000).optional().or(z.literal("")),
});

export const listForDoctorSchema = z.object({
  patientId: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const listForPatientSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const deletePrescriptionSchema = z.object({ id: z.string().min(1) });
