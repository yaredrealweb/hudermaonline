"use client";

import { Suspense } from "react";
import { HealthcareChat } from "@/features/messaging/components/healthcare-chat";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  return (
    <Suspense fallback={<main className="w-full h-screen" />}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId") || undefined;

  return (
    <main className="w-full h-screen">
      <HealthcareChat
        initialDoctorId={doctorId}
        onStartNewConversation={() => {
          console.log("Start new conversation");
        }}
      />
    </main>
  );
}
