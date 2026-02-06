import { betterAuth, z } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db/drizzle";
import { EMAIL_TEMPLATES } from "./constants";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "PATIENT",
        input: true,
      },
      hasOnboarded: {
        type: "boolean",
        defaultValue: false,
        input: true,
      },
      avatarUrl: {
        type: "string",
        required: false,
        input: true,
        optional: true,
      },
      specialty: {
        type: "string",
        required: false,
        input: true,
        optional: true,
      },
      licenseNumber: {
        type: "string",
        required: false,
        input: true,
        optional: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
        optional: true,
      },
      dateOfBirth: {
        type: "date",
        defaultValue: new Date(),
        input: true,
        optional: true,
      },
      gender: {
        type: "string",
        defaultValue: "male",
        input: true,
        optional: true,
      },
      faydaImage: {
        type: "string",
        required: false,
        input: true,
        optional: true,
      },
      faydaId: {
        type: "string",
        required: false,
        input: true,
        optional: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
        optional: true,
      },
      location: {
        type: "string",
        required: false,
        input: true,
        optional: true,
      },
    },
  },
  plugins: [nextCookies()],
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    },
  },

  emailVerification: {
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url }) => {
      const { sendEmail } = require("@/lib/google");

      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: EMAIL_TEMPLATES(url),
      });
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db
            .update(schema.user)
            .set({ role: "PATIENT" })
            .where(eq(schema.user.id, user.id));
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          await db
            .update(schema.user)
            .set({
              lastSeen: new Date(),
            })
            .where(eq(schema.user.id, session.userId));
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
