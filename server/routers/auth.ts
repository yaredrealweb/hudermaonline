import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { updateProfileSchema } from "@/schema/auth";

export const authRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userdb = await db
      .select()
      .from(user)
      .where(eq(user.id, ctx.user.id))
      .limit(1);

    if (!userdb.length) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return userdb[0];
  }),

  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const userdb = await db
        .select()
        .from(user)
        .where(eq(user.id, input.id))
        .limit(1);

      if (!userdb.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const { ...safeUser } = userdb[0];
      return safeUser;
    }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const updated = await db
        .update(user)
        .set(input)
        .where(eq(user.id, ctx.user.id))
        .returning();

      if (!updated.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return updated[0];
    }),
});
