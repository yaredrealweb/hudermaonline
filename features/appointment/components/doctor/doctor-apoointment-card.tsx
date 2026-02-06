import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Appointment } from "../../types";
import { DoctorAppointmentActions } from "./doctor-appointment-action";

interface DoctorAppointmentCardProps {
  appointment: Appointment;
  onActionSuccess: () => void;
}

export function DoctorAppointmentCard({
  appointment: appt,
  onActionSuccess,
}: DoctorAppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/20";
      case "CONFIRMED":
        return "bg-green-500/20 text-green-400 border-green-500/20";
      case "COMPLETED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      case "CANCELED":
        return "bg-red-500/20 text-red-400 border-red-500/20";
      case "NO_SHOW":
        return "bg-slate-500/20 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 min-w-0">
          <div className="space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={`${getStatusColor(appt.status)} capitalize`}>
                {appt.status.toLowerCase()}
              </Badge>
              <span className="text-xs text-slate-400">
                {appt.appointmentType || "General"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shrink-0">
                {appt.patientName?.[0] || "?"}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">
                  {appt.patientName}
                </div>
                <div className="text-xs text-slate-400">Patient</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="text-sm">
                  {format(new Date(appt.scheduledStart), "PPP")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="text-sm">
                  {format(new Date(appt.scheduledStart), "p")} -{" "}
                  {format(new Date(appt.scheduledEnd), "p")}
                </span>
              </div>
            </div>
            {appt.meetLink && (
              <Link href={appt.meetLink} target="_blank" className="block">
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <Video className="h-4 w-4" />
                  Join Google Meet
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-2 lg:block hidden lg:space-y-2">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Reason
            </div>
            <p className="text-sm text-slate-300 line-clamp-3 italic">
              "{appt.reason || "No reason provided"}"
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:min-w-60 lg:border-l lg:border-white/10 lg:pl-6">
          <DoctorAppointmentActions
            appointment={appt}
            onSuccess={onActionSuccess}
          />
        </div>
      </div>

      <div className="lg:hidden border-t border-white/10 pt-4">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          Reason
        </div>
        <p className="text-sm text-slate-300 italic">
          "{appt.reason || "No reason provided"}"
        </p>
      </div>
    </div>
  );
}
