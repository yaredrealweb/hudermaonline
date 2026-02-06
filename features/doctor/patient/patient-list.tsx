"use client";

import { useGetPatients } from "@/hooks/use-auth-mutation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function PatientList() {
  const { data: patients, isLoading } = useGetPatients();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredPatients =
    patients?.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Patients</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search patients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
        />
      </div>

      <div className="grid gap-4">
        {filteredPatients.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No patients found
              </h3>
              <p className="text-slate-400 max-w-sm">
                {searchTerm
                  ? "No patients match your current search criteria."
                  : "You don't have any patients associated with you yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
            >
              <CardHeader className="p-4 sm:p-6 pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white font-semibold">
                        {patient.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {patient.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    View Records
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5 mt-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="text-sm text-slate-200">
                      {patient.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Gender
                    </p>
                    <p className="text-sm text-slate-200 capitalize">
                      {patient.gender || "Not specified"}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Last Seen
                    </p>
                    <p className="text-sm text-slate-200">Just now</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
