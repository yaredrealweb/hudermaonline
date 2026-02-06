import { router } from "@/server/trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/users";
import { appointmentRouter } from "./routers/appointment";
import { doctorAvailabilityRouter } from "./routers/doctor-availability";

import { doctorRatingRouter } from "./routers/doctor-rating";
import { messagesRouter } from "./routers/message";
import { prescriptionsRouter } from "./routers/prescriptions";
import { medicalReportsRouter } from "./routers/medical-reports";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  appointment: appointmentRouter,
  doctorAvailability: doctorAvailabilityRouter,
  doctorRating: doctorRatingRouter,
  messages: messagesRouter,
  prescriptions: prescriptionsRouter,
  medicalReports: medicalReportsRouter,
});

export type AppRouter = typeof appRouter;
