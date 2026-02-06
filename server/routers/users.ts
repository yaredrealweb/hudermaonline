import { router, adminProcedure, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { user } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { doctorPatient } from "@/drizzle/schema";

export const userRouter = router({
  listAll: adminProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]).optional(),
      })
    )
    .query(async ({ input }) => {
      let query = db.select().from(user);

      if (input.role) {
        const usersWithRole = await db
          .select()
          .from(user)
          .where(eq(user.role, input.role))
          .limit(input.limit)
          .offset(input.offset);

        return usersWithRole.map(({ ...user }) => user);
      }

      const users = await query.limit(input.limit).offset(input.offset);

      return users.map(({ ...user }) => user);
    }),

  countByRole: adminProcedure
    .input(z.object({ role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]) }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(user)
        .where(eq(user.role, input.role));

      return result.length;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const deleted = await db
        .delete(user)
        .where(eq(user.id, input.id))
        .returning();

      if (!deleted.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return { success: true };
    }),

  deactivate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await db
        .update(user)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(user.id, input.id))
        .returning();

      if (!updated.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return { success: true, user: updated[0] };
    }),

  getStats: adminProcedure.query(async () => {
    const [patients, doctors, admins] = await Promise.all([
      db.select().from(user).where(eq(user.role, "PATIENT")),
      db.select().from(user).where(eq(user.role, "DOCTOR")),
      db.select().from(user).where(eq(user.role, "ADMIN")),
    ]);

    return {
      totalUsers: patients.length + doctors.length + admins.length,
      patients: patients.length,
      doctors: doctors.length,
      admins: admins.length,
    };
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const u = await db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, input.id),
      });

      if (!u) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return u;
    }),

  listDoctors: protectedProcedure.query(async () => {
    return db.query.user.findMany({
      where: (u, { eq }) => eq(u.role, "DOCTOR"),
    });
  }),

  search: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { query, role } = input;
      const searchLower = `%${query.toLowerCase()}%`;

      return db.query.user.findMany({
        where: (u, { and, eq, or, ilike }) => {
          const conditions = [
            or(
              ilike(u.name, searchLower),
              ilike(u.email, searchLower),
              ilike(u.specialty, searchLower)
            ),
          ];

          if (role) {
            conditions.push(eq(u.role, role));
          }

          return and(...conditions);
        },
        limit: 10,
      });
    }),
  getPatients: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "DOCTOR") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only doctors can view their patients",
      });
    }

    const patients = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        specialty: user.specialty,
      })
      .from(user)
      .innerJoin(doctorPatient, eq(user.id, doctorPatient.patientId))
      .where(eq(doctorPatient.doctorId, ctx.user.id));

    return patients;
  }),

  getPatientDemographics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "DOCTOR") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only doctors can view their patient demographics",
      });
    }

    const rows = await db
      .select({
        location: user.location,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(doctorPatient)
      .innerJoin(user, eq(user.id, doctorPatient.patientId))
      .where(eq(doctorPatient.doctorId, ctx.user.id))
      .groupBy(user.location);

    return rows.map((row) => ({
      location: row.location ?? "Unknown",
      count: row.count,
    }));
  }),
});
