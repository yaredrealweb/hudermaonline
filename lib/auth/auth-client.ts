import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as schema from "@/drizzle/schema";

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  changePassword,
  resetPassword,
  sendVerificationEmail,
  updateUser,
  getSession,
  linkSocial,
  listAccounts,
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  plugins: [inferAdditionalFields<typeof schema.user>()],
});
