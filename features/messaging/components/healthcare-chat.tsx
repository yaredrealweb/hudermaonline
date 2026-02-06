"use client";

import { useEffect, useRef, useState } from "react";
import { ConversationList } from "./conversation-list";
import { ChatArea } from "./chat-area";
import {
  useGetConversations,
  useGetOrCreateConversation,
} from "@/hooks/use-messages";
import { useGetProfile } from "@/hooks/use-auth-mutation";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface HealthcareChatProps {
  onStartNewConversation?: () => void;
  initialDoctorId?: string;
}

export function HealthcareChat({
  onStartNewConversation,
  initialDoctorId,
}: HealthcareChatProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >();

  const { data: currentUser } = useGetProfile();

  const utils = trpc.useUtils();

  const { data: conversations = [] } = useGetConversations();

  const startConversationMutation = useGetOrCreateConversation();

  const attemptedDoctorIdRef = useRef<string | null>(null);

  // If a doctorId is provided (from query string) select existing conversation or create a new one.
  useEffect(() => {
    if (!initialDoctorId) return;

    const existingConv = conversations.find(
      (c) => c.doctor.id === initialDoctorId || c.patient.id === initialDoctorId
    );

    if (existingConv) {
      setSelectedConversationId(existingConv.id);
      attemptedDoctorIdRef.current = initialDoctorId;
      return;
    }

    if (attemptedDoctorIdRef.current === initialDoctorId) return;

    attemptedDoctorIdRef.current = initialDoctorId;

    startConversationMutation.mutate(
      { userId: initialDoctorId },
      {
        onSuccess: async (conv) => {
          setSelectedConversationId(conv.id);
          await utils.messages.getConversations.invalidate();
        },
        onError: () => {
          attemptedDoctorIdRef.current = null;
        },
      }
    );
  }, [initialDoctorId, conversations, startConversationMutation, utils]);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="flex h-full bg-slate-900 border border-border rounded-xl shadow-xl">
      <div
        className={cn(
          "w-full sm:w-80 flex flex-col border-r border-border bg-slate-800",
          selectedConversationId ? "hidden sm:flex" : "flex"
        )}
      >
        <ConversationList
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </div>

      <div
        className={cn(
          "flex-1 bg-slate-900",
          selectedConversationId ? "flex" : "hidden sm:flex"
        )}
      >
        {selectedConversation ? (
          <ChatArea
            conversation={{
              id: selectedConversation.id,
              doctor: {
                id: selectedConversation.doctor.id,
                name: selectedConversation.doctor.name,
                image: selectedConversation.doctor.image ?? "",
                specialty: selectedConversation.doctor.specialty ?? "",
              },
              patient: {
                id: selectedConversation.patient.id,
                name: selectedConversation.patient.name,
                image: selectedConversation.patient.image ?? "",
              },
            }}
            currentUserId={currentUser?.id ?? ""}
            onClose={() => setSelectedConversationId(undefined)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground bg-slate-900">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Select a conversation
              </h2>
              <p className="text-slate-400">
                Choose a conversation from the list or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
