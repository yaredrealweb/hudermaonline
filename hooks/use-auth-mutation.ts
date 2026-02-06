"use client";

import { trpc } from "@/lib/trpc";
import { UserRole } from "@/lib/types";

export function useGetProfile() {
  return trpc.auth.getProfile.useQuery();
}

export function useUpdateProfile() {
  return trpc.auth.updateProfile.useMutation();
}

export function useUpdateProfileMutation() {
  return trpc.auth.updateProfile.useMutation();
}

export function useGetUserById(id: string) {
  return trpc.auth.getUserById.useQuery({ id });
}

// Admin hooks
export function useListAllUsers(limit = 50, offset = 0, role?: UserRole) {
  return trpc.user.listAll.useQuery({
    limit,
    offset,
    role,
  });
}

export function useCountByRole(role: UserRole) {
  return trpc.user.countByRole.useQuery({ role });
}

export function useDeleteUser() {
  return trpc.user.delete.useMutation();
}

export function useDeactivateUser() {
  return trpc.user.deactivate.useMutation();
}

export function useGetStats() {
  return trpc.user.getStats.useQuery();
}

export function useGetPatients() {
  return trpc.user.getPatients.useQuery();
}

export function useGetDoctorAppointments(status?: any) {
  return trpc.appointment.list.useQuery({
    status: status || "ALL",
    page: 1,
    pageSize: 100,
  });
}
