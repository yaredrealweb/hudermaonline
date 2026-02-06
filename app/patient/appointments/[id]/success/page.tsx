"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetAppointmentById } from "@/hooks/use-appointment";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Inbox,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function BookingSuccessPage() {
  const { id } = useParams() as { id: string };
  const { data: appointment, isLoading } = useGetAppointmentById(id);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0F172A] text-white space-y-4">
        <h2 className="text-2xl font-bold">Appointment Not Found</h2>
        <Link href="/patient/doctors">
          <Button
            variant="outline"
            className="border-white/10 text-white hover:bg-white/10"
          >
            Back to Doctors
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Request Received!
          </h1>
          <p className="text-emerald-400 font-medium">
            Your appointment is currently pending confirmation.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />

          <div className="space-y-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                  With Specialist
                </p>
                <p className="text-white text-lg font-medium">
                  {appointment.doctor.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-white font-medium">
                    {format(new Date(appointment.scheduledStart), "PPP")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                    Time
                  </p>
                  <p className="text-white font-medium">
                    {format(new Date(appointment.scheduledStart), "p")}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <Inbox className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                <p className="text-blue-100/80 text-sm leading-relaxed">
                  We'll notify you via email as soon as{" "}
                  <strong>Dr. {appointment.doctor.name.split(" ")[0]}</strong>{" "}
                  approves your request. You can also track the status in your
                  appointments dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/patient/appointments" className="flex-1">
            <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl h-14 group">
              Manage Appointments
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/patient/doctors" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
              Find More Doctors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
