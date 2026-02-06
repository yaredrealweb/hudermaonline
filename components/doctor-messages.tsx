"use client";

import { useState } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language-context";

interface Message {
  id: string;
  patientName: string;
  patientId: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatar: string;
}

interface ChatMessage {
  id: string;
  sender: "doctor" | "patient";
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export default function DoctorMessages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const { t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      patientName: "John Doe",
      patientId: "p1",
      lastMessage: "Thank you doctor, I'll follow your advice",
      timestamp: "10:30 AM",
      unread: false,
      avatar: "JD",
    },
    {
      id: "2",
      patientName: "Sarah Ahmed",
      patientId: "p2",
      lastMessage: "I have some questions about my medication",
      timestamp: "2:15 PM",
      unread: true,
      avatar: "SA",
    },
    {
      id: "3",
      patientName: "Michael Chen",
      patientId: "p3",
      lastMessage: "Feeling better after the treatment",
      timestamp: "Yesterday",
      unread: false,
      avatar: "MC",
    },
    {
      id: "4",
      patientName: "Emily Watson",
      patientId: "p4",
      lastMessage: "Can I get a refill on my prescription?",
      timestamp: "Yesterday",
      unread: false,
      avatar: "EW",
    },
  ]);

  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >({
    "1": [
      {
        id: "1",
        sender: "patient",
        content:
          "Hello doctor, I wanted to follow up on my recent test results",
        timestamp: "10:15 AM",
        status: "read",
      },
      {
        id: "2",
        sender: "doctor",
        content:
          "Hi John! Your results look good. Keep following the treatment plan.",
        timestamp: "10:20 AM",
        status: "read",
      },
      {
        id: "3",
        sender: "patient",
        content: "Thank you doctor, I'll follow your advice",
        timestamp: "10:30 AM",
        status: "read",
      },
    ],
    "2": [
      {
        id: "1",
        sender: "patient",
        content: "I have some questions about my medication",
        timestamp: "2:15 PM",
        status: "delivered",
      },
    ],
  });

  const selectedChatData = selectedChat
    ? messages.find((m) => m.id === selectedChat)
    : null;
  const filteredMessages = messages.filter(
    (msg) =>
      msg.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}`,
      sender: "doctor",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedChat!]: [...(prev[selectedChat!] || []), newMessage],
    }));

    setMessageText("");

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedChat
          ? {
              ...msg,
              lastMessage: messageText,
              timestamp: "Just now",
              unread: false,
            }
          : msg
      )
    );
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-4 sm:gap-6">
      {/* Messages List */}
      <div className="w-full md:w-80 flex flex-col border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md">
        <div className="p-4 sm:p-6 border-b border-white/20 shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Patient Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/15 focus:border-blue-400 text-sm"
            />
          </div>
        </div>

        {/* Messages List Container */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              No conversations found
            </div>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedChat(message.id)}
                className={`w-full p-3 sm:p-4 border-b border-white/10 hover:bg-white/10 transition-colors text-left ${
                  selectedChat === message.id
                    ? "bg-blue-600/20 border-blue-500/30"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-white truncate">
                        {message.patientName}
                      </p>
                      <p className="text-xs text-slate-400 shrink-0">
                        {message.timestamp}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {message.lastMessage}
                    </p>
                  </div>
                  {message.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChatData ? (
        <div className="hidden md:flex flex-1 flex-col border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md">
          {/* Chat Header */}
          <div className="p-4 sm:p-6 border-b border-white/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shrink-0">
                {selectedChatData.avatar}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {selectedChatData.patientName}
                </p>
                <p className="text-xs text-slate-400">
                  Patient ID: {selectedChatData.patientId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <Video className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {chatMessages[selectedChat!]?.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "doctor" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "doctor"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-slate-200 border border-white/20"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <p className="text-xs opacity-70">{msg.timestamp}</p>
                    {msg.sender === "doctor" && (
                      <>
                        {msg.status === "read" && (
                          <CheckCheck className="w-3 h-3" />
                        )}
                        {msg.status === "delivered" && (
                          <Check className="w-3 h-3" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 border-t border-white/20 shrink-0 bg-white/5">
            <div className="flex gap-2 sm:gap-3">
              <Input
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/15 focus:border-blue-400"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md items-center justify-center text-slate-400">
          <MessageSquare className="w-16 h-16 opacity-30 mb-4" />
          <p>Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
}
