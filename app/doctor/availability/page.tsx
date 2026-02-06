"use client";

import { useState } from "react";
import { format, startOfToday, isBefore } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  CalendarDays,
  Plane,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useListPublicDoctorAvailability,
  useCreateDoctorAvailability,
  useDeleteDoctorAvailability,
  useListTimeOff,
  useCreateTimeOff,
  useDeleteTimeOff,
} from "@/hooks/use-doctor-availability";
import { useGetProfile } from "@/hooks/use-auth-mutation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function DoctorAvailabilityManagementPage() {
  const { data: profile } = useGetProfile();
  const doctorId = profile?.id;

  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  const {
    data: slotsResult,
    isLoading: isSlotsLoading,
    refetch: refetchSlots,
  } = useListPublicDoctorAvailability({
    doctorId: doctorId || undefined,
    page,
    pageSize,
  });
  const {
    data: timeOffs,
    isLoading: isTimeOffLoading,
    refetch: refetchTimeOff,
  } = useListTimeOff();

  const createSlot = useCreateDoctorAvailability();
  const deleteSlot = useDeleteDoctorAvailability();
  const createTimeOff = useCreateTimeOff();
  const deleteTimeOffAction = useDeleteTimeOff();

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isTimeOffModalOpen, setIsTimeOffModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");

  const [toStartTime, setToStartTime] = useState("09:00");
  const [toEndTime, setToEndTime] = useState("17:00");
  const [toReason, setToReason] = useState("");

  const handleCreateSlot = async () => {
    if (!selectedDate) return;

    try {
      const start = new Date(selectedDate);
      const [sh, sm] = startTime.split(":").map(Number);
      start.setHours(sh, sm, 0, 0);

      const end = new Date(selectedDate);
      const [eh, em] = endTime.split(":").map(Number);
      end.setHours(eh, em, 0, 0);

      if (isBefore(end, start)) {
        toast.error("End time must be after start time");
        return;
      }

      await createSlot.mutateAsync({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      toast.success("Availability slot created");
      setIsSlotModalOpen(false);
      refetchSlots();
    } catch (error: any) {
      toast.error(error.message || "Failed to create slot");
    }
  };

  const handleCreateTimeOff = async () => {
    if (!selectedDate) return;

    try {
      const start = new Date(selectedDate);
      const [sh, sm] = toStartTime.split(":").map(Number);
      start.setHours(sh, sm, 0, 0);

      const end = new Date(selectedDate);
      const [eh, em] = toEndTime.split(":").map(Number);
      end.setHours(eh, em, 0, 0);

      if (isBefore(end, start)) {
        toast.error("End time must be after start time");
        return;
      }

      await createTimeOff.mutateAsync({
        startTime: start,
        endTime: end,
        reason: toReason,
      });

      toast.success("Time off scheduled");
      setIsTimeOffModalOpen(false);
      refetchTimeOff();
    } catch (error: any) {
      toast.error(error.message || "Failed to create time off");
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await deleteSlot.mutateAsync({ id });
      toast.success("Slot deleted");
      refetchSlots();
    } catch (error) {
      toast.error("Failed to delete slot");
    }
  };

  const handleDeleteTimeOff = async (id: string) => {
    try {
      await deleteTimeOffAction.mutateAsync({ id });
      toast.success("Time off deleted");
      refetchTimeOff();
    } catch (error) {
      toast.error("Failed to delete time off");
    }
  };

  const isLoading = isSlotsLoading || isTimeOffLoading;
  const slots = slotsResult?.slots || [];
  const pagination = slotsResult?.pagination;

  if (!profile && !isLoading) {
    return (
      <div className="p-8 text-white/60">
        Please login as a doctor to manage availability.
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Schedule Management
          </h1>
          <p className="text-white/60 mt-1">
            Configure your clinical availability and planned time off.
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isSlotModalOpen} onOpenChange={setIsSlotModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Create Availability Slot</DialogTitle>
                <DialogDescription className="text-white/40">
                  Set a specific time window for patient consultations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-[#0F172A] border-white/10"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={{ before: new Date() }}
                        className="rounded-md border-white/10"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-white/5 border-white/10 pl-10 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="bg-white/5 border-white/10 pl-10 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsSlotModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateSlot}
                  disabled={createSlot.isPending}
                >
                  {createSlot.isPending && <Spinner className="mr-2 h-4 w-4" />}
                  Create Slot
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isTimeOffModalOpen}
            onOpenChange={setIsTimeOffModalOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10 rounded-xl"
              >
                <Plane className="w-4 h-4 mr-2" />
                Schedule Time Off
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Schedule Time Off</DialogTitle>
                <DialogDescription className="text-white/40">
                  Block your calendar for personal time or holidays.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-[#0F172A] border-white/10"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Input
                      type="time"
                      value={toStartTime}
                      onChange={(e) => setToStartTime(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Input
                      type="time"
                      value={toEndTime}
                      onChange={(e) => setToEndTime(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason (Optional)</Label>
                  <Input
                    placeholder="e.g. Annual Leave, Conference"
                    value={toReason}
                    onChange={(e) => setToReason(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsTimeOffModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleCreateTimeOff}
                  disabled={createTimeOff.isPending}
                >
                  {createTimeOff.isPending && (
                    <Spinner className="mr-2 h-4 w-4" />
                  )}
                  Save Time Off
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="slots" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-fit">
          <TabsTrigger
            value="slots"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl px-6"
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Availability Slots
          </TabsTrigger>
          <TabsTrigger
            value="timeoff"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-xl px-6"
          >
            <Plane className="w-4 h-4 mr-2" />
            Time Off
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slots" className="mt-6">
          {isSlotsLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="w-8 h-8 text-blue-500" />
            </div>
          ) : slots && slots.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.map((slot) => {
                  const isPast = isBefore(new Date(slot.startTime), new Date());
                  return (
                    <Card
                      key={slot.id}
                      className={cn(
                        "bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden group",
                        isPast && "opacity-60"
                      )}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-white/10",
                              slot.isBooked
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/20"
                            )}
                          >
                            {slot.isBooked ? "Booked" : "Available"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                            disabled={slot.isBooked}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-xl text-white mt-2">
                          {format(new Date(slot.startTime), "EEEE")}
                        </CardTitle>
                        <CardDescription className="text-white/40">
                          {format(new Date(slot.startTime), "MMMM do, yyyy")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-white/80 font-medium">
                          <Clock className="w-4 h-4 text-blue-400" />
                          {format(new Date(slot.startTime), "p")} -{" "}
                          {format(new Date(slot.endTime), "p")}
                        </div>
                      </CardContent>
                      <div className="absolute top-0 right-0 p-4 transform translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300">
                        {isPast && (
                          <Badge className="bg-slate-700 text-white/40">
                            Past
                          </Badge>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
              {pagination && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-white/60 text-sm">
                    Showing{" "}
                    {Math.min((page - 1) * pageSize + 1, pagination.total)}-
                    {Math.min(page * pageSize, pagination.total)} of{" "}
                    {pagination.total}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/10 rounded-xl"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/10 rounded-xl"
                      onClick={() =>
                        setPage((p) =>
                          pagination
                            ? Math.min(pagination.totalPages, p + 1)
                            : p + 1
                        )
                      }
                      disabled={
                        pagination ? page >= pagination.totalPages : false
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <CalendarDays className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">
                No active slots
              </h3>
              <p className="text-white/40">
                Start by adding a new consultation window.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeoff" className="mt-6">
          {isTimeOffLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="w-8 h-8 text-blue-500" />
            </div>
          ) : timeOffs && timeOffs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {timeOffs.map((off) => (
                <Card
                  key={off.id}
                  className="bg-white/5 border-white/10 backdrop-blur-xl relative group"
                >
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTimeOff(off.id)}
                      className="text-white/40 hover:text-red-400 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardHeader>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/20 w-fit">
                      Scheduled Off
                    </Badge>
                    <CardTitle className="text-xl text-white mt-2">
                      {format(new Date(off.startTime), "PPP")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-white/80 font-medium">
                      <Clock className="w-4 h-4 text-red-500" />
                      {format(new Date(off.startTime), "p")} -{" "}
                      {format(new Date(off.endTime), "p")}
                    </div>
                    {off.reason && (
                      <div className="flex items-start gap-2 text-white/60 text-sm italic">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {off.reason}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <Plane className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">All clear</h3>
              <p className="text-white/40">
                You don't have any upcoming time off scheduled.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
