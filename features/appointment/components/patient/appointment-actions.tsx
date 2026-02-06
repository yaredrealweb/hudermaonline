import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw } from "lucide-react";
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
import { RescheduleDialog } from "@/features/appointment/components/reschedule-dialog";
import { useCancelAppointment } from "@/hooks/use-appointment";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "../../types";

interface AppointmentActionsProps {
  appointment: Appointment;
  onCancelSuccess: () => void;
  onRescheduleSuccess: () => void;
}

export function AppointmentActions({
  appointment: appt,
  onCancelSuccess,
  onRescheduleSuccess,
}: AppointmentActionsProps) {
  const { toast } = useToast();
  const cancelAppointment = useCancelAppointment();

  const handleCancel = async () => {
    try {
      await cancelAppointment.mutateAsync({ appointmentId: appt.id });
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
      onCancelSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to cancel appointment",
      });
    }
  };

  const canModify = appt.status === "PENDING" || appt.status === "CONFIRMED";

  if (!canModify) return null;

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-9"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#0F172A] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action will cancel your appointment with Dr.{" "}
              {appt.doctorName}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RescheduleDialog
        appointmentId={appt.id}
        doctorId={appt.doctorId}
        hasPending={appt.rescheduleStatus === "REQUESTED"}
        onSuccess={onRescheduleSuccess}
        trigger={
          <Button
            variant="outline"
            size="sm"
            disabled={appt.rescheduleStatus === "REQUESTED"}
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 h-9"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {appt.rescheduleStatus === "REQUESTED" ? "Pending" : "Reschedule"}
          </Button>
        }
      />
    </div>
  );
}
