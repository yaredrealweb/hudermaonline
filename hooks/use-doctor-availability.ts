"use client";

import { trpc } from "@/lib/trpc";
import { listAvailabilitySchema } from "@/schema/doctor-availability";
import z from "zod";

export function useGetDoctorAvailability(
  filter?: z.infer<typeof listAvailabilitySchema>
) {
  return trpc.doctorAvailability.list.useQuery(filter || {});
}

export function useGetDoctorAvailabilityById(doctorId: string) {
  return trpc.doctorAvailability.getByDoctorId.useQuery({ doctorId });
}

export function useCreateDoctorAvailability() {
  return trpc.doctorAvailability.create.useMutation();
}

export function useDeleteDoctorAvailability() {
  return trpc.doctorAvailability.delete.useMutation();
}

export function useListPublicDoctorAvailability(
  filter?: z.infer<typeof listAvailabilitySchema>
) {
  return trpc.doctorAvailability.listPublic.useQuery(filter || {});
}

export function useCreateTimeOff() {
  return trpc.doctorAvailability.createTimeOff.useMutation();
}

export function useListTimeOff() {
  return trpc.doctorAvailability.listTimeOff.useQuery();
}

export function useDeleteTimeOff() {
  return trpc.doctorAvailability.deleteTimeOff.useMutation();
}
