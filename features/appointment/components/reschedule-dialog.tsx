"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { format } from "date-fns";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useRescheduleAppointment } from "@/hooks/use-appointment";
import { useListPublicDoctorAvailability } from "@/hooks/use-doctor-availability";

interface RescheduleDialogProps {
  appointmentId: string;
  doctorId: string;
  trigger: ReactNode;
  onSuccess?: () => void;
  hasPending?: boolean;
}

export function RescheduleDialog({
  appointmentId,
  doctorId,
  trigger,
  onSuccess,
  hasPending = false,
}: RescheduleDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [slotId, setSlotId] = useState("");

  const reschedule = useRescheduleAppointment();
  const { data, isLoading, refetch } = useListPublicDoctorAvailability({
    page: 1,
    pageSize: 20,
    doctorId,
    isBooked: false,
  });

  const slots = useMemo(() => data?.slots ?? [], [data?.slots]);

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleSubmit = async () => {
    if (!slotId) {
      toast({
        variant: "destructive",
        title: "Select a time",
        description: "Choose a new available slot to proceed.",
      });
      return;
    }

    try {
      await reschedule.mutateAsync({
        appointmentId,
        newAvailabilityId: slotId,
      });

      toast({
        title: "Reschedule requested",
        description: "We'll notify the doctor to approve the new time.",
      });
      setOpen(false);
      setSlotId("");
      onSuccess?.();
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error?.message || "Unable to request a new time.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-[#0F172A] border-white/10 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request a new time</DialogTitle>
          <DialogDescription className="text-slate-400">
            Pick another available slot with this doctor.
          </DialogDescription>
        </DialogHeader>

        {hasPending ? (
          <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-100">
            <AlertDescription>
              You already have a pending reschedule awaiting approval.
            </AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-sm text-slate-400 py-2">
            No available slots found for this doctor right now.
          </div>
        ) : (
          <Select
            value={slotId}
            onValueChange={setSlotId}
            disabled={hasPending || reschedule.isPending}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Choose a new time" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F172A] border-white/10 text-white">
              {slots.map((slot) => (
                <SelectItem
                  key={slot.id}
                  value={slot.id}
                  className="focus:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(slot.startTime), "PPP")}</span>
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(slot.startTime), "p")} -{" "}
                      {format(new Date(slot.endTime), "p")}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!slotId || reschedule.isPending || hasPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {reschedule.isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
