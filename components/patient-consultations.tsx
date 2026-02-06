"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Calendar, Clock, Download, MessageSquare } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockConsultations = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    date: "2024-12-15",
    time: "2:00 PM",
    status: "confirmed",
    meetLink: "https://meet.google.com/abc-defg-hij",
    notes: "Regular checkup and health assessment",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    specialty: "Cardiology",
    date: "2024-12-18",
    time: "4:30 PM",
    status: "pending",
    meetLink: null,
    notes: "Heart condition follow-up",
  },
  {
    id: "3",
    doctorName: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    date: "2024-12-10",
    time: "11:00 AM",
    status: "completed",
    meetLink: "https://meet.google.com/xyz-1234-567",
    notes: "Routine health checkup",
  },
]

export default function PatientConsultations() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">My Consultations</h2>
        <p className="text-muted-foreground">Manage and track all your consultations with doctors</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {mockConsultations
            .filter((c) => c.status !== "completed")
            .map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} />
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {mockConsultations
            .filter((c) => c.status === "completed")
            .map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} />
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {mockConsultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ConsultationCard({ consultation }: { consultation: (typeof mockConsultations)[0] }) {
  return (
    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{consultation.doctorName}</CardTitle>
            <CardDescription>{consultation.specialty}</CardDescription>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              consultation.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : consultation.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {consultation.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {consultation.date}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            {consultation.time}
          </div>
        </div>

        {consultation.notes && (
          <div className="bg-secondary/50 rounded-lg p-3 border border-border">
            <p className="text-sm text-foreground">{consultation.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          {consultation.status === "confirmed" && (
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <a href={consultation.meetLink} target="_blank" rel="noopener noreferrer">
                <Video className="w-4 h-4 mr-2" />
                Join Consultation
              </a>
            </Button>
          )}
          {consultation.status === "completed" && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Summary
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </>
          )}
          {consultation.status === "pending" && (
            <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-sm text-yellow-800 font-medium">Awaiting doctor approval</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
