import { z } from "zod";

export const doctorRatingSchema = z.object({
  doctorId: z.string(),
  rating: z.number().min(1).max(5),
  review: z.string().max(1000).optional(),
});

export type DoctorRatingInput = z.infer<typeof doctorRatingSchema>;
