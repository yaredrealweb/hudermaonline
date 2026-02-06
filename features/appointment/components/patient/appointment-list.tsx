"use client";

import { useGetAppointments } from "@/hooks/use-appointment";
import { AppointmentCard } from "./appointment-card";
import { AppointmentListSkeleton } from "./appointment-list-skeleton";
import { EmptyAppointments } from "./empty-appointments";

export default function AppointmentList() {
  const { data, isLoading, refetch } = useGetAppointments({
    page: 1,
    pageSize: 50,
  });

  const handleSuccess = () => refetch();

  if (isLoading) {
    return <AppointmentListSkeleton />;
  }

  const appointments = data?.appt || [];

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 sm:p-8 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          My Appointments
        </h1>

        <div className="space-y-4">
          {appointments.length === 0 ? (
            <EmptyAppointments />
          ) : (
            appointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onCancelSuccess={handleSuccess}
                onRescheduleSuccess={handleSuccess}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
