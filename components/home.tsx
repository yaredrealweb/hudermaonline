"use client";

import { EnhancedSignInWrapper } from "@/components/enhanced-sign-in-wrapper";
import PatientDashboard from "@/components/patient-dashboard";
import DoctorDashboard from "@/components/doctor-dashboard";
import { useState } from "react";

export function Home() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: "patient" | "doctor";
  } | null>(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (currentUser?.role === "patient") {
    return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentUser?.role === "doctor") {
    return <DoctorDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return <EnhancedSignInWrapper onAuth={setCurrentUser} />;
}
