"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PatientSidebar from "@/components/patient-sidebar";
import PatientConsultations from "@/components/patient-consultations";
import PatientPrescriptions from "@/components/patient-prescriptions";
import PatientMedicalRecords from "@/components/patient-medical-records";
import PatientMessages from "@/components/patient-messages";
import PatientSettings from "@/components/patient-settings";
import PatientHelp from "@/components/patient-help";
import PatientDemographics from "@/components/patient-demographics";
import DoctorRatings from "@/components/doctor-ratings";
import { HealthcareChat } from "@/features/messaging/components/healthcare-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  Search,
  Plus,
  Calendar,
  Clock,
  Star,
  Menu,
} from "lucide-react";
import ConsultationModal from "@/components/consultation-modal";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";

const mockDoctors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    rating: 4.8,
    reviews: 234,
    available: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    rating: 4.9,
    reviews: 189,
    available: true,
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    specialty: "Dermatology",
    rating: 4.7,
    reviews: 156,
    available: false,
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Neurology",
    rating: 4.6,
    reviews: 142,
    available: true,
  },
];

const mockBookings = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    date: "2024-12-15",
    time: "2:00 PM",
    status: "confirmed",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    specialty: "Cardiology",
    date: "2024-12-18",
    time: "4:30 PM",
    status: "pending",
    meetLink: null,
  },
];

interface PatientDashboardProps {
  user: { id: string; role: "patient" | "doctor" };
  onLogout: () => void;
}

export default function PatientDashboard({
  user,
  onLogout,
}: PatientDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof mockDoctors)[0] | null
  >(null);
  const [bookings, setBookings] = useState(mockBookings);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const filteredDoctors = mockDoctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookConsultation = (doctor: (typeof mockDoctors)[0]) => {
    setSelectedDoctor(doctor);
  };

  const handleConfirmBooking = (date: string, time: string) => {
    const meetLink = `https://meet.google.com/${Math.random()
      .toString(36)
      .substr(2, 11)}`;
    const newBooking = {
      id: `${Date.now()}`,
      doctorName: selectedDoctor!.name,
      specialty: selectedDoctor!.specialty,
      date,
      time,
      status: "pending" as const,
      meetLink,
    };
    setBookings([...bookings, newBooking]);
    setSelectedDoctor(null);
  };

  const handleJoinMeeting = (booking: (typeof bookings)[0]) => {
    const roomId = booking.id;
    const doctorName = booking.doctorName;
    const userName = "Patient";

    router.push(
      `/meeting/${roomId}?name=${encodeURIComponent(
        userName
      )}&role=patient&otherName=${encodeURIComponent(doctorName)}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex overflow-hidden">
      {/* SIDEBAR CONTAINER - Fixed, always independent */}
      <PatientSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT CONTAINER - Fully independent and scrollable */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="border-b border-white/10 bg-white/10 backdrop-blur-md flex-shrink-0 z-30">
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  {t("nav.dashboard")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  {t("dashboard.welcome")}, Patient
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-white/5 text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t("general.logout")}</span>
                <span className="sm:hidden">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6 sm:space-y-8">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  {t("dashboard.yourConsultations")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl overflow-hidden hover:bg-white/15 transition-all"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white">
                              {booking.doctorName}
                            </h3>
                            <p className="text-slate-300 text-xs sm:text-sm">
                              {booking.specialty}
                            </p>
                          </div>
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              booking.status === "confirmed"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm mb-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            {booking.date}
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            {booking.time}
                          </div>
                        </div>
                        {booking.meetLink && (
                          <Button
                            onClick={() => handleJoinMeeting(booking)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2 sm:py-2.5"
                          >
                            {t("dashboard.joinConsultation")}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {t("dashboard.browseDoctors")}
                  </h2>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 sm:py-2 h-auto">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">
                      {t("dashboard.scheduleNew")}
                    </span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl overflow-hidden hover:bg-white/15 transition-all flex flex-col"
                    >
                      <div className="bg-gradient-to-r from-blue-600/20 to-blue-400/10 p-3 sm:p-4 border-b border-white/10">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm sm:text-lg font-bold text-white">
                              {doctor.name}
                            </h3>
                            <p className="text-slate-300 text-xs sm:text-sm">
                              {doctor.specialty}
                            </p>
                          </div>
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base flex-shrink-0 ${
                              doctor.available
                                ? "bg-emerald-600"
                                : "bg-slate-500"
                            }`}
                          >
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                          <span className="font-semibold text-white text-sm">
                            {doctor.rating}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({doctor.reviews} {t("dashboard.reviews")})
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">
                            {t("dashboard.status")}:{" "}
                            <span
                              className={
                                doctor.available
                                  ? "text-emerald-400 font-semibold"
                                  : "text-slate-500"
                              }
                            >
                              {doctor.available
                                ? t("dashboard.available")
                                : t("dashboard.unavailable")}
                            </span>
                          </p>
                        </div>
                        <Button
                          onClick={() => handleBookConsultation(doctor)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2 mt-auto"
                          disabled={!doctor.available}
                        >
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {t("dashboard.bookConsultation")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "consultations" && <PatientConsultations />}
          {activeTab === "prescriptions" && <PatientPrescriptions />}
          {activeTab === "medical" && <PatientMedicalRecords />}
          {activeTab === "demographics" && <PatientDemographics />}
          {activeTab === "ratings" && <DoctorRatings />}
          {activeTab === "messaging" && (
            <HealthcareChat
              onStartNewConversation={() => setActiveTab("dashboard")}
            />
          )}
          {activeTab === "settings" && <PatientSettings />}
          {activeTab === "help" && <PatientHelp />}
        </main>
      </div>

      {selectedDoctor && (
        <ConsultationModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
