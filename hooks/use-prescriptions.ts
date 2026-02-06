import { trpc } from "@/lib/trpc";

export function useDoctorPrescriptions(params: {
  patientId?: string;
  page?: number;
  pageSize?: number;
}) {
  return trpc.prescriptions.listForDoctor.useQuery(
    {
      patientId: params.patientId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
    },
    { enabled: true }
  );
}

export function usePatientPrescriptions(params?: {
  page?: number;
  pageSize?: number;
}) {
  return trpc.prescriptions.listForPatient.useQuery({
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 20,
  });
}

export function useCreatePrescription() {
  const utils = trpc.useUtils();
  return trpc.prescriptions.create.useMutation({
    onSuccess: () => {
      utils.prescriptions.listForDoctor.invalidate();
      utils.prescriptions.listForPatient.invalidate();
    },
  });
}

export function useDeletePrescription() {
  const utils = trpc.useUtils();
  return trpc.prescriptions.delete.useMutation({
    onSuccess: () => {
      utils.prescriptions.listForDoctor.invalidate();
      utils.prescriptions.listForPatient.invalidate();
    },
  });
}
