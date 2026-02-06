"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Search } from "lucide-react"
import { useState } from "react"

const mockConversations = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    lastMessage: "Please take the medication as prescribed",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    lastMessage: "Your test results look good",
    timestamp: "1 day ago",
    unread: false,
  },
]

const mockMessages = [
  {
    id: "1",
    sender: "doctor",
    message: "Please take the medication as prescribed",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    sender: "patient",
    message: "Sure doctor, thank you for the guidance",
    timestamp: "1 hour ago",
  },
]

export default function PatientMessages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Messages</h2>
        <p className="text-muted-foreground">Communicate with your doctors</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            {mockConversations.map((conv) => (
              <Card
                key={conv.id}
                className={`border-border cursor-pointer transition-all ${
                  selectedConversation === conv.id ? "bg-primary/10 border-primary/30" : "bg-card hover:bg-secondary"
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{conv.doctorName}</CardTitle>
                      <CardDescription className="truncate">{conv.lastMessage}</CardDescription>
                    </div>
                    {conv.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="border-border bg-card h-full flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle>Dr. Sarah Johnson</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
                {mockMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === "patient"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground border border-border"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border-border bg-card h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
