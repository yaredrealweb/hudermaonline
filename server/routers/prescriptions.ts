import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { prescription, doctorPatient } from "@/drizzle/schema";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import {
  createPrescriptionSchema,
  deletePrescriptionSchema,
  listForDoctorSchema,
  listForPatientSchema,
} from "@/schema/prescription";

export const prescriptionsRouter = router({
  create: protectedProcedure
    .input(createPrescriptionSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can create prescriptions",
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
        .insert(prescription)
        .values({
          id,
          doctorId: ctx.user.id,
          patientId: input.patientId,
          imageUrl: input.imageUrl,
          title: input.title && input.title.length ? input.title : null,
          note: input.note && input.note.length ? input.note : null,
        })
        .returning();

      return created;
    }),

  listForDoctor: protectedProcedure
    .input(listForDoctorSchema)
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can view their prescriptions",
        });
      }

      const where = [
        eq(prescription.doctorId, ctx.user.id),
        isNull(prescription.deletedAt),
      ];
      if (input.patientId)
        where.push(eq(prescription.patientId, input.patientId));

      const totalRes = await db
        .select({ count: sql<number>`count(*)` })
        .from(prescription)
        .where(and(...where));
      const total = totalRes[0]?.count ?? 0;

      const items = await db
        .select()
        .from(prescription)
        .where(and(...where))
        .orderBy(desc(prescription.createdAt))
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

  listForPatient: protectedProcedure
    .input(listForPatientSchema)
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "PATIENT") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only patients can view their prescriptions",
        });
      }

      const where = [
        eq(prescription.patientId, ctx.user.id),
        isNull(prescription.deletedAt),
      ];

      const totalRes = await db
        .select({ count: sql<number>`count(*)` })
        .from(prescription)
        .where(and(...where));
      const total = totalRes[0]?.count ?? 0;

      const items = await db
        .select()
        .from(prescription)
        .where(and(...where))
        .orderBy(desc(prescription.createdAt))
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

  delete: protectedProcedure
    .input(deletePrescriptionSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can delete prescriptions",
        });
      }

      const existing = await db.query.prescription.findFirst({
        where: (p, { eq, and }) =>
          and(eq(p.id, input.id), eq(p.doctorId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prescription not found",
        });
      }

      await db
        .update(prescription)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(prescription.id, input.id));

      return { success: true };
    }),
});
