"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, TrendingUp, Pill, CheckCircle, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const mockLabReports = [
  {
    id: "1",
    name: "Complete Blood Count",
    date: "2024-12-01",
    doctor: "Dr. Sarah Johnson",
    status: "normal",
  },
  {
    id: "2",
    name: "Lipid Panel",
    date: "2024-11-15",
    doctor: "Dr. Michael Chen",
    status: "normal",
  },
]

const mockMedicalHistory = [
  {
    id: "1",
    condition: "Hypertension",
    status: "ongoing",
    startDate: "2022-03-15",
    notes: "Managed with medication",
  },
  {
    id: "2",
    condition: "Type 2 Diabetes",
    status: "ongoing",
    startDate: "2021-06-20",
    notes: "Regular monitoring required",
  },
  {
    id: "3",
    condition: "Allergies",
    status: "seasonal",
    startDate: "2020-01-10",
    notes: "Pollen and dust allergies",
  },
]

const mockDocuments = [
  {
    id: "1",
    name: "Insurance Card Scan",
    date: "2024-12-05",
    type: "Insurance",
  },
  {
    id: "2",
    name: "Vaccination Certificate",
    date: "2024-11-20",
    type: "Vaccination",
  },
]

const mockMedicationProgress = [
  {
    id: "1",
    medication: "Lisinopril",
    dosage: "10mg",
    prescribedBy: "Dr. Sarah Johnson",
    startDate: "2024-01-15",
    reason: "Hypertension",
    adherence: 95,
    sideEffects: "None",
    effectivenessRating: 4,
    progressNotes: [
      { date: "2024-12-01", note: "Blood pressure readings have normalized" },
      { date: "2024-11-01", note: "Patient reports feeling better, minimal side effects" },
      { date: "2024-10-01", note: "Medication tolerance improved" },
    ],
  },
  {
    id: "2",
    medication: "Metformin",
    dosage: "500mg",
    prescribedBy: "Dr. Michael Chen",
    startDate: "2023-06-20",
    reason: "Type 2 Diabetes",
    adherence: 88,
    sideEffects: "Mild GI discomfort",
    effectivenessRating: 4,
    progressNotes: [
      { date: "2024-12-05", note: "HbA1c levels improved to 6.8%" },
      { date: "2024-11-15", note: "Patient maintaining consistent glucose levels" },
      { date: "2024-10-10", note: "Dietary changes showing positive impact" },
    ],
  },
  {
    id: "3",
    medication: "Atorvastatin",
    dosage: "20mg",
    prescribedBy: "Dr. Michael Chen",
    startDate: "2024-02-10",
    reason: "Cholesterol Management",
    adherence: 92,
    sideEffects: "None",
    effectivenessRating: 5,
    progressNotes: [
      { date: "2024-12-01", note: "Cholesterol levels dropped significantly" },
      { date: "2024-11-01", note: "Excellent response to treatment" },
      { date: "2024-09-20", note: "Medication started" },
    ],
  },
]

export default function PatientMedicalRecords() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Medical Records</h2>
        <p className="text-muted-foreground">Access your complete medical history and medication progress</p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full max-w-4xl grid-cols-4 bg-secondary">
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
          >
            Lab Reports
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
          >
            Medical History
          </TabsTrigger>
          <TabsTrigger
            value="medications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
          >
            Medications
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
          >
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4 mt-6">
          {mockLabReports.length === 0 ? (
            <Card className="border-border bg-card border-dashed">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No lab reports available yet</p>
              </CardContent>
            </Card>
          ) : (
            mockLabReports.map((report) => (
              <Card key={report.id} className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription>By {report.doctor}</CardDescription>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {report.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Date: {report.date}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {mockMedicalHistory.map((history) => (
            <Card key={history.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{history.condition}</CardTitle>
                    <CardDescription>Since {history.startDate}</CardDescription>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {history.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{history.notes}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="medications" className="space-y-4 mt-6">
          {mockMedicationProgress.map((med) => (
            <Card key={med.id} className="border-border bg-card overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{med.medication}</CardTitle>
                      <CardDescription className="text-slate-300 text-xs sm:text-sm">{med.dosage}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {med.reason}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Medication Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Prescribed By</p>
                    <p className="font-semibold text-sm text-foreground">{med.prescribedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                    <p className="font-semibold text-sm text-foreground">{med.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Adherence Rate</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${med.adherence}%` }}
                        />
                      </div>
                      <span className="font-semibold text-sm text-emerald-400">{med.adherence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Effectiveness</p>
                    <div className="flex items-center gap-1">
                      {[...Array(med.effectivenessRating)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full" />
                      ))}
                      {[...Array(5 - med.effectivenessRating)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-slate-600 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Side Effects</p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    {med.sideEffects === "None" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        {med.sideEffects}
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        {med.sideEffects}
                      </>
                    )}
                  </p>
                </div>

                {/* Progress Timeline */}
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Progress Notes</h4>
                  </div>
                  <div className="space-y-3">
                    {med.progressNotes.map((progress, idx) => (
                      <div key={idx} className="relative pl-6 pb-3 last:pb-0">
                        <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-primary" />
                        <div className="absolute left-1 top-4 bottom-0 w-0.5 bg-slate-600 last:hidden" />
                        <div>
                          <p className="text-xs text-slate-400 mb-1">{progress.date}</p>
                          <p className="text-sm text-slate-300">{progress.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-slate-700">
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent text-sm"
                  >
                    View Full Report
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                    Report Issues
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 mt-6">
          {mockDocuments.map((doc) => (
            <Card key={doc.id} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doc.name}</CardTitle>
                      <CardDescription>{doc.type}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Uploaded: {doc.date}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
