"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Search, MessageCircle } from "lucide-react";
import { useGetConversations } from "@/hooks/use-messages";

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [], isLoading } = useGetConversations();

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.otherUser;
    const searchLower = searchQuery.toLowerCase();
    return (
      otherUser.name.toLowerCase().includes(searchLower) ||
      (otherUser.specialty?.toLowerCase().includes(searchLower) ?? false) ||
      (conv.lastMessage?.content.toLowerCase().includes(searchLower) ?? false)
    );
  });

  return (
    <div className="flex flex-col h-full bg-slate-800 border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3 text-card-foreground">
          Messages
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <MessageCircle className="h-5 w-5 mr-2 animate-pulse" />
            Loading conversations...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-4">
            <MessageCircle className="h-8 w-8 mb-2 opacity-50" />
            <p>
              {conversations.length === 0
                ? "No conversations yet"
                : "No matching conversations"}
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredConversations.map((conv) => {
              const otherUser = conv.otherUser;
              const isSelected = selectedConversationId === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors border-b border-border/50 hover:bg-muted",
                    isSelected && "bg-primary/10 border-primary"
                  )}
                >
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage
                        src={otherUser.image || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {otherUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-sm truncate text-card-foreground">
                          {otherUser.name}
                        </h3>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(
                            new Date(conv.lastMessageAt ?? ""),
                            {
                              addSuffix: false,
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
