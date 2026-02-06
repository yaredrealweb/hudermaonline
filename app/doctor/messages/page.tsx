"use client";

import { HealthcareChat } from "@/features/messaging/components/healthcare-chat";

export default function MessagesPage() {
  return (
    <main className="w-full h-screen">
      <HealthcareChat
        onStartNewConversation={() => {
          console.log("Start new conversation");
        }}
      />
    </main>
  );
}
