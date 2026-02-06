import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {
  useConfirmAppointment,
  useCancelAppointment,
  useApproveReschedule,
  useMarkCompleted,
  useMarkNoShow,
} from "@/hooks/use-appointment";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "../../types";

interface DoctorAppointmentActionsProps {
  appointment: Appointment;
  onSuccess: () => void;
}

export function DoctorAppointmentActions({
  appointment: appt,
  onSuccess,
}: DoctorAppointmentActionsProps) {
  const { toast } = useToast();

  const confirmAppointment = useConfirmAppointment();
  const cancelAppointment = useCancelAppointment();
  const approveReschedule = useApproveReschedule();
  const markCompleted = useMarkCompleted();
  const markNoShow = useMarkNoShow();

  const handleConfirm = async () => {
    try {
      await confirmAppointment.mutateAsync({ appointmentId: appt.id });
      toast({
        title: "Success",
        description: "Appointment confirmed. Google Meet link generated.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to confirm",
      });
    }
  };

  const handleReject = async () => {
    try {
      await cancelAppointment.mutateAsync({
        appointmentId: appt.id,
        reason: "Rejected by doctor",
      });
      toast({ title: "Success", description: "Appointment rejected." });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await markCompleted.mutateAsync({ appointmentId: appt.id });
      toast({ title: "Success", description: "Marked as completed." });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleMarkNoShow = async () => {
    try {
      await markNoShow.mutateAsync({ appointmentId: appt.id });
      toast({ title: "Success", description: "Marked as no-show." });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleApproveReschedule = async () => {
    if (!appt.rescheduleRequestId) return;
    try {
      await approveReschedule.mutateAsync({
        rescheduleId: appt.rescheduleRequestId,
      });
      toast({ title: "Success", description: "Reschedule request approved." });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 lg:border-white/10 lg:pl-6">
      {appt.status === "CONFIRMED" && (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleMarkCompleted}
            disabled={markCompleted.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-6"
          >
            {markCompleted.isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Mark Completed
          </Button>
          <Button
            onClick={handleMarkNoShow}
            variant="outline"
            className="border-white/10 text-white hover:bg-red-500/10 h-10"
          >
            <XCircle className="mr-2 h-4 w-4" />
            No-Show
          </Button>
        </div>
      )}

      <Link href={`/doctor/appointments/${appt.id}`}>
        <Button
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Details
        </Button>
      </Link>

      {appt.latestRescheduleStatus === "APPROVED" &&
        !appt.rescheduleRequestId && (
          <div className="w-full lg:w-auto p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-sm text-emerald-200">
            <CheckCircle className="h-4 w-4" />
            Reschedule approved; schedule updated.
          </div>
        )}

      {appt.status === "PENDING" && (
        <>
          <Button
            onClick={handleConfirm}
            disabled={confirmAppointment.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-6"
          >
            {confirmAppointment.isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Confirm
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-10"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0F172A] border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Appointment</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Are you sure you want to reject this appointment from{" "}
                  {appt.patientName}? The patient will be notified.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  Back
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReject}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirm Rejection
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {appt.rescheduleRequestId && (
        <div className="w-full lg:w-auto p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <AlertCircle className="h-4 w-4" />
            Reschedule requested
          </div>
          <Button
            size="sm"
            onClick={handleApproveReschedule}
            disabled={approveReschedule.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      )}
    </div>
  );
}
