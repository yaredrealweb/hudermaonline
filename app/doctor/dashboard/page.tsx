"use client";

import Link from "next/link";
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useGetProfile, useGetPatients } from "@/hooks/use-auth-mutation";
import { useDoctorPrescriptions } from "@/hooks/use-prescriptions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Calendar,
  Users,
  Star,
  Pill,
  Activity,
  Video,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  value: string | number;
  icon: any;
  tone?: "default" | "success" | "warning";
}) {
  const toneClasses = {
    default: "bg-white/5 border-white/10",
    success: "bg-emerald-500/10 border-emerald-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
  }[tone];

  return (
    <Card className={`${toneClasses} text-white backdrop-blur-xl`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-slate-200">{title}</CardTitle>
        <Icon className="w-5 h-5 text-blue-300" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function formatDate(start?: string | Date, end?: string | Date) {
  if (!start) return "";
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const date = s.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const time = s.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = e?.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return endTime ? `${date} · ${time} - ${endTime}` : `${date} · ${time}`;
}

export default function DoctorDashboardPage() {
  const { data: profile } = useGetProfile();

  const { data: allAppointments, isLoading: loadingAll } =
    trpc.appointment.list.useQuery({
      status: "ALL",
      page: 1,
      pageSize: 5,
    });

  const { data: pendingAppointments } = trpc.appointment.list.useQuery({
    status: "PENDING",
    page: 1,
    pageSize: 1,
  });

  const { data: confirmedAppointments } = trpc.appointment.list.useQuery({
    status: "CONFIRMED",
    page: 1,
    pageSize: 1,
  });

  const { data: avgRating } = trpc.doctorRating.average.useQuery(
    { doctorId: profile?.id ?? "" },
    { enabled: !!profile?.id }
  );

  const { data: patients } = useGetPatients();
  const { data: prescriptions } = useDoctorPrescriptions({
    page: 1,
    pageSize: 5,
  });

  const summary = useMemo(() => {
    return {
      totalAppointments: allAppointments?.pagination.total ?? 0,
      pending: pendingAppointments?.pagination.total ?? 0,
      confirmed: confirmedAppointments?.pagination.total ?? 0,
      avgRating: avgRating?.toFixed(1) ?? "--",
      patientCount: patients?.length ?? 0,
      prescriptionCount: prescriptions?.items?.length ?? 0,
    };
  }, [
    allAppointments?.pagination.total,
    pendingAppointments?.pagination.total,
    confirmedAppointments?.pagination.total,
    avgRating,
    patients?.length,
    prescriptions?.items?.length,
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-200/70">
              Overview
            </p>
            <h1 className="text-3xl font-bold">
              Welcome back{profile?.name ? `, ${profile.name}` : ""}
            </h1>
            <p className="text-sm text-slate-300">
              Here’s a snapshot of your consultations
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3  gap-3">
            <StatCard
              title="Total appointments"
              value={summary.totalAppointments}
              icon={Calendar}
            />
            <StatCard
              title="Pending"
              value={summary.pending}
              icon={AlertCircle}
              tone="warning"
            />
            <StatCard
              title="Confirmed"
              value={summary.confirmed}
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              title="Avg rating"
              value={summary.avgRating}
              icon={Star}
            />
            <StatCard
              title="Patients"
              value={summary.patientCount}
              icon={Users}
            />
            <StatCard
              title="Prescriptions"
              value={summary.prescriptionCount}
              icon={Pill}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-200/70">
                Consultations
              </p>
              <h2 className="text-2xl font-bold">Recent appointments</h2>
              <p className="text-sm text-slate-300">
                Latest requests and confirmed visits
              </p>
            </div>
            <Link href="/doctor/appointments">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View all
              </Button>
            </Link>
          </div>

          {loadingAll ? (
            <div className="flex items-center gap-3 text-slate-200">
              <Spinner className="w-5 h-5" /> Loading appointments...
            </div>
          ) : !allAppointments?.appt.length ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-slate-300">
              No appointments yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAppointments.appt.map((appt) => (
                <Card
                  key={appt.id}
                  className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors"
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-3">
                    <div>
                      <CardTitle className="text-lg">
                        {appt.patientName}
                      </CardTitle>
                      <CardDescription className="text-slate-300">
                        {formatDate(
                          appt.scheduledStart as unknown as Date,
                          appt.scheduledEnd as unknown as Date
                        )}
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        appt.status === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40"
                          : appt.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-200 border border-amber-500/40"
                          : "bg-slate-500/30 text-slate-200 border border-slate-500/40"
                      }
                    >
                      {appt.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-200">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-300" />
                      <span>{appt.reason ?? "Consultation"}</span>
                    </div>
                    {appt.meetLink && (
                      <Link
                        href={appt.meetLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                          <Video className="w-4 h-4" />
                          Join meeting
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-200/70">
                Patients
              </p>
              <h2 className="text-2xl font-bold">Your patient summary</h2>
              <p className="text-sm text-slate-300">
                Recent relationships established via confirmed visits
              </p>
            </div>
            <Link href="/doctor/patients">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Manage patients
              </Button>
            </Link>
          </div>

          {!patients ? (
            <div className="flex items-center gap-3 text-slate-200">
              <Spinner className="w-5 h-5" /> Loading patients...
            </div>
          ) : !patients.length ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-slate-300">
              No patients yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.slice(0, 6).map((patient) => (
                <Card
                  key={patient.id}
                  className="bg-white/5 border-white/10 backdrop-blur-xl"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">
                      {patient.name}
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      {patient.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-300" />
                      <span>{patient.gender ?? "--"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-300" />
                      <span>
                        {patient.dateOfBirth
                          ? new Date(patient.dateOfBirth).toLocaleDateString()
                          : "Date of birth unknown"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
