import { router, protectedProcedure } from "@/server/trpc";
import { eq, and, sql, desc } from "drizzle-orm";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import {
  appointmentFilterSchema,
  bookAppointmentSchema,
  cancelAppointmentSchema,
  confirmAppointmentSchema,
  rescheduleAppointmentSchema,
} from "@/schema/appointment";
import {
  appointment,
  appointmentEvent,
  appointmentMeeting,
  appointmentReschedule,
  doctorAvailability,
  doctorPatient,
  user,
} from "@/drizzle/schema";
import { getCalendarClient } from "@/lib/utils/google-calander";
import z from "zod";
import { requireRole } from "@/lib/utils/helpers";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/google";
import { notification as notificationTable } from "@/drizzle/schema";

export const appointmentRouter = router({
  book: protectedProcedure
    .input(bookAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const patientId = ctx.user.id;

      return ctx.db.transaction(async (tx) => {
        const slot = await tx.query.doctorAvailability.findFirst({
          where: (a, { eq }) =>
            eq(a.id, input.availabilityId) && eq(a.isBooked, false),
        });

        console.log(input);

        if (!slot) throw new Error("Slot unavailable");
        console.log(slot);

        const appointmentId = crypto.randomUUID();

        await tx.insert(appointment).values({
          id: appointmentId,
          patientId,
          doctorId: slot.doctorId,
          availabilityId: slot.id,
          scheduledStart: slot.startTime,
          scheduledEnd: slot.endTime,
          reason: input.reason,
          appointmentType: input.appointmentType,
        });

        await tx
          .update(doctorAvailability)
          .set({ isBooked: true })
          .where(eq(doctorAvailability.id, slot.id));

        await tx.insert(appointmentEvent).values({
          id: crypto.randomUUID(),
          appointmentId,
          newStatus: "PENDING",
          changedBy: patientId,
          actorRole: "PATIENT",
          note: "Appointment requested",
        });

        const doctor = await tx.query.user.findFirst({
          where: (u, { eq }) => eq(u.id, slot.doctorId),
        });

        if (doctor?.email) {
          await sendEmail({
            to: doctor.email,
            subject: "New Appointment Request",
            html: `
              <h1>You have a new appointment request!</h1>
              <p>Patient: ${ctx.user.name}</p>
              <p>Time: ${slot.startTime.toLocaleString()}</p>
              <p>Reason: ${input.reason || "Not provided"}</p>
              <p>Please log in to your dashboard to confirm or reject.</p>
            `,
          });
        }

        await tx.insert(notificationTable).values({
          id: crypto.randomUUID(),
          userId: slot.doctorId,
          appointmentId,
          type: "EMAIL",
          title: "New Appointment Request",
          message: `You have a new appointment request from ${ctx.user.name}.`,
          status: "SENT",
          sentAt: new Date(),
        });

        return { appointmentId };
      });
    }),

  confirm: protectedProcedure
    .input(confirmAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "DOCTOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only doctors can confirm appointments",
        });
      }

      const doctorId = ctx.user.id;

      return ctx.db.transaction(async (tx) => {
        const appt = await tx.query.appointment.findFirst({
          where: (a, { eq }) => eq(a.id, input.appointmentId),
          with: {
            meeting: true,
          },
        });

        if (!appt) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Appointment not found",
          });
        }

        if (appt.doctorId !== doctorId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Appointment does not belong to this doctor",
          });
        }

        if (appt.status !== "PENDING" && appt.status !== "CONFIRMED") {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Cannot confirm an appointment in ${appt.status} status`,
          });
        }

        if (appt.status === "CONFIRMED" && appt.meeting?.meetLink) {
          return { meetLink: appt.meeting.meetLink };
        }

        const googleAccount = await tx.query.account.findFirst({
          where: (a, { eq, and }) =>
            and(eq(a.userId, doctorId), eq(a.providerId, "google")),
        });

        if (!googleAccount) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Connect Google Calendar to confirm appointments",
          });
        }

        const calendar = getCalendarClient({
          accessToken: googleAccount.accessToken as string,
          refreshToken: googleAccount.refreshToken as string,
        });

        const event = await calendar.events.insert({
          calendarId: "primary",
          conferenceDataVersion: 1,
          requestBody: {
            summary: "Medical Appointment",
            start: { dateTime: appt.scheduledStart.toISOString() },
            end: { dateTime: appt.scheduledEnd.toISOString() },
            attendees: [],
            conferenceData: {
              createRequest: {
                requestId: crypto.randomUUID(),
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            },
          },
        });

        const meetLink = event.data.conferenceData?.entryPoints?.find(
          (e) => e.entryPointType === "video",
        )?.uri;

        if (!meetLink) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unable to create meeting link",
          });
        }

        if (appt.meeting) {
          await tx
            .update(appointmentMeeting)
            .set({
              meetLink,
              calendarEventId: event.data.id ?? appt.meeting.calendarEventId,
            })
            .where(eq(appointmentMeeting.id, appt.meeting.id));
        } else {
          await tx.insert(appointmentMeeting).values({
            id: crypto.randomUUID(),
            appointmentId: appt.id,
            meetLink,
            calendarEventId: event.data.id,
          });
        }

        const shouldUpdateStatus = appt.status !== "CONFIRMED";

        if (shouldUpdateStatus) {
          await tx
            .update(appointment)
            .set({ status: "CONFIRMED" })
            .where(eq(appointment.id, appt.id));

          await tx.insert(appointmentEvent).values({
            id: crypto.randomUUID(),
            appointmentId: appt.id,
            oldStatus: appt.status,
            newStatus: "CONFIRMED",
            changedBy: doctorId,
            actorRole: "DOCTOR",
            note: "Appointment confirmed & Meet created",
          });

          // Establish doctor-patient relationship
          const existingRelationship = await tx.query.doctorPatient.findFirst({
            where: (dp, { and, eq }) =>
              and(eq(dp.doctorId, doctorId), eq(dp.patientId, appt.patientId)),
          });

          if (!existingRelationship) {
            await tx.insert(doctorPatient).values({
              id: crypto.randomUUID(),
              doctorId,
              patientId: appt.patientId,
            });
          }
        }

        const shouldNotify = shouldUpdateStatus || !appt.meeting?.meetLink;

        if (shouldNotify) {
          const patient = await tx.query.user.findFirst({
            where: (u, { eq }) => eq(u.id, appt.patientId),
          });

          if (patient?.email) {
            await sendEmail({
              to: patient.email,
              subject: "Appointment Confirmed",
              html: `
              <h1>Your appointment has been confirmed!</h1>
              <p>Doctor: ${ctx.user.name}</p>
              <p>Time: ${appt.scheduledStart.toLocaleString()}</p>
              <p>Meeting Link: <a href="${meetLink}">${meetLink}</a></p>
            `,
            });
          }

          await tx.insert(notificationTable).values({
            id: crypto.randomUUID(),
            userId: appt.patientId,
            appointmentId: appt.id,
            type: "EMAIL",
            title: "Appointment Confirmed",
            message: `Your appointment with Dr. ${ctx.user.name} has been confirmed.`,
            status: "SENT",
            sentAt: new Date(),
          });
        }

        return { meetLink };
      });
    }),

  cancel: protectedProcedure
    .input(cancelAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      return ctx.db.transaction(async (tx) => {
        const appt = await tx.query.appointment.findFirst({
          where: (a, { eq }) => eq(a.id, input.appointmentId),
        });

        if (!appt) throw new Error("Appointment not found");

        if (appt.status !== "PENDING" && appt.status !== "CONFIRMED") {
          throw new Error(
            "Only PENDING or CONFIRMED appointments can be canceled",
          );
        }

        await tx
          .update(appointment)
          .set({
            status: "CANCELED",
            cancelledAt: new Date(),
            cancelledBy: ctx.user.role as "PATIENT" | "DOCTOR" | "ADMIN",
          })
          .where(eq(appointment.id, appt.id));

        // Free up the availability slot
        await tx
          .update(doctorAvailability)
          .set({ isBooked: false })
          .where(eq(doctorAvailability.id, appt.availabilityId));

        await tx.insert(appointmentEvent).values({
          id: crypto.randomUUID(),
          appointmentId: appt.id,
          oldStatus: appt.status,
          newStatus: "CANCELED",
          changedBy: userId,
          actorRole: ctx.user.role as "PATIENT" | "DOCTOR" | "ADMIN",
          note: input.reason,
        });

        if (ctx.user.role === "DOCTOR") {
          const patient = await tx.query.user.findFirst({
            where: (u, { eq }) => eq(u.id, appt.patientId),
          });

          if (patient?.email) {
            await sendEmail({
              to: patient.email,
              subject: "Appointment Update",
              html: `
                <h1>Your appointment has been cancelled/rejected</h1>
                <p>Doctor: ${ctx.user.name}</p>
                <p>Status: CANCELED</p>
                ${input.reason ? `<p>Reason: ${input.reason}</p>` : ""}
              `,
            });
          }

          await tx.insert(notificationTable).values({
            id: crypto.randomUUID(),
            userId: appt.patientId,
            appointmentId: appt.id,
            type: "EMAIL",
            title: "Appointment Cancelled",
            message: `Your appointment with Dr. ${ctx.user.name} has been cancelled.`,
            status: "SENT",
            sentAt: new Date(),
          });
        }

        return { success: true };
      });
    }),

  reschedule: protectedProcedure
    .input(rescheduleAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(appointmentReschedule).values({
        id: crypto.randomUUID(),
        appointmentId: input.appointmentId,
        newAvailabilityId: input.newAvailabilityId,
        requestedBy: ctx.user.id,
      });

      return { success: true };
    }),

  approveReschedule: protectedProcedure
    .input(
      z.object({
        rescheduleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      requireRole({ role: ctx.user.role as "DOCTOR" | "ADMIN" }, [
        "DOCTOR",
        "ADMIN",
      ]);

      return ctx.db.transaction(async (tx) => {
        const req = await tx.query.appointmentReschedule.findFirst({
          where: (r, { eq }) => eq(r.id, input.rescheduleId),
        });
        if (!req || req.status !== "REQUESTED") {
          throw new Error("Invalid reschedule request");
        }

        const appt = await tx.query.appointment.findFirst({
          where: (a, { eq }) => eq(a.id, req.appointmentId),
        });
        if (!appt) throw new Error("Appointment not found");

        const newSlot = await tx.query.doctorAvailability.findFirst({
          where: (a, { eq, and }) =>
            and(eq(a.id, req.newAvailabilityId!), eq(a.isBooked, false)),
        });
        if (!newSlot) throw new Error("Slot unavailable");

        // Free old slot
        await tx
          .update(doctorAvailability)
          .set({ isBooked: false })
          .where(eq(doctorAvailability.id, appt.availabilityId));

        // Lock new slot
        await tx
          .update(doctorAvailability)
          .set({ isBooked: true })
          .where(eq(doctorAvailability.id, newSlot.id));

        // Update appointment
        await tx
          .update(appointment)
          .set({
            availabilityId: newSlot.id,
            scheduledStart: newSlot.startTime,
            scheduledEnd: newSlot.endTime,
          })
          .where(eq(appointment.id, appt.id));

        // Update reschedule status
        await tx
          .update(appointmentReschedule)
          .set({ status: "APPROVED" })
          .where(eq(appointmentReschedule.id, req.id));

        // Update Google Calendar if exists
        const meeting = await tx.query.appointmentMeeting.findFirst({
          where: (m, { eq }) => eq(m.appointmentId, appt.id),
        });

        if (meeting?.calendarEventId) {
          const googleAccount = await tx.query.account.findFirst({
            where: (a, { eq }) => eq(a.userId, appt.doctorId),
          });

          if (googleAccount) {
            const calendar = getCalendarClient({
              accessToken: googleAccount.accessToken as string,
              refreshToken: googleAccount.refreshToken as string,
            });
            await calendar.events.patch({
              calendarId: "primary",
              eventId: meeting.calendarEventId,
              requestBody: {
                start: { dateTime: newSlot.startTime.toISOString() },
                end: { dateTime: newSlot.endTime.toISOString() },
              },
            });
          }
        }

        await tx.insert(appointmentEvent).values({
          id: crypto.randomUUID(),
          appointmentId: appt.id,
          oldStatus: appt.status,
          newStatus: appt.status,
          changedBy: ctx.user.id,
          actorRole: ctx.user.role as "PATIENT" | "DOCTOR" | "ADMIN",
          note: "Appointment rescheduled",
        });

        return { success: true };
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const appt = await ctx.db.query.appointment.findFirst({
        where: (a, { eq }) => eq(a.id, input.id),
        with: {
          doctor: true,
          patient: true,
          meeting: true,
          reschedules: true,
          events: {
            orderBy: (e, { desc }) => [desc(e.createdAt)],
          },
        },
      });

      if (!appt) throw new Error("Appointment not found");
      return appt;
    }),

  markCompleted: protectedProcedure
    .input(
      z.object({ appointmentId: z.string(), notes: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      requireRole(ctx.user as { role: "PATIENT" | "DOCTOR" | "ADMIN" }, [
        "DOCTOR",
        "ADMIN",
      ]);

      return ctx.db.transaction(async (tx) => {
        const appt = await tx.query.appointment.findFirst({
          where: (a, { eq }) => eq(a.id, input.appointmentId),
        });

        if (!appt) throw new Error("Appointment not found");
        if (appt.status !== "CONFIRMED") {
          throw new Error(
            "Only confirmed appointments can be marked as completed",
          );
        }

        await tx
          .update(appointment)
          .set({
            status: "COMPLETED",
            completedAt: new Date(),
          })
          .where(eq(appointment.id, appt.id));

        await tx.insert(appointmentEvent).values({
          id: crypto.randomUUID(),
          appointmentId: appt.id,
          oldStatus: appt.status,
          newStatus: "COMPLETED",
          changedBy: ctx.user.id,
          actorRole: ctx.user.role as any,
          note: input.notes,
        });

        return { success: true };
      });
    }),

  markNoShow: protectedProcedure
    .input(z.object({ appointmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      requireRole(ctx.user as { role: "PATIENT" | "DOCTOR" | "ADMIN" }, [
        "DOCTOR",
        "ADMIN",
      ]);

      return ctx.db.transaction(async (tx) => {
        const appt = await tx.query.appointment.findFirst({
          where: (a, { eq }) => eq(a.id, input.appointmentId),
        });

        if (!appt) throw new Error("Appointment not found");
        if (appt.status !== "CONFIRMED") {
          throw new Error(
            "Only confirmed appointments can be marked as no-show",
          );
        }

        await tx
          .update(appointment)
          .set({
            status: "NO_SHOW",
          })
          .where(eq(appointment.id, appt.id));

        await tx.insert(appointmentEvent).values({
          id: crypto.randomUUID(),
          appointmentId: appt.id,
          oldStatus: appt.status,
          newStatus: "NO_SHOW",
          changedBy: ctx.user.id,
          actorRole: ctx.user.role as any,
        });

        return { success: true };
      });
    }),

  list: protectedProcedure
    .input(appointmentFilterSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, status } = input;

      const whereConditions: any[] = [];

      if (ctx.user.role === "DOCTOR") {
        const doctorId = ctx.user.id;
        whereConditions.push(eq(appointment.doctorId, doctorId));
      }

      if (ctx.user.role === "PATIENT") {
        const patientId = ctx.user.id;
        whereConditions.push(eq(appointment.patientId, patientId));
      }

      if (status && status !== "ALL") {
        whereConditions.push(eq(appointment.status, status));
      }

      const totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(appointment)
        .where(
          whereConditions.length > 0 ? and(...whereConditions) : undefined,
        );

      const total = totalCountResult[0]?.count || 0;

      const appt = await db
        .select({
          id: appointment.id,
          status: appointment.status,
          reason: appointment.reason,
          scheduledStart: appointment.scheduledStart,
          scheduledEnd: appointment.scheduledEnd,
          createdAt: appointment.createdAt,
          doctorId: appointment.doctorId,
          doctorName: user.name,
          doctorSpecialty: user.specialty,
          patientName: sql<string>`(SELECT name FROM "user" WHERE id = ${appointment.patientId})`,
          appointmentType: appointment.appointmentType,
          meetLink: appointmentMeeting.meetLink,
          rescheduleRequestId: appointmentReschedule.id,
          rescheduleStatus: appointmentReschedule.status,
          latestRescheduleStatus: sql<string | null>`(
            SELECT status
            FROM "appointment_reschedule"
            WHERE appointment_id = ${appointment.id}
            ORDER BY created_at DESC
            LIMIT 1
          )`,
        })
        .from(appointment)
        .leftJoin(user, eq(appointment.doctorId, user.id))
        .leftJoin(
          appointmentMeeting,
          eq(appointment.id, appointmentMeeting.appointmentId),
        )
        .leftJoin(
          appointmentReschedule,
          and(
            eq(appointment.id, appointmentReschedule.appointmentId),
            eq(appointmentReschedule.status, "REQUESTED"),
          ),
        )
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(desc(appointment.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return {
        appt,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),
});
