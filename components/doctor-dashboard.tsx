"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DoctorSidebar from "@/components/doctor-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  CheckCircle,
  Clock,
  Calendar,
  Phone,
  Users,
  Search,
  Plus,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import DoctorTestimonials from "@/components/doctor-testimonials";
import { HealthcareChat } from "@/features/messaging/components/healthcare-chat";
import DoctorSettings from "@/components/doctor-settings";
import { PatientList } from "@/features/doctor/patient";

const mockAppointments = [
  {
    id: "1",
    patientName: "John Smith",
    age: 35,
    date: "2024-12-15",
    time: "2:00 PM",
    status: "pending",
    meetLink: null,
    notes: "",
  },
  {
    id: "2",
    patientName: "Emma Wilson",
    age: 28,
    date: "2024-12-16",
    time: "10:30 AM",
    status: "confirmed",
    meetLink: "https://meet.google.com/xyz-1234-567",
    notes: "Follow-up consultation",
  },
  {
    id: "3",
    patientName: "Robert Brown",
    age: 52,
    date: "2024-12-18",
    time: "3:15 PM",
    status: "pending",
    meetLink: null,
    notes: "",
  },
];

const mockPatients = [
  {
    id: "1",
    name: "John Smith",
    age: 35,
    lastVisit: "2024-12-01",
    condition: "General Checkup",
  },
  {
    id: "2",
    name: "Emma Wilson",
    age: 28,
    lastVisit: "2024-12-10",
    condition: "Follow-up",
  },
  {
    id: "3",
    name: "Robert Brown",
    age: 52,
    lastVisit: "2024-11-25",
    condition: "Cardiology",
  },
];

const mockPrescriptions = [
  {
    id: "1",
    patient: "John Smith",
    medicine: "Aspirin",
    dosage: "100mg",
    date: "2024-12-15",
  },
  {
    id: "2",
    patient: "Emma Wilson",
    medicine: "Metformin",
    dosage: "500mg",
    date: "2024-12-14",
  },
];

interface DoctorDashboardProps {
  user: { id: string; role: "patient" | "doctor" };
  onLogout: () => void;
}

export default function DoctorDashboard({
  user,
  onLogout,
}: DoctorDashboardProps) {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<
    (typeof mockAppointments)[0] | null
  >(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const handleApprove = (appointmentId: string) => {
    setAppointments(
      appointments.map((apt) => {
        if (apt.id === appointmentId) {
          const meetLink = `https://meet.google.com/${Math.random()
            .toString(36)
            .substr(2, 11)}`;
          return { ...apt, status: "confirmed", meetLink };
        }
        return apt;
      })
    );
  };

  const handleReject = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
  };

  const handleJoinMeeting = (appointment: (typeof mockAppointments)[0]) => {
    const roomId = appointment.id;
    const patientName = appointment.patientName;
    const doctorName = "Dr. Sarah Johnson";

    router.push(
      `/meeting/${roomId}?name=${encodeURIComponent(
        doctorName
      )}&role=doctor&otherName=${encodeURIComponent(patientName)}`
    );
  };

  const pendingCount = appointments.filter(
    (apt) => apt.status === "pending"
  ).length;
  const confirmedCount = appointments.filter(
    (apt) => apt.status === "confirmed"
  ).length;

  const analyticsData = {
    totalConsultations: 156,
    thisMonth: 24,
    avgRating: 4.8,
    patientSatisfaction: 96,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex overflow-hidden">
      <DoctorSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="border-b border-white/10 bg-white/10 backdrop-blur-md shrink-0 z-30">
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {/* Menu icon hidden on desktop since sidebar is always visible */}
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  {t("nav.dashboard")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Dr. Sarah Johnson
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
              </Button>
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl p-3 sm:p-6">
                  <h3 className="text-slate-300 text-xs sm:text-sm font-medium mb-2">
                    {t("doctorDashboard.totalConsultations")}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {analyticsData.totalConsultations}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl p-3 sm:p-6">
                  <h3 className="text-slate-300 text-xs sm:text-sm font-medium mb-2">
                    {t("doctorDashboard.thisMonth")}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                    {analyticsData.thisMonth}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl p-3 sm:p-6">
                  <h3 className="text-slate-300 text-xs sm:text-sm font-medium mb-2">
                    {t("doctorDashboard.avgRating")}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
                    {analyticsData.avgRating}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl p-3 sm:p-6">
                  <h3 className="text-slate-300 text-xs sm:text-sm font-medium mb-2">
                    {t("doctorDashboard.patientSatisfaction")}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                    {analyticsData.patientSatisfaction}%
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  {t("doctorDashboard.appointmentSummary")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl p-4 sm:p-6">
                    <h3 className="text-slate-300 text-xs sm:text-sm font-medium mb-2">
                      Pending Requests
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl p-4 sm:p-6">
                    <h3 className="text-slate-300 text-xs sm:text-sm font-medium mb-2">
                      Confirmed Consultations
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                      {confirmedCount}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl p-4 sm:p-6">
                    <h3 className="text-slate-300 text-xs sm:text-sm font-medium mb-2">
                      Total Appointments
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {appointments.length}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "appointments" && (
            <section>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">
                    {t("doctorDashboard.appointments")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Manage and review all your patient appointments in one place
                  </p>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10 text-xs sm:text-sm">
                    <TabsTrigger
                      value="pending"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
                    >
                      <span className="hidden sm:inline">
                        {t("doctorDashboard.pending")}
                      </span>
                      <span className="sm:hidden">Pending</span> ({pendingCount}
                      )
                    </TabsTrigger>
                    <TabsTrigger
                      value="confirmed"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
                    >
                      <span className="hidden sm:inline">
                        {t("doctorDashboard.confirmed")}
                      </span>
                      <span className="sm:hidden">Confirmed</span> (
                      {confirmedCount})
                    </TabsTrigger>
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
                    >
                      {t("doctorDashboard.all")} ({appointments.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="pending"
                    className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
                  >
                    {appointments
                      .filter((apt) => apt.status === "pending")
                      .map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onApprove={() => handleApprove(appointment.id)}
                          onReject={() => handleReject(appointment.id)}
                          onViewDetails={() =>
                            setSelectedAppointment(appointment)
                          }
                          onJoinMeeting={() => handleJoinMeeting(appointment)}
                        />
                      ))}
                    {appointments.filter((apt) => apt.status === "pending")
                      .length === 0 && (
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl py-6 sm:py-8 text-center text-slate-300 text-sm">
                        No pending appointments
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="confirmed"
                    className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
                  >
                    {appointments
                      .filter((apt) => apt.status === "confirmed")
                      .map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onApprove={() => {}}
                          onReject={() => handleReject(appointment.id)}
                          onViewDetails={() =>
                            setSelectedAppointment(appointment)
                          }
                          onJoinMeeting={() => handleJoinMeeting(appointment)}
                          isConfirmed
                        />
                      ))}
                  </TabsContent>

                  <TabsContent
                    value="all"
                    className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
                  >
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onApprove={() => handleApprove(appointment.id)}
                        onReject={() => handleReject(appointment.id)}
                        onViewDetails={() =>
                          setSelectedAppointment(appointment)
                        }
                        onJoinMeeting={() => handleJoinMeeting(appointment)}
                      />
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          )}

          {activeTab === "patients" && <PatientList />}

          {activeTab === "prescriptions" && (
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Prescriptions
                </h2>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm py-1 sm:py-2 h-auto">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  New Prescription
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {mockPrescriptions.map((prescription) => (
                  <Card
                    key={prescription.id}
                    className="border-border bg-card hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="p-3 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base sm:text-lg">
                            {prescription.medicine}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm">
                            Patient: {prescription.patient}
                          </CardDescription>
                        </div>
                        <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 whitespace-nowrap">
                          Active
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <p className="text-muted-foreground">Dosage</p>
                          <p className="font-semibold text-foreground">
                            {prescription.dosage}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Date Prescribed
                          </p>
                          <p className="font-semibold text-foreground">
                            {prescription.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <Button
                          variant="outline"
                          className="border-border text-foreground hover:bg-secondary bg-transparent text-xs sm:text-sm flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="border-border text-foreground hover:bg-secondary bg-transparent text-xs sm:text-sm flex-1"
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {activeTab === "messaging" && (
            <HealthcareChat
              onStartNewConversation={() => setActiveTab("patients")}
            />
          )}

          {activeTab === "settings" && <DoctorSettings />}

          {activeTab === "help" && <DoctorTestimonials />}
        </div>
      </main>

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border">
            <CardHeader className="relative">
              <CardTitle>Patient Details</CardTitle>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Patient Name</p>
                <p className="font-semibold text-foreground">
                  {selectedAppointment.patientName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-semibold text-foreground">
                  {selectedAppointment.age} years
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Appointment Date & Time
                </p>
                <p className="font-semibold text-foreground">
                  {selectedAppointment.date} at {selectedAppointment.time}
                </p>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-foreground">{selectedAppointment.notes}</p>
                </div>
              )}
              <Button
                onClick={() => setSelectedAppointment(null)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface AppointmentCardProps {
  appointment: (typeof mockAppointments)[0];
  onApprove: () => void;
  onReject: () => void;
  onViewDetails: () => void;
  onJoinMeeting?: () => void;
  isConfirmed?: boolean;
}

function AppointmentCard({
  appointment,
  onApprove,
  onReject,
  onViewDetails,
  onJoinMeeting,
  isConfirmed,
}: AppointmentCardProps) {
  return (
    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
      <CardHeader className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-base sm:text-lg">
              {appointment.patientName}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Age: {appointment.age}
            </CardDescription>
          </div>
          <span
            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              appointment.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {appointment.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 shrink-0" />
            {appointment.date}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 shrink-0" />
            {appointment.time}
          </div>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          {isConfirmed && appointment.meetLink && onJoinMeeting && (
            <Button
              onClick={onJoinMeeting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Join Call</span>
              <span className="sm:hidden">Join</span>
            </Button>
          )}

          <Button
            onClick={onViewDetails}
            variant="outline"
            className={`${
              isConfirmed && appointment.meetLink && onJoinMeeting
                ? "flex-1"
                : "flex-1"
            } border-border text-foreground hover:bg-secondary bg-transparent text-xs sm:text-sm py-1.5 sm:py-2 h-auto`}
          >
            Details
          </Button>

          {!isConfirmed && (
            <>
              <Button
                onClick={onApprove}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Approve</span>
                <span className="sm:hidden">OK</span>
              </Button>
              <Button
                onClick={onReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
