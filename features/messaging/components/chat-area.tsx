"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { format, isToday, isYesterday } from "date-fns";
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useConversationMessages,
  useMarkMessagesRead,
  useSendMessage,
} from "@/hooks/use-messages";

interface Conversation {
  id: string;
  doctor: { id: string; name: string; image?: string; specialty?: string };
  patient: { id: string; name: string; image?: string };
}

interface ChatAreaProps {
  conversation: Conversation;
  currentUserId: string;
  onClose?: () => void;
}

export function ChatArea({
  conversation,
  currentUserId,
  onClose,
}: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastReadMessageIdRef = useRef<string>("");

  const otherPerson =
    conversation.doctor.id === currentUserId
      ? conversation.patient
      : conversation.doctor;
  const otherPersonSpecialty =
    conversation.doctor.id === currentUserId
      ? undefined
      : conversation.doctor.specialty;

  const utils = trpc.useUtils();

  const { data: messagesData, isLoading } = useConversationMessages(
    conversation.id,
    50
  );

  const messages =
    messagesData?.pages.flatMap(
      (page: any) => page.items ?? page.messages ?? []
    ) ?? [];

  const sendMessageMutation = useSendMessage();

  const markAsReadMutation = useMarkMessagesRead();

  // Mark unread messages as read
  useEffect(() => {
    const unreadMessageIds = messages
      .filter((m) => !m.isRead && m.senderId !== currentUserId && !!m.id)
      .map((m) => m.id as string);

    if (
      unreadMessageIds.length > 0 &&
      lastReadMessageIdRef.current !==
        unreadMessageIds[unreadMessageIds.length - 1]
    ) {
      lastReadMessageIdRef.current =
        unreadMessageIds[unreadMessageIds.length - 1];
      markAsReadMutation.mutate({ messageIds: unreadMessageIds });
    }
  }, [messages, currentUserId, markAsReadMutation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: conversation.id,
        content: inputValue,
        type: "TEXT",
      });
      setInputValue("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [inputValue, conversation.id, sendMessageMutation, utils.messages]);

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  const parseDate = (value: Date | string | number | undefined | null) => {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const groupMessagesByDate = useCallback(() => {
    const groups: { [key: string]: typeof messages } = {};
    messages.forEach((msg) => {
      const dateObj = parseDate(msg.createdAt);
      const key = dateObj ? format(dateObj, "yyyy-MM-dd") : "unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
    });
    return groups;
  }, [messages]);

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border ">
        <div className="flex items-center gap-2 sm:gap-3">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden h-8 w-8 -ml-2"
              onClick={onClose}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherPerson.image || "/placeholder.svg"} />
            <AvatarFallback>{otherPerson.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-sm sm:text-base text-card-foreground">
              {otherPerson.name}
            </h2>
            {otherPersonSpecialty && (
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {otherPersonSpecialty}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Appointment History</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-4 bg-slate-900  ">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={otherPerson.image || "/placeholder.svg"} />
                <AvatarFallback>{otherPerson.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <h3 className="font-semibold mb-1">
              Start conversation with {otherPerson.name}
            </h3>
            <p className="text-sm">
              This is the beginning of your conversation
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(messageGroups).map(([date, groupMessages]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground px-2">
                    {formatMessageTime(
                      parseDate(groupMessages[0].createdAt) ?? new Date()
                    )}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="space-y-2">
                  {groupMessages.map((msg) => {
                    const isSender = msg.senderId === currentUserId;

                    return (
                      <div
                        key={msg.id ?? `${msg.createdAt}`}
                        className={cn(
                          "flex gap-3",
                          isSender && "flex-row-reverse"
                        )}
                      >
                        {!isSender && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage
                              src={msg.sender?.image || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {msg.sender?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            "max-w-xs lg:max-w-md",
                            isSender && "flex-row-reverse flex"
                          )}
                        >
                          <div
                            className={cn(
                              "px-4 py-2 rounded-lg",
                              isSender
                                ? "bg-primary text-primary-foreground rounded-br-none"
                                : "bg-muted text-muted-foreground rounded-bl-none"
                            )}
                          >
                            <p className="text-sm wrap-break-word">
                              {msg.content}
                            </p>
                            {msg.editedAt && (
                              <p className="text-xs opacity-70 mt-1">
                                (edited)
                              </p>
                            )}
                          </div>

                          <div
                            className={cn(
                              "flex items-end gap-1 px-2 text-xs text-muted-foreground",
                              isSender && "flex-row-reverse"
                            )}
                          >
                            <span>
                              {format(
                                parseDate(msg.createdAt) ?? new Date(),
                                "h:mm a"
                              )}
                            </span>
                            {isSender &&
                              (msg.isRead ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      <div className="px-6 py-4 border-t border-border bg-slate-900">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>

          <Input
            ref={inputRef}
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={sendMessageMutation.isPending}
            className="flex-1"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || sendMessageMutation.isPending}
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
