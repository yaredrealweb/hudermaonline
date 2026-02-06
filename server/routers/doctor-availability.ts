import { listAvailabilitySchema } from "@/schema/doctor-availability";

import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  doctorAvailability,
  doctorRatingsTable,
  user,
  doctorTimeOff,
} from "@/drizzle/schema";
import { and, eq, sql, ne, gt, lt, or, lte, gte } from "drizzle-orm";
import crypto from "crypto";
import { createTimeOffSchema } from "@/schema/doctor-availability";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const doctorAvailabilityRouter = router({
  list: protectedProcedure
    .input(listAvailabilitySchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, isBooked, search } = input;

      let whereConditions = [eq(doctorAvailability.isBooked, !!isBooked)];

      if (search && search.trim() !== "") {
        whereConditions.push(
          sql`LOWER(${user.name}) LIKE LOWER(${`%${search}%`})`
        );
      }

      const totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(doctorAvailability)
        .innerJoin(user, eq(doctorAvailability.doctorId, user.id))
        .where(and(...whereConditions));

      const total = totalCountResult[0]?.count || 0;

      const docAv = await db
        .select({
          id: doctorAvailability.id,
          startTime: doctorAvailability.startTime,
          endTime: doctorAvailability.endTime,
          isBooked: doctorAvailability.isBooked,
          doctorId: doctorAvailability.doctorId,
          doctorName: user.name,
          specialty: user.specialty,
          averageRating: sql<number | null>`AVG(${doctorRatingsTable.rating})`,
        })
        .from(doctorAvailability)
        .innerJoin(user, eq(doctorAvailability.doctorId, user.id))
        .leftJoin(
          doctorRatingsTable,
          eq(doctorRatingsTable.doctorId, doctorAvailability.doctorId)
        )
        .where(and(...whereConditions))
        .groupBy(doctorAvailability.id, user.id)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(doctorAvailability.startTime);

      return {
        docAv,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),

  listPublic: protectedProcedure
    .input(listAvailabilitySchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, doctorId, isBooked, startTime, endTime } = input;

      const whereConditions: any[] = [];

      if (doctorId)
        whereConditions.push(eq(doctorAvailability.doctorId, doctorId));
      if (typeof isBooked === "boolean")
        whereConditions.push(eq(doctorAvailability.isBooked, isBooked));
      if (startTime)
        whereConditions.push(gte(doctorAvailability.startTime, startTime));
      if (endTime)
        whereConditions.push(lte(doctorAvailability.endTime, endTime));

      const slots = await ctx.db.query.doctorAvailability.findMany({
        where: (a, { and }) => and(...whereConditions),
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy: (a, { asc }) => [asc(a.startTime)],
      });

      let timeOffs: any[] = [];
      if (doctorId) {
        timeOffs = await ctx.db.query.doctorTimeOff.findMany({
          where: (t, { eq }) => eq(t.doctorId, doctorId),
        });
      }

      const filteredSlots = slots.filter((slot) =>
        timeOffs.every(
          (off) =>
            slot.endTime <= off.startTime || slot.startTime >= off.endTime
        )
      );

      const totalCountRes = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(doctorAvailability)
        .where(and(...whereConditions));

      const total = totalCountRes[0]?.count || 0;

      return {
        slots: filteredSlots,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),

  getByDoctorId: protectedProcedure
    .input(
      z.object({
        doctorId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const availabilities = await db
        .select()
        .from(doctorAvailability)
        .where(eq(doctorAvailability.doctorId, input.doctorId))
        .orderBy(doctorAvailability.startTime);

      const timeOffs = await db
        .select()
        .from(doctorTimeOff)
        .where(eq(doctorTimeOff.doctorId, input.doctorId));

      const processedAvailabilities = availabilities.map((slot) => {
        const overlapsWithTimeOff = timeOffs.some((off) => {
          return (
            (slot.startTime >= off.startTime && slot.startTime < off.endTime) ||
            (slot.endTime > off.startTime && slot.endTime <= off.endTime) ||
            (slot.startTime <= off.startTime && slot.endTime >= off.endTime)
          );
        });

        return {
          ...slot,
          isDisabled: slot.isBooked || overlapsWithTimeOff,
        };
      });

      return processedAvailabilities;
    }),

  create: protectedProcedure
    .input(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const doctorId = ctx.user.id;
      const slot = await ctx.db.insert(doctorAvailability).values({
        id: crypto.randomUUID(),
        doctorId,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        isBooked: false,
      });
      return slot;
    }),

  createTimeOff: protectedProcedure
    .input(createTimeOffSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR" && ctx.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db.insert(doctorTimeOff).values({
        id: crypto.randomUUID(),
        doctorId: ctx.user.id,
        startTime: input.startTime,
        endTime: input.endTime,
        reason: input.reason,
      });

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doctorAvail = await ctx.db
        .select()
        .from(doctorAvailability)
        .where(and(eq(doctorAvailability.id, input.id)))
        .limit(1);

      if (!doctorAvail) {
        throw new Error("Doctor availability slot not found");
      }

      await ctx.db
        .delete(doctorAvailability)
        .where(eq(doctorAvailability.id, input.id));
      return { success: true };
    }),

  listTimeOff: protectedProcedure.query(async ({ ctx }) => {
    const doctorId = ctx.user.id;
    return ctx.db.query.doctorTimeOff.findMany({
      where: (t, { eq, gte }) =>
        and(eq(t.doctorId, doctorId), gte(t.endTime, new Date())),
      orderBy: (t, { asc }) => [asc(t.startTime)],
    });
  }),

  deleteTimeOff: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doctorId = ctx.user.id;
      await ctx.db
        .delete(doctorTimeOff)
        .where(
          and(
            eq(doctorTimeOff.id, input.id),
            eq(doctorTimeOff.doctorId, doctorId)
          )
        );
      return { success: true };
    }),
});
