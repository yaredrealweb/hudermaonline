"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useGetAppointments } from "@/hooks/use-appointment";
import { linkSocial, listAccounts } from "@/lib/auth/auth-client";
import { LoadingSkeleton } from "./loading-skeleton";
import { AppointmentTabs } from "./appointment-tab";
import { EmptyState } from "./empty-state";
import { DoctorAppointmentCard } from "./doctor-apoointment-card";

export default function DoctorAppointmentsPage() {
  const [activeTab, setActiveTab] = useState("PENDING");

  const { data, isLoading, refetch } = useGetAppointments({
    page: 1,
    pageSize: 50,
    status: activeTab as any,
  });

  const handleSuccess = () => refetch();

  useEffect(() => {
    const checkScopes = async () => {
      const { data: accounts } = await listAccounts();
      const googleAccount = accounts?.find(
        (acc) => acc.providerId === "google"
      );
      const hasRequiredScopes =
        googleAccount?.scopes.includes(
          "https://www.googleapis.com/auth/calendar"
        ) &&
        googleAccount?.scopes.includes(
          "https://www.googleapis.com/auth/calendar.events"
        );

      if (googleAccount && !hasRequiredScopes) {
        await linkSocial({
          provider: "google",
          scopes: [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
          ],
        });
      }
    };
    checkScopes();
  }, []);

  if (isLoading) return <LoadingSkeleton />;

  const appointments = data?.appt || [];

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 sm:p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Appointment Inbox
          </h1>
          <Badge
            variant="outline"
            className="w-fit bg-blue-500/10 text-blue-400 border-blue-500/20"
          >
            Doctor View
          </Badge>
        </div>

        <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="space-y-4">
          {appointments.length === 0 ? (
            <EmptyState />
          ) : (
            appointments.map((appt) => (
              <DoctorAppointmentCard
                key={appt.id}
                appointment={appt}
                onActionSuccess={handleSuccess}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
