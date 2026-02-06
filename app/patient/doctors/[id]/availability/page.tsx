"use client";

import { useParams } from "next/navigation";
import { useGetDoctorAvailabilityById } from "@/hooks/use-doctor-availability";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BookAppointmentModal } from "@/features/appointment/components/book-appointment-modal";

export default function DoctorAvailabilityPage() {
  const { id } = useParams() as { id: string };
  const { data: slots, isLoading, refetch } = useGetDoctorAvailabilityById(id);
  const { data: doctor } = trpc.user.getById.useQuery({ id });

  const [selectedSlot, setSelectedSlot] = React.useState<{
    id: string;
    startTime: Date;
    endTime: Date;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 sm:p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {doctor?.name}'s Availability
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots?.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white/5 border border-white/10 rounded-2xl">
              <CalendarIcon className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400">
                No availability slots found for this doctor.
              </p>
            </div>
          ) : (
            slots?.map((slot) => (
              <Card
                key={slot.id}
                className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer overflow-hidden ${
                  slot.isDisabled
                    ? "opacity-50 cursor-not-allowed grayscale"
                    : "hover:border-blue-500/50"
                }`}
                onClick={() => {
                  if (!slot.isDisabled) {
                    setSelectedSlot({
                      id: slot.id,
                      startTime: new Date(slot.startTime),
                      endTime: new Date(slot.endTime),
                    });
                    setIsModalOpen(true);
                  }
                }}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-400">
                      {format(new Date(slot.startTime), "EEEE")}
                    </span>
                    {slot.isDisabled && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">
                        {slot.isBooked ? "Booked" : "Time Off"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <CalendarIcon className="h-4 w-4 text-slate-400" />
                    {format(new Date(slot.startTime), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {format(new Date(slot.startTime), "p")} -{" "}
                    {format(new Date(slot.endTime), "p")}
                  </div>
                  <Button
                    className={`w-full ${
                      slot.isDisabled
                        ? "bg-slate-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    disabled={slot.isDisabled}
                  >
                    {slot.isDisabled ? "Unavailable" : "Book Now"}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedSlot && (
        <BookAppointmentModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          availabilityId={selectedSlot.id}
          doctorName={doctor?.name || "Doctor"}
          startTime={selectedSlot.startTime}
          endTime={selectedSlot.endTime}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
