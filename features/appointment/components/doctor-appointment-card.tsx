"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDoctorAvailability } from "@/hooks/use-doctor-availability";
import { useLanguage } from "@/lib/language-context";
import { Calendar as CalendarIcon, Plus, Search, Star } from "lucide-react";
import React from "react";

function DoctorAppointmentCardList() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data, isLoading } = useGetDoctorAvailability();

  return (
    <section>
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2 ">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {t("dashboard.browseDoctors")}
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 sm:py-2 h-auto">
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t("dashboard.scheduleNew")}</span>
          <span className="sm:hidden">Schedule</span>
        </Button>
      </div>

      <div className="mb-4 sm:mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder={t("messages.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/15 focus:border-blue-400 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : data?.docAv.length === 0 ? (
        <div>
          <p className="text-center text-slate-400">
            There is no available doctor appointments at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {data?.docAv.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl overflow-hidden hover:bg-white/15 transition-all flex flex-col"
            >
              <div className="bg-linear-to-r from-blue-600/20 to-blue-400/10 p-3 sm:p-4 border-b border-white/10">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-white">
                      {doctor.doctorName}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      {doctor.specialty}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base shrink-0 ${
                      doctor.isBooked ? "bg-emerald-600" : "bg-slate-500"
                    }`}
                  >
                    {doctor.doctorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                  <span className="font-semibold text-white text-sm">
                    {doctor.averageRating}
                  </span>
                  {/* <span className="text-xs text-slate-400">
                  ({doctor.ratingCount} {t("dashboard.reviews")})
                </span> */}
                </div>
                <div>
                  <p className="text-xs text-slate-400">
                    {t("dashboard.status")}:{" "}
                    <span
                      className={
                        doctor.isBooked
                          ? "text-emerald-400 font-semibold"
                          : "text-slate-500"
                      }
                    >
                      {doctor.isBooked
                        ? t("dashboard.available")
                        : t("dashboard.unavailable")}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={() => {}}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2 mt-auto"
                  disabled={!doctor.isBooked}
                >
                  <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {t("dashboard.bookConsultation")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default DoctorAppointmentCardList;
