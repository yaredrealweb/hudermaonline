import { trpc } from "@/lib/trpc";

export function useDoctorRatings(doctorId: string, page = 1, pageSize = 10) {
  return trpc.doctorRating.list.useQuery({ doctorId, page, pageSize });
}

export function useDoctorAverageRating(doctorId: string) {
  return trpc.doctorRating.average.useQuery({ doctorId });
}

export function useCreateDoctorRating() {
  return trpc.doctorRating.create.useMutation();
}

export function useEditDoctorRating() {
  return trpc.doctorRating.edit.useMutation();
}

export function useDeleteDoctorRating() {
  return trpc.doctorRating.delete.useMutation();
}
