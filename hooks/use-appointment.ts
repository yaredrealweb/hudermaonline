"use client";

import { trpc } from "@/lib/trpc";
import { appointmentFilterSchema } from "@/schema/appointment";
import z from "zod";

export function useBookAppointment() {
  return trpc.appointment.book.useMutation();
}

export function useConfirmAppointment() {
  return trpc.appointment.confirm.useMutation();
}

export function useCancelAppointment() {
  return trpc.appointment.cancel.useMutation();
}

export function useRescheduleAppointment() {
  return trpc.appointment.reschedule.useMutation();
}

export function useApproveReschedule() {
  return trpc.appointment.approveReschedule.useMutation();
}

export function useMarkCompleted() {
  return trpc.appointment.markCompleted.useMutation();
}

export function useMarkNoShow() {
  return trpc.appointment.markNoShow.useMutation();
}

export function useGetAppointmentById(id: string) {
  return trpc.appointment.getById.useQuery({ id });
}

export function useGetAppointments(
  filter?: z.infer<typeof appointmentFilterSchema>
) {
  return trpc.appointment.list.useQuery(filter || {});
}
