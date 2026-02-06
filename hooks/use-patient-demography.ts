"use client";

import { trpc } from "@/lib/trpc";

export function usePatientDemography() {
  return trpc.user.getPatientDemographics.useQuery();
}
