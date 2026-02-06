"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Video,
  Search,
  ArrowRight,
  Stethoscope,
  Loader2,
  Star,
} from "lucide-react";

function formatDateRange(start?: string | Date, end?: string | Date) {
  if (!start) return "";
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  const datePart = startDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const timePart = startDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const endPart = endDate
    ? endDate.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;
  return endPart
    ? `${datePart} · ${timePart} - ${endPart}`
    : `${datePart} · ${timePart}`;
}

function AppointmentCard({ item }: { item: any }) {
  const timeLabel = formatDateRange(
    item.scheduledStart as Date,
    item.scheduledEnd as Date
  );
  const showJoin =
    item.meetLink && ["CONFIRMED", "PENDING"].includes(item.status);

  return (
    <Card className="border-white/15 bg-white/5 backdrop-blur-lg text-white">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">
            {item.doctorName ?? "Doctor"}
          </CardTitle>
          <p className="text-sm text-slate-300">
            {item.doctorSpecialty ?? "Specialty"}
          </p>
        </div>
        <Badge
          className={
            item.status === "CONFIRMED"
              ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40"
              : item.status === "PENDING"
              ? "bg-amber-500/20 text-amber-200 border border-amber-500/40"
              : "bg-slate-500/30 text-slate-200 border border-slate-500/40"
          }
        >
          {item.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-300" />
          <span>{timeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-300" />
          <span>{item.appointmentType}</span>
        </div>
        {showJoin && (
          <Link href={item.meetLink!} target="_blank" rel="noreferrer">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
              <Video className="w-4 h-4" />
              Join consultation
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

function DoctorAvailability({ doctorId }: { doctorId: string }) {
  const { data, isLoading } = trpc.doctorAvailability.listPublic.useQuery({
    doctorId,
    page: 1,
    pageSize: 3,
    isBooked: false,
  });

  if (isLoading) {
    return (
      <div className="text-xs text-slate-300 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading slots
      </div>
    );
  }

  if (!data?.slots?.length) {
    return <p className="text-xs text-slate-400">No open slots</p>;
  }

  return (
    <div className="flex flex-col gap-2 text-xs text-slate-200">
      {data.slots.map((slot) => (
        <div
          key={slot.id}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
        >
          <span>
            {new Date(slot.startTime).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <Badge className="bg-blue-600/20 text-blue-200 border-blue-500/30">
            {slot.isBooked ? "Booked" : "Available"}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function DoctorCard({
  doctor,
}: {
  doctor: {
    id: string;
    name: string;
    specialty: string | null;
    ratingCount?: number | null;
    averageRating?: number | null;
  };
}) {
  const ratingCount = doctor.ratingCount ?? 0;
  const averageRating = doctor.averageRating ?? 0;
  const hasRatings = ratingCount > 0;

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white hover:bg-white/10 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
            {doctor.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-lg">{doctor.name}</CardTitle>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-slate-300 leading-none">
                {doctor.specialty ?? "General Practitioner"}
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star
                    className={`w-3.5 h-3.5 ${
                      hasRatings
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-500"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {hasRatings ? averageRating.toFixed(1) : "N/A"}
                  </span>
                </div>
                {hasRatings && (
                  <span className="text-xs text-slate-400">
                    ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <Stethoscope className="w-5 h-5 text-blue-300 opacity-70" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="pt-2 border-t border-white/5">
          <DoctorAvailability doctorId={doctor.id} />
        </div>

        <Link
          href={`/patient/doctors/${doctor.id}/availability`}
          className="block"
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 group">
            Book consultation
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function PatientDashboardPage() {
  const [search, setSearch] = useState("");
  const { data: appointmentData, isLoading: appointmentsLoading } =
    trpc.appointment.list.useQuery({
      page: 1,
      pageSize: 3,
      status: "ALL",
    });

  const { data: doctors, isLoading: doctorsLoading } =
    trpc.user.listDoctors.useQuery();

  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];
    return doctors.filter((doc) =>
      [doc.name, doc.specialty].some((val) =>
        val?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [doctors, search]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-200/70">
                Overview
              </p>
              <h1 className="text-2xl font-bold">Your appointments</h1>
              <p className="text-sm text-slate-300">
                Showing your latest 3 consultations
              </p>
            </div>
          </div>

          {appointmentsLoading ? (
            <div className="flex items-center gap-3 text-slate-200">
              <Spinner className="w-5 h-5" /> Loading appointments...
            </div>
          ) : !appointmentData?.appt.length ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-slate-300">
              No appointments yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {appointmentData.appt.map((item) => (
                <AppointmentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-200/70">
                Discover
              </p>
              <h2 className="text-2xl font-bold">Browse doctors</h2>
              <p className="text-sm text-slate-300">
                Search specialists and view upcoming availability
              </p>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or specialty"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
            />
          </div>

          {doctorsLoading ? (
            <div className="flex items-center gap-3 text-slate-200">
              <Spinner className="w-5 h-5" /> Loading doctors...
            </div>
          ) : !filteredDoctors.length ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-slate-300">
              No doctors found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map((doctor) => {
                return <DoctorCard key={doctor.id} doctor={doctor} />;
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
