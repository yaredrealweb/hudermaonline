"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pill, Download, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockPrescriptions = [
  {
    id: "1",
    name: "Aspirin",
    dosage: "100mg",
    frequency: "Once daily",
    doctor: "Dr. Sarah Johnson",
    status: "active",
    startDate: "2024-12-01",
    endDate: "2025-03-01",
  },
  {
    id: "2",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    doctor: "Dr. Michael Chen",
    status: "active",
    startDate: "2024-11-15",
    endDate: "2025-02-15",
  },
  {
    id: "3",
    name: "Vitamin D",
    dosage: "2000 IU",
    frequency: "Once daily",
    doctor: "Dr. Sarah Johnson",
    status: "expired",
    startDate: "2024-09-01",
    endDate: "2024-12-01",
  },
]

export default function PatientPrescriptions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Prescriptions</h2>
        <p className="text-muted-foreground">View and manage your active prescriptions</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-3 bg-secondary">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Expired
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {mockPrescriptions
            .filter((p) => p.status === "active")
            .map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4 mt-6">
          {mockPrescriptions
            .filter((p) => p.status === "expired")
            .map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {mockPrescriptions.map((prescription) => (
            <PrescriptionCard key={prescription.id} prescription={prescription} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PrescriptionCard({ prescription }: { prescription: (typeof mockPrescriptions)[0] }) {
  return (
    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Pill className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{prescription.name}</CardTitle>
              <CardDescription>Prescribed by {prescription.doctor}</CardDescription>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              prescription.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {prescription.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Dosage</p>
            <p className="font-semibold text-foreground">{prescription.dosage}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Frequency</p>
            <p className="font-semibold text-foreground">{prescription.frequency}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Valid Until</p>
            <p className="font-semibold text-foreground">{prescription.endDate}</p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3 border border-border text-sm">
          <p className="text-muted-foreground">Started: {prescription.startDate}</p>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
