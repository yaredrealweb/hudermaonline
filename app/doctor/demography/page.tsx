"use client";

import { useMemo } from "react";
import { MapPin, Users, Globe2, TrendingUp, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { usePatientDemography } from "@/hooks/use-patient-demography";

const palette = [
  "#60a5fa",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#38bdf8",
  "#f97316",
  "#22c55e",
];

export default function DoctorDemographyPage() {
  const { data, isLoading, isError } = usePatientDemography();

  const { totalPatients, locations, topLocation } = useMemo(() => {
    const locations = [...(data ?? [])]
      .map((item, index) => ({
        ...item,
        color: palette[index % palette.length],
      }))
      .sort((a, b) => b.count - a.count);

    const totalPatients = locations.reduce((acc, cur) => acc + cur.count, 0);
    const topLocation = locations[0];

    return { totalPatients, locations, topLocation };
  }, [data]);

  const pieData = locations.map((loc) => ({
    name: loc.location,
    value: loc.count,
    color: loc.color,
  }));

  const barData = locations.map((loc) => ({
    name: loc.location,
    count: loc.count,
    color: loc.color,
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-8">
      <div className="max-w-6xl mx-auto space-y-8 px-2 sm:px-4 lg:px-0">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-blue-200/70 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Patient Demography
          </p>
          <h1 className="text-3xl font-bold">
            Where your patients are coming from
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Location insights based on your current patient panel, grouped by
            the location stored on each patient profile.
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-200">
            <Spinner className="w-5 h-5" /> Loading patient demography...
          </div>
        ) : isError ? (
          <Card className="bg-red-500/10 border-red-500/30 text-red-100">
            <CardContent className="p-4">
              Failed to load patient demography.
            </CardContent>
          </Card>
        ) : !locations.length ? (
          <Card className="border-dashed border-white/15 bg-white/5">
            <CardContent className="p-6 space-y-2 text-slate-200">
              <h3 className="text-lg font-semibold">
                No patient locations yet
              </h3>
              <p className="text-sm text-slate-400">
                Once patients are linked to you and have a profile location,
                their distribution will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-300" /> Total patients
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Patients linked to you via consultations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalPatients}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-emerald-300" /> Unique
                    locations
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Based on patient profile location field
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{locations.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-300" /> Top
                    location
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Highest patient concentration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-lg font-semibold">
                    {topLocation?.location}
                  </p>
                  <p className="text-sm text-slate-400">
                    {topLocation?.count ?? 0} patients
                  </p>
                </CardContent>
              </Card>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-900/60 border-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-blue-300" /> Distribution
                    by location
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Count of patients per location
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ left: -20, right: 10 }}>
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 12,
                          color: "white",
                        }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MapPin className="w-5 h-5 text-rose-300" /> Share by
                    location
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Proportion of total patients
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col lg:flex-row gap-6 lg:items-center">
                  <div className="w-full lg:w-1/2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`slice-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {locations.map((loc, index) => {
                      const percent = totalPatients
                        ? Math.round((loc.count / totalPatients) * 100)
                        : 0;
                      return (
                        <div
                          key={loc.location}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-2 h-10 rounded-full"
                            style={{ backgroundColor: loc.color }}
                            aria-hidden
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-white">
                                {loc.location}
                              </p>
                              <span className="text-xs text-slate-400">
                                {percent}%
                              </span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 mt-1">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${percent}%`,
                                  background: loc.color,
                                }}
                              />
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-white/20 text-white"
                          >
                            {loc.count}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Location detail</CardTitle>
                  <CardDescription>Ranking by patient count</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {locations.map((loc) => {
                    const percent = totalPatients
                      ? Math.round((loc.count / totalPatients) * 100)
                      : 0;
                    return (
                      <div
                        key={loc.location}
                        className="border-b border-white/5 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: loc.color }}
                              aria-hidden
                            />
                            <p className="text-sm font-semibold text-white">
                              {loc.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{loc.count}</p>
                            <p className="text-xs text-slate-400">
                              {percent}% of total
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 h-2 rounded-full overflow-hidden bg-white/5">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percent}%`,
                              background: `linear-gradient(90deg, ${loc.color}, ${loc.color}CC)`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
