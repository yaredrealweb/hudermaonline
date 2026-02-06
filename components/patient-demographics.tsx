"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp, BarChart3 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface PatientLocation {
  region: string;
  city: string;
  patientCount: number;
  percentage: number;
  color: string;
  description: string;
}

const ethiopianRegions: PatientLocation[] = [
  {
    region: "Addis Ababa",
    city: "Capital City",
    patientCount: 156,
    percentage: 28,
    color: "from-blue-400 to-blue-600",
    description: "Central Urban Hub",
  },
  {
    region: "Dire Dawa",
    city: "Eastern Hub",
    patientCount: 98,
    percentage: 18,
    color: "from-purple-400 to-purple-600",
    description: "Industrial & Trade Center",
  },
  {
    region: "Awassa",
    city: "Southern Region",
    patientCount: 82,
    percentage: 15,
    color: "from-emerald-400 to-emerald-600",
    description: "Sidamo Region Capital",
  },
  {
    region: "Harar",
    city: "Eastern Region",
    patientCount: 67,
    percentage: 12,
    color: "from-yellow-400 to-yellow-600",
    description: "Historic City",
  },
  {
    region: "Adama",
    city: "Central-Eastern",
    patientCount: 56,
    percentage: 10,
    color: "from-orange-400 to-orange-600",
    description: "Oromia Region",
  },
  {
    region: "Bahir Dar",
    city: "Northern Region",
    patientCount: 40,
    percentage: 7,
    color: "from-cyan-400 to-cyan-600",
    description: "Amhara Region Capital",
  },
  {
    region: "Mekelle",
    city: "Northern Highlands",
    patientCount: 28,
    percentage: 5,
    color: "from-pink-400 to-pink-600",
    description: "Tigray Region Capital",
  },
  {
    region: "Jimma",
    city: "South-Western",
    patientCount: 21,
    percentage: 5,
    color: "from-indigo-400 to-indigo-600",
    description: "Coffee Region",
  },
];

export default function PatientDemographics() {
  const { t } = useLanguage();
  const totalPatients = ethiopianRegions.reduce(
    (sum, region) => sum + region.patientCount,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Patient Geographic Distribution
        </h2>
        <p className="text-slate-400">Patients by region across Ethiopia</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-linear-to-br from-blue-500/10 to-blue-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-white">{totalPatients}</p>
              </div>
              <Users className="w-12 h-12 text-blue-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-linear-to-br from-emerald-500/10 to-emerald-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Regions Covered</p>
                <p className="text-3xl font-bold text-white">
                  {ethiopianRegions.length}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-emerald-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-linear-to-br from-purple-500/10 to-purple-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Growth This Month</p>
                <p className="text-3xl font-bold text-white">
                  <span className="text-emerald-400">+12</span>%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-400 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regions List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Regional Breakdown</CardTitle>
          <CardDescription>
            Detailed patient distribution by Ethiopian region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ethiopianRegions.map((region, index) => (
              <div
                key={index}
                className="border-b border-border last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">
                        {region.region}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-xs border-slate-600 text-slate-300"
                      >
                        {region.city}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {region.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {region.patientCount}
                    </p>
                    <p className="text-xs text-slate-400">
                      {region.percentage}% of total
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-linear-to-r ${region.color} transition-all duration-500`}
                    style={{ width: `${region.percentage * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Details Cards */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Detailed Regional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ethiopianRegions.map((region, index) => (
            <Card
              key={index}
              className={`border border-slate-700 bg-linear-to-br from-slate-800 to-slate-900 hover:border-primary/50 transition-all`}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        {region.region}
                      </h4>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {region.city}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-lg bg-linear-to-br ${region.color} opacity-20`}
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Patients:</span>
                      <span className="font-semibold text-white">
                        {region.patientCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">
                        Percentage:
                      </span>
                      <span className="font-semibold text-white">
                        {region.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Category:</span>
                      <Badge variant="secondary" className="text-xs">
                        {region.percentage >= 20
                          ? "Primary"
                          : region.percentage >= 10
                          ? "Secondary"
                          : "Growing"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map-like visualization */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Distribution Heat Map</CardTitle>
          <CardDescription>
            Visual representation of patient concentration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ethiopianRegions
              .sort((a, b) => b.patientCount - a.patientCount)
              .map((region, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-32 shrink-0">
                    <p className="text-sm font-medium text-white truncate">
                      {region.region}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden flex items-center">
                      <div
                        className={`h-full bg-linear-to-r ${region.color} flex items-center justify-end pr-2 transition-all duration-500`}
                        style={{
                          width: `${
                            (region.patientCount /
                              ethiopianRegions[0].patientCount) *
                            100
                          }%`,
                        }}
                      >
                        {region.percentage >= 15 && (
                          <span className="text-xs font-semibold text-white">
                            {region.patientCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <p className="text-sm font-semibold text-white">
                      {region.percentage}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
