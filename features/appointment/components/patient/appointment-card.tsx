import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageCircle, User, Video } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "../../types";
import { AppointmentActions } from "./appointment-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancelSuccess: () => void;
  onRescheduleSuccess: () => void;
}

export function AppointmentCard({
  appointment: appt,
  onCancelSuccess,
  onRescheduleSuccess,
}: AppointmentCardProps) {
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
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="space-y-4 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={`${getStatusColor(appt.status)} capitalize`}>
            {appt.status.toLowerCase()}
          </Badge>
          <span className="text-xs text-slate-400">
            {appt.appointmentType || "General Consultation"}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-4 w-4 text-blue-400" />
            {appt.doctorName}
          </div>
          <div className="text-sm text-slate-400 ml-6">
            {appt.doctorSpecialty}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            {format(new Date(appt.scheduledStart), "PPP")}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            {format(new Date(appt.scheduledStart), "p")} -{" "}
            {format(new Date(appt.scheduledEnd), "p")}
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
      <div className="flex items-center gap-3 self-start sm:self-auto">
        {appt.status !== "CANCELED" && (
          <Link
            href={`/patient/messages?doctorId=${appt.doctorId}`}
            aria-label={`Message ${appt.doctorName ?? "doctor"}`}
          >
            <Button variant="outline" size="icon" className="h-10 w-10">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </Link>
        )}

        <AppointmentActions
          appointment={appt}
          onCancelSuccess={onCancelSuccess}
          onRescheduleSuccess={onRescheduleSuccess}
        />
      </div>
    </div>
  );
}
