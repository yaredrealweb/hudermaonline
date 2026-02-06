import { publicProcedure, protectedProcedure, router } from "../trpc";
import { doctorRatingsTable, user } from "@/drizzle/schema";
import { doctorRatingSchema } from "@/schema/doctor-rating";
import { TRPCError } from "@trpc/server";
import { and, eq, ilike, or, SQL, sql } from "drizzle-orm";
import { z } from "zod";

export const doctorRatingRouter = router({
  create: protectedProcedure
    .input(doctorRatingSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "PATIENT") {
        throw new Error("Only patients can rate");
      }

      const hasExistingRating = await ctx.db
        .select({ id: doctorRatingsTable.id })
        .from(doctorRatingsTable)
        .where(
          and(
            eq(doctorRatingsTable.doctorId, input.doctorId),
            eq(doctorRatingsTable.patientId, ctx.session.user.id)
          )
        )
        .limit(1);

      if (hasExistingRating.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already rated this doctor.",
        });
      }

      return ctx.db.transaction(async (tx) => {
        await tx.insert(doctorRatingsTable).values({
          id: crypto.randomUUID(),
          doctorId: input.doctorId,
          patientId: ctx.session.user.id,
          rating: Number(input.rating),
          review: input.review ?? null,
        });

        await tx.execute(sql`
        UPDATE "user"
        SET
          rating_count = COALESCE(rating_count, 0) + 1,
          average_rating = (
            (COALESCE(average_rating, 0) * COALESCE(rating_count, 0) + ${Number(
              input.rating
            )})
            / (COALESCE(rating_count, 0) + 1)
          )
        WHERE id = ${input.doctorId}
      `);
      });
    }),

  listForPatient: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(30).default(6),
        search: z.string().trim().max(100).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "PATIENT") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only patients can view doctors to rate.",
        });
      }

      const offset = (input.page - 1) * input.pageSize;
      const searchTerm = input.search?.trim();

      const filters = <SQL<unknown>[]>[eq(user.role, "DOCTOR")];

      if (searchTerm) {
        const likeTerm = `%${searchTerm}%`;
        filters.push(
          or(
            ilike(user.name, likeTerm),
            ilike(user.specialty, likeTerm)
          ) as SQL<unknown>
        );
      }

      const whereClause = filters.length === 1 ? filters[0] : and(...filters);

      const [doctors, totalRows] = await Promise.all([
        ctx.db
          .select({
            id: user.id,
            name: user.name,
            specialty: user.specialty,
            averageRating: user.averageRating,
            ratingCount: user.ratingCount,
            patientRating: doctorRatingsTable.rating,
          })
          .from(user)
          .leftJoin(
            doctorRatingsTable,
            and(
              eq(doctorRatingsTable.doctorId, user.id),
              eq(doctorRatingsTable.patientId, ctx.session.user.id)
            )
          )
          .where(whereClause)
          .limit(input.pageSize)
          .offset(offset),
        ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(user)
          .where(whereClause),
      ]);

      const total = Number(totalRows[0]?.count ?? 0);

      return {
        doctors: doctors.map((doc) => ({
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          averageRating: doc.averageRating ?? 0,
          ratingCount: doc.ratingCount ?? 0,
          patientRating: doc.patientRating ?? null,
          hasRated: doc.patientRating != null,
        })),
        total,
        page: input.page,
        pageSize: input.pageSize,
      };
    }),

  list: publicProcedure
    .input(
      z.object({
        doctorId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.pageSize;
      const ratings = await ctx.db
        .select()
        .from(doctorRatingsTable)
        .where(eq(doctorRatingsTable.doctorId, input.doctorId))
        .limit(input.pageSize)
        .offset(offset);
      const total = await ctx.db
        .select()
        .from(doctorRatingsTable)
        .where(eq(doctorRatingsTable.doctorId, input.doctorId));
      return { ratings, total: total.length };
    }),

  average: publicProcedure
    .input(z.object({ doctorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ratings = await ctx.db
        .select({ rating: doctorRatingsTable.rating })
        .from(doctorRatingsTable)
        .where(eq(doctorRatingsTable.doctorId, input.doctorId));
      if (!ratings.length) return null;
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      return sum / ratings.length;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        rating: z.number().min(1).max(5),
        review: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Only admins can edit reviews");
      }

      return ctx.db.transaction(async (tx) => {
        await tx
          .update(doctorRatingsTable)
          .set({ rating: input.rating, review: input.review })
          .where(eq(doctorRatingsTable.id, input.id));

        await tx.execute(sql`
        UPDATE "user" u
        SET average_rating = sub.avg
        FROM (
          SELECT doctor_id, AVG(rating)::int AS avg
          FROM doctor_ratings
          WHERE doctor_id = u.id
          GROUP BY doctor_id
        ) sub
        WHERE u.id = sub.doctor_id
      `);
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new Error("Only admins can delete reviews");
      return ctx.db
        .delete(doctorRatingsTable)
        .where(eq(doctorRatingsTable.id, input.id));
    }),
});
