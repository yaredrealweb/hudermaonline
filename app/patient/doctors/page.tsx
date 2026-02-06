"use client";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, MapPin, GraduationCap } from "lucide-react";
import React from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export default function DoctorDiscoveryPage() {
  const { data: doctors, isLoading } = trpc.user.listDoctors.useQuery();
  const [search, setSearch] = React.useState("");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  const filteredDoctors = doctors?.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 sm:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Find Your Doctor
            </h1>
            <p className="text-white/60 mt-2 text-lg">
              Book consultations with top-rated medical specialists.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border-white/10 pl-11 h-12 rounded-2xl focus:ring-blue-500"
            />
          </div>
        </div>

        {filteredDoctors && filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const ratingCount = doc.ratingCount ?? 0;
              const averageRating = doc.averageRating ?? 0;
              const hasRatings = ratingCount > 0;

              return (
                <Card
                  key={doc.id}
                  className="bg-white/5 border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all duration-300 rounded-3xl overflow-hidden border"
                >
                  <CardHeader className="p-6 pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold border border-white/10 shadow-lg">
                        {doc.name[0]}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                          {doc.name}
                        </CardTitle>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20 mt-1">
                          {doc.specialty || "General Practitioner"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {hasRatings ? (
                          <span>
                            {Number(averageRating).toFixed(1)} ({ratingCount}{" "}
                            review
                            {ratingCount === 1 ? "" : "s"})
                          </span>
                        ) : (
                          <span>No ratings yet</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>Addis Ababa</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
                        <GraduationCap className="w-3 h-3" />
                        Experience
                      </div>
                      <p className="text-white/80 text-sm line-clamp-2">
                        Clinical expert with over 10 years of experience in
                        specialized healthcare.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link href={`/patient/doctors/${doc.id}/availability`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                          Book Consultation
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <Search className="h-12 w-12 mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-medium text-white">No doctors found</h3>
            <p className="text-white/40 mt-2">
              Try adjusting your search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
