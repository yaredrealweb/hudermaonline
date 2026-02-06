"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  User,
  History,
  Video,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetAppointmentById,
  useMarkCompleted,
  useMarkNoShow,
} from "@/hooks/use-appointment";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { RescheduleDialog } from "@/features/appointment/components/reschedule-dialog";
import { useGetProfile } from "@/hooks/use-auth-mutation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AppointmentDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: appointment, isLoading, refetch } = useGetAppointmentById(id);
  const markCompleted = useMarkCompleted();
  const markNoShow = useMarkNoShow();
  const { data: profile } = useGetProfile();

  const isPatient = profile?.role === "PATIENT";
  const canReschedule =
    appointment?.status === "PENDING" || appointment?.status === "CONFIRMED";
  const pendingReschedule = (appointment as any)?.reschedules?.find(
    (r: any) => r.status === "REQUESTED"
  );
  const hasPendingReschedule = Boolean(pendingReschedule);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-8 text-center text-white/60">
        Appointment not found.
      </div>
    );
  }

  const handleMarkCompleted = async () => {
    try {
      await markCompleted.mutateAsync({ appointmentId: id });
      toast.success("Appointment marked as completed");
    } catch (error) {
      toast.error("Failed to update appointment");
    }
  };

  const handleMarkNoShow = async () => {
    try {
      await markNoShow.mutateAsync({ appointmentId: id });
      toast.success("Appointment marked as no-show");
    } catch (error) {
      toast.error("Failed to update appointment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "CONFIRMED":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "COMPLETED":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "CANCELED":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      case "NO_SHOW":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-white/10 text-white";
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Appointment Details
          </h1>
        </div>
        <Badge
          className={`${getStatusColor(
            appointment.status
          )} px-4 py-1 text-sm font-medium border`}
        >
          {appointment.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Session Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-400/20 group-hover:bg-blue-600/30 transition-colors">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      Patient
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {(appointment as any).patient?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-400/20 group-hover:bg-purple-600/30 transition-colors">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      Doctor
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {(appointment as any).doctor?.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-emerald-600/20 rounded-xl border border-emerald-400/20 group-hover:bg-emerald-600/30 transition-colors">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      Schedule
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {format(new Date(appointment.scheduledStart), "PPP")}
                    </p>
                    <p className="text-white/60 text-sm">
                      {format(new Date(appointment.scheduledStart), "p")} -{" "}
                      {format(new Date(appointment.scheduledEnd), "p")}
                    </p>
                  </div>
                </div>
                {(appointment as any).type && (
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-orange-600/20 rounded-xl border border-orange-400/20 group-hover:bg-orange-600/30 transition-colors">
                      <Video className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        Type
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {(appointment as any).type?.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-white/60" />
                Medical Context
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
                  Reason for Visit
                </Label>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white/80 italic">
                  {appointment.reason || "No reason provided."}
                </div>
              </div>
              <div>
                <Label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
                  Clinical Notes
                </Label>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white/80 whitespace-pre-wrap min-h-25">
                  {appointment.notes || "No clinical notes yet."}
                </div>
              </div>
            </CardContent>
          </Card>

          {appointment.status === "CONFIRMED" && (
            <div className="flex flex-wrap gap-4">
              {(appointment as any).meeting?.meetLink && (
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl transition-transform active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  <a
                    href={(appointment as any).meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Join Video Consultation
                  </a>
                </Button>
              )}
              <Button
                onClick={handleMarkCompleted}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-2xl transition-transform active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Mark as Completed
              </Button>
              <Button
                onClick={handleMarkNoShow}
                variant="outline"
                className="border-white/10 text-white hover:bg-red-500/10 hover:border-red-500/50 px-8 py-6 rounded-2xl transition-transform active:scale-95"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Mark No-Show
              </Button>
            </div>
          )}
        </div>

        {/* Timeline Column */}
        <div className="space-y-6">
          {isPatient && canReschedule && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-white/60" />
                  Reschedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {hasPendingReschedule ? (
                  <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-100">
                    <AlertTitle className="flex items-center gap-2 text-blue-100">
                      <AlertCircle className="w-4 h-4" />
                      Awaiting approval
                    </AlertTitle>
                    <AlertDescription className="text-blue-100/80">
                      You have already requested a new time. We will notify you
                      once the doctor approves it.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-white/70 text-sm">
                    Need a different time? Pick another slot and we'll ask the
                    doctor to approve the change.
                  </p>
                )}

                <RescheduleDialog
                  appointmentId={id}
                  doctorId={(appointment as any).doctorId}
                  hasPending={hasPendingReschedule}
                  onSuccess={() => {
                    refetch();
                  }}
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full border-blue-500/40 text-blue-200 hover:bg-blue-500/10"
                      disabled={hasPendingReschedule}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Request reschedule
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-full">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <History className="w-5 h-5 text-white/60" />
                Session Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8 relative before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {(appointment as any).events?.map((event: any, idx: number) => (
                  <div
                    key={event.id}
                    className="relative pl-8 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {event.newStatus}
                      </p>
                      <p className="text-xs text-white/40">
                        {format(new Date(event.createdAt), "PPp")}
                      </p>
                      {event.note && (
                        <p className="text-xs text-white/60 mt-1 italic border-l-2 border-white/10 pl-2">
                          "{event.note}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={className}>{children}</span>;
}
