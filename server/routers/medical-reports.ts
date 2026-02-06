import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  labReport,
  medicalHistory,
  medication,
  medicationProgress,
  doctorPatient,
} from "@/drizzle/schema";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

// Schemas
const createLabReportSchema = z.object({
  patientId: z.string(),
  name: z.string().min(1),
  date: z.string().transform((str) => new Date(str)),
  status: z.enum(["normal", "abnormal", "critical"]).default("normal"),
  notes: z.string().optional(),
  fileUrl: z.string().optional(),
});

const updateLabReportSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  status: z.enum(["normal", "abnormal", "critical"]).optional(),
  notes: z.string().optional(),
  fileUrl: z.string().optional(),
});

const deleteLabReportSchema = z.object({
  id: z.string(),
});

const listLabReportsSchema = z.object({
  patientId: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

const createMedicalHistorySchema = z.object({
  patientId: z.string(),
  condition: z.string().min(1),
  status: z.enum(["ongoing", "resolved", "seasonal"]).default("ongoing"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  notes: z.string().optional(),
});

const updateMedicalHistorySchema = z.object({
  id: z.string(),
  condition: z.string().min(1).optional(),
  status: z.enum(["ongoing", "resolved", "seasonal"]).optional(),
  startDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  notes: z.string().optional(),
});

const deleteMedicalHistorySchema = z.object({
  id: z.string(),
});

const listMedicalHistorySchema = z.object({
  patientId: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

const createMedicationSchema = z.object({
  patientId: z.string(),
  name: z.string().min(1),
  dosage: z.string().min(1),
  reason: z.string().min(1),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  adherence: z.number().min(0).max(100).default(0),
  sideEffects: z.string().optional(),
  effectivenessRating: z.number().min(0).max(5).default(0),
  notes: z.string().optional(),
});

const updateMedicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  reason: z.string().min(1).optional(),
  startDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  adherence: z.number().min(0).max(100).optional(),
  sideEffects: z.string().optional(),
  effectivenessRating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
});

const deleteMedicationSchema = z.object({
  id: z.string(),
});

const listMedicationsSchema = z.object({
  patientId: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

const createMedicationProgressSchema = z.object({
  medicationId: z.string(),
  date: z.string().transform((str) => new Date(str)),
  note: z.string().min(1),
});

const listMedicationProgressSchema = z.object({
  medicationId: z.string(),
});

export const medicalReportsRouter = router({
  // Lab Reports
  createLabReport: protectedProcedure
    .input(createLabReportSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can create lab reports",
        });
      }

      // Check if patient is linked to doctor
      const link = await db.query.doctorPatient.findFirst({
        where: (dp, { and, eq }) =>
          and(eq(dp.doctorId, ctx.user.id), eq(dp.patientId, input.patientId)),
      });

      if (!link) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Patient is not linked to this doctor",
        });
      }

      const id = crypto.randomUUID();
      const [created] = await db
        .insert(labReport)
        .values({
          id,
          doctorId: ctx.user.id,
          patientId: input.patientId,
          name: input.name,
          date: input.date,
          status: input.status,
          notes: input.notes,
          fileUrl: input.fileUrl,
        })
        .returning();

      return created;
    }),

  updateLabReport: protectedProcedure
    .input(updateLabReportSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can update lab reports",
        });
      }

      const existing = await db.query.labReport.findFirst({
        where: (lr, { eq, and }) =>
          and(eq(lr.id, input.id), eq(lr.doctorId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lab report not found",
        });
      }

      const [updated] = await db
        .update(labReport)
        .set({
          ...(input.name && { name: input.name }),
          ...(input.date && { date: input.date }),
          ...(input.status && { status: input.status }),
          ...(input.notes !== undefined && { notes: input.notes }),
          ...(input.fileUrl !== undefined && { fileUrl: input.fileUrl }),
          updatedAt: new Date(),
        })
        .where(eq(labReport.id, input.id))
        .returning();

      return updated;
    }),

  deleteLabReport: protectedProcedure
    .input(deleteLabReportSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can delete lab reports",
        });
      }

      const existing = await db.query.labReport.findFirst({
        where: (lr, { eq, and }) =>
          and(eq(lr.id, input.id), eq(lr.doctorId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lab report not found",
        });
      }

      await db
        .update(labReport)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(labReport.id, input.id));

      return { success: true };
    }),

  listLabReports: protectedProcedure
    .input(listLabReportsSchema)
    .query(async ({ ctx, input }) => {
      let where = [isNull(labReport.deletedAt)];

      if (ctx.user.role === "PATIENT") {
        where.push(eq(labReport.patientId, ctx.user.id));
      } else if (ctx.user.role === "DOCTOR") {
        if (input.patientId) {
          // Check if patient is linked to doctor
          const link = await db.query.doctorPatient.findFirst({
            where: (dp, { and, eq }) =>
              and(
                eq(dp.doctorId, ctx.user.id),
                eq(dp.patientId, input.patientId!)
              ),
          });

          if (!link) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Patient is not linked to this doctor",
            });
          }
          where.push(eq(labReport.patientId, input.patientId!));
        } else {
          where.push(eq(labReport.doctorId, ctx.user.id));
        }
      }

      const totalRes = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(labReport)
        .where(and(...where));
      const total = totalRes[0]?.count ?? 0;

      const items = await db
        .select()
        .from(labReport)
        .where(and(...where))
        .orderBy(desc(labReport.createdAt))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      return {
        items,
        pagination: {
          total,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.ceil(total / input.pageSize),
        },
      };
    }),

  // Medical History
  createMedicalHistory: protectedProcedure
    .input(createMedicalHistorySchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can create medical history entries",
        });
      }

      const link = await db.query.doctorPatient.findFirst({
        where: (dp, { and, eq }) =>
          and(eq(dp.doctorId, ctx.user.id), eq(dp.patientId, input.patientId)),
      });

      if (!link) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Patient is not linked to this doctor",
        });
      }

      const id = crypto.randomUUID();
      const [created] = await db
        .insert(medicalHistory)
        .values({
          id,
          doctorId: ctx.user.id,
          patientId: input.patientId,
          condition: input.condition,
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
          notes: input.notes,
        })
        .returning();

      return created;
    }),

  updateMedicalHistory: protectedProcedure
    .input(updateMedicalHistorySchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can update medical history entries",
        });
      }

      const existing = await db.query.medicalHistory.findFirst({
        where: (mh, { eq, and }) =>
          and(eq(mh.id, input.id), eq(mh.doctorId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medical history entry not found",
        });
      }

      const [updated] = await db
        .update(medicalHistory)
        .set({
          ...(input.condition && { condition: input.condition }),
          ...(input.status && { status: input.status }),
          ...(input.startDate && { startDate: input.startDate }),
          ...(input.endDate !== undefined && { endDate: input.endDate }),
          ...(input.notes !== undefined && { notes: input.notes }),
          updatedAt: new Date(),
        })
        .where(eq(medicalHistory.id, input.id))
        .returning();

      return updated;
    }),

  deleteMedicalHistory: protectedProcedure
    .input(deleteMedicalHistorySchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can delete medical history entries",
        });
      }

      const existing = await db.query.medicalHistory.findFirst({
        where: (mh, { eq, and }) =>
          and(eq(mh.id, input.id), eq(mh.doctorId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medical history entry not found",
        });
      }

      await db
        .update(medicalHistory)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(medicalHistory.id, input.id));

      return { success: true };
    }),

  listMedicalHistory: protectedProcedure
    .input(listMedicalHistorySchema)
    .query(async ({ ctx, input }) => {
      let where = [isNull(medicalHistory.deletedAt)];

      if (ctx.user.role === "PATIENT") {
        where.push(eq(medicalHistory.patientId, ctx.user.id));
      } else if (ctx.user.role === "DOCTOR") {
        if (input.patientId) {
          const link = await db.query.doctorPatient.findFirst({
            where: (dp, { and, eq }) =>
              and(
                eq(dp.doctorId, ctx.user.id),
                eq(dp.patientId, input.patientId as string)
              ),
          });

          if (!link) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Patient is not linked to this doctor",
            });
          }
          where.push(eq(medicalHistory.patientId, input.patientId as string));
        } else {
          where.push(eq(medicalHistory.doctorId, ctx.user.id));
        }
      }

      const totalRes = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(medicalHistory)
        .where(and(...where));
      const total = totalRes[0]?.count ?? 0;

      const items = await db
        .select()
        .from(medicalHistory)
        .where(and(...where))
        .orderBy(desc(medicalHistory.createdAt))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      return {
        items,
        pagination: {
          total,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.ceil(total / input.pageSize),
        },
      };
    }),

  // Medications
  createMedication: protectedProcedure
    .input(createMedicationSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can create medications",
        });
      }

      const link = await db.query.doctorPatient.findFirst({
        where: (dp, { and, eq }) =>
          and(eq(dp.doctorId, ctx.user.id), eq(dp.patientId, input.patientId)),
      });

      if (!link) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Patient is not linked to this doctor",
        });
      }

      const id = crypto.randomUUID();
      const [created] = await db
        .insert(medication)
        .values({
          id,
          doctorId: ctx.user.id,
          patientId: input.patientId,
          name: input.name,
          dosage: input.dosage,
          reason: input.reason,
          startDate: input.startDate,
          endDate: input.endDate,
          adherence: input.adherence,
          sideEffects: input.sideEffects,
          effectivenessRating: input.effectivenessRating,
          notes: input.notes,
        })
        .returning();

      return created;
    }),

  updateMedication: protectedProcedure
    .input(updateMedicationSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can update medications",
        });
      }

      const existing = await db.query.medication.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.id, input.id), eq(m.doctorId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medication not found",
        });
      }

      const [updated] = await db
        .update(medication)
        .set({
          ...(input.name && { name: input.name }),
          ...(input.dosage && { dosage: input.dosage }),
          ...(input.reason && { reason: input.reason }),
          ...(input.startDate && { startDate: input.startDate }),
          ...(input.endDate !== undefined && { endDate: input.endDate }),
          ...(input.adherence !== undefined && { adherence: input.adherence }),
          ...(input.sideEffects !== undefined && {
            sideEffects: input.sideEffects,
          }),
          ...(input.effectivenessRating !== undefined && {
            effectivenessRating: input.effectivenessRating,
          }),
          ...(input.notes !== undefined && { notes: input.notes }),
          updatedAt: new Date(),
        })
        .where(eq(medication.id, input.id))
        .returning();

      return updated;
    }),

  deleteMedication: protectedProcedure
    .input(deleteMedicationSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can delete medications",
        });
      }

      const existing = await db.query.medication.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.id, input.id), eq(m.doctorId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medication not found",
        });
      }

      await db
        .update(medication)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(medication.id, input.id));

      return { success: true };
    }),

  listMedications: protectedProcedure
    .input(listMedicationsSchema)
    .query(async ({ ctx, input }) => {
      let where = [isNull(medication.deletedAt)];

      if (ctx.user.role === "PATIENT") {
        where.push(eq(medication.patientId, ctx.user.id));
      } else if (ctx.user.role === "DOCTOR") {
        if (input.patientId) {
          const link = await db.query.doctorPatient.findFirst({
            where: (dp, { and, eq }) =>
              and(
                eq(dp.doctorId, ctx.user.id),
                eq(dp.patientId, input.patientId as string)
              ),
          });

          if (!link) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Patient is not linked to this doctor",
            });
          }
          where.push(eq(medication.patientId, input.patientId as string));
        } else {
          where.push(eq(medication.doctorId, ctx.user.id));
        }
      }

      const totalRes = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(medication)
        .where(and(...where));
      const total = totalRes[0]?.count ?? 0;

      const items = await db
        .select()
        .from(medication)
        .where(and(...where))
        .orderBy(desc(medication.createdAt))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      return {
        items,
        pagination: {
          total,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.ceil(total / input.pageSize),
        },
      };
    }),

  // Medication Progress
  createMedicationProgress: protectedProcedure
    .input(createMedicationProgressSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if medication belongs to the patient (for patients) or doctor (for doctors)
      const medicationRecord = await db.query.medication.findFirst({
        where: (m, { eq }) => eq(m.id, input.medicationId),
      });

      if (!medicationRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medication not found",
        });
      }

      if (
        ctx.user.role === "PATIENT" &&
        medicationRecord.patientId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only add progress notes to your own medications",
        });
      }

      if (
        ctx.user.role === "DOCTOR" &&
        medicationRecord.doctorId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You can only add progress notes to your assigned medications",
        });
      }

      const id = crypto.randomUUID();
      const [created] = await db
        .insert(medicationProgress)
        .values({
          id,
          medicationId: input.medicationId,
          date: input.date,
          note: input.note,
        })
        .returning();

      return created;
    }),

  listMedicationProgress: protectedProcedure
    .input(listMedicationProgressSchema)
    .query(async ({ ctx, input }) => {
      // Check if medication belongs to the patient (for patients) or doctor (for doctors)
      const medicationRecord = await db.query.medication.findFirst({
        where: (m, { eq }) => eq(m.id, input.medicationId),
      });

      if (!medicationRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medication not found",
        });
      }

      if (
        ctx.user.role === "PATIENT" &&
        medicationRecord.patientId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view progress notes for your own medications",
        });
      }

      if (
        ctx.user.role === "DOCTOR" &&
        medicationRecord.doctorId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You can only view progress notes for your assigned medications",
        });
      }

      const items = await db
        .select()
        .from(medicationProgress)
        .where(eq(medicationProgress.medicationId, input.medicationId))
        .orderBy(desc(medicationProgress.date));

      return { items };
    }),
});
