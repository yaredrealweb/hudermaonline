"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useBookAppointment } from "@/hooks/use-appointment";
import { bookAppointmentSchema } from "@/schema/appointment";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { addPaypalScript, PRICES } from "@/lib/paypal";
import { PayPalButton } from "react-paypal-button-v2";

const appointmentTypeOptions = [
  { value: "VIDEO", label: "Video" },
  { value: "IN_PERSON", label: "In Person" },
  { value: "CHAT", label: "Chat" },
  { value: "VOICE", label: "Voice" },
];

interface BookAppointmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availabilityId: string;
  doctorName: string;
  startTime: Date;
  endTime: Date;
  onSuccess?: () => void;
}

export function BookAppointmentModal({
  isOpen,
  onOpenChange,
  availabilityId,
  doctorName,
  startTime,
  endTime,
  onSuccess,
}: BookAppointmentModalProps) {
  const { toast } = useToast();
  const bookAppointment = useBookAppointment();
  // const [scriptLoaded, setScriptLoaded] = useState(false);

  const form = useForm<z.infer<typeof bookAppointmentSchema>>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      availabilityId,
      reason: "",
      appointmentType: "VIDEO",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof bookAppointmentSchema>) {
    try {
      const result = await bookAppointment.mutateAsync(values);
      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
      onOpenChange(false);
      onSuccess?.();
      router.push(`/patient/appointments/${result.appointmentId}/success`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to book appointment",
      });
    }
  }

  // useEffect(() => {
  //   addPaypalScript(setScriptLoaded);
  // }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25 bg-[#0F172A] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription className="text-slate-400">
            Book your session with Dr. {doctorName} for{" "}
            {format(startTime, "PPP")} at {format(startTime, "p")} -{" "}
            {format(endTime, "p")}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F172A] border-white/10 text-white">
                      {appointmentTypeOptions.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="focus:bg-white/10"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your symptoms/reason..."
                      className="resize-none bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* {scriptLoaded ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col bg-black/50 rounded-xl p-5 mb-1">
                  <span>Appoitment cost (USD)</span>
                  <p className="text-xl font-bold">${PRICES.APPOINTMENT}</p>
                </div> */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={bookAppointment.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {bookAppointment.isPending ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : null}
                Confirm Booking
              </Button>
            </DialogFooter>
            {/* <PayPalButton
                  amount={PRICES.APPOINTMENT}
                  onSuccess={(details, data) => {
                    console.log(details, data);
                    form.handleSubmit(onSubmit)();
                  }}
                /> */}
            {/* </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <span className="text-sm opacity-60 animate-impulse">
                  Loading...
                </span>
              </div>
            )} */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
