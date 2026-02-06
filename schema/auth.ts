import { USER_ROLES } from "@/lib/constants";
import z from "zod";

export const authSchema = z.object({
  email: z.email(),
  name: z.string().min(3),
  password: z.string().min(8, "Password must be at least 8 characters"),

  location: z.string().min(1, "Location is required"),

  phone: z.string().optional(),
  avatarUrl: z.url().optional(),

  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
  bio: z.string().optional(),
  faydaImage: z.string().optional(),
  faydaId: z.string().optional(),

  dateOfBirth: z.date().optional(),
  gender: z.enum(["male", "female"]).optional(),
  role: z.enum(USER_ROLES).optional(),
  hasOnboarded: z.boolean().optional(),
});

export const loginSchema = authSchema.pick({
  email: true,
  password: true,
});

export const updateProfileSchema = authSchema
  .omit({ password: true })
  .partial();

export type AuthFormData = z.infer<typeof authSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
