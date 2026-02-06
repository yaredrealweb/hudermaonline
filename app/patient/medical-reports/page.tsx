"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  TrendingUp,
  Pill,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGetProfile } from "@/hooks/use-auth-mutation";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

function MedicalReportsContent() {
  const { data } = useGetProfile();
  const userRole = data?.role;
  const isDoctor = userRole === "DOCTOR";
  const isPatient = userRole === "PATIENT";

  // Lab Reports
  const [labReportsPage, setLabReportsPage] = useState(1);
  const labReportsQuery = trpc.medicalReports.listLabReports.useQuery({
    page: labReportsPage,
    pageSize: 10,
  });

  // Medical History
  const [medicalHistoryPage, setMedicalHistoryPage] = useState(1);
  const medicalHistoryQuery = trpc.medicalReports.listMedicalHistory.useQuery({
    page: medicalHistoryPage,
    pageSize: 10,
  });

  // Medications
  const [medicationsPage, setMedicationsPage] = useState(1);
  const medicationsQuery = trpc.medicalReports.listMedications.useQuery({
    page: medicationsPage,
    pageSize: 10,
  });

  // Lab report view dialog
  const [openLabDialog, setOpenLabDialog] = useState(false);
  const [selectedLab, setSelectedLab] = useState<any>(null);

  // Medication view dialog
  const [openMedicationDialog, setOpenMedicationDialog] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);

  // Mutations for doctors
  const deleteLabReportMutation =
    trpc.medicalReports.deleteLabReport.useMutation();
  const deleteMedicalHistoryMutation =
    trpc.medicalReports.deleteMedicalHistory.useMutation();
  const deleteMedicationMutation =
    trpc.medicalReports.deleteMedication.useMutation();

  const handleDeleteLabReport = async (id: string) => {
    if (confirm("Are you sure you want to delete this lab report?")) {
      try {
        await deleteLabReportMutation.mutateAsync({ id });
        labReportsQuery.refetch();
      } catch (error) {
        console.error("Failed to delete lab report:", error);
        alert("Failed to delete lab report");
      }
    }
  };

  const handleDeleteMedicalHistory = async (id: string) => {
    if (
      confirm("Are you sure you want to delete this medical history entry?")
    ) {
      try {
        await deleteMedicalHistoryMutation.mutateAsync({ id });
        medicalHistoryQuery.refetch();
      } catch (error) {
        console.error("Failed to delete medical history:", error);
        alert("Failed to delete medical history entry");
      }
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      try {
        await deleteMedicationMutation.mutateAsync({ id });
        medicationsQuery.refetch();
      } catch (error) {
        console.error("Failed to delete medication:", error);
        alert("Failed to delete medication");
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const PaginationControls = ({
    page,
    totalPages,
    onPrev,
    onNext,
  }: {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
  }) => (
    <div className="flex items-center justify-end gap-2 mt-4">
      <Button variant="outline" disabled={page <= 1} onClick={onPrev}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {Math.max(totalPages, 1)}
      </span>
      <Button variant="outline" disabled={page >= totalPages} onClick={onNext}>
        Next
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Medical Reports
          </h2>
          <p className="text-muted-foreground">
            {isPatient
              ? "Access your complete medical history and medication progress"
              : "Manage patient medical records"}
          </p>
        </div>
        {isDoctor && (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add New Report
          </Button>
        )}
      </div>

      <Tabs defaultValue="lab-reports" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-secondary">
          <TabsTrigger
            value="lab-reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
          >
            Lab Reports
          </TabsTrigger>
          <TabsTrigger
            value="medical-history"
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
        </TabsList>

        <TabsContent value="lab-reports" className="space-y-4 mt-6">
          {labReportsQuery.isLoading ? (
            <div className="text-center py-8">Loading lab reports...</div>
          ) : !labReportsQuery.data?.items.length ? (
            <Card className="border-border bg-card border-dashed">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No lab reports available yet
                </p>
                {isDoctor && (
                  <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lab Report
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {labReportsQuery.data.items.map((report) => (
                <Card
                  key={report.id}
                  className="border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {report.name}
                          </CardTitle>
                          <CardDescription>
                            By Dr. {report.doctorId}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {report.status}
                        </span>
                        {isDoctor && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLabReport(report.id)}
                              disabled={deleteLabReportMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Date: {formatDate(report.date)}
                    </p>
                    {report.notes && (
                      <p className="text-sm text-foreground">{report.notes}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                        onClick={() => {
                          setSelectedLab(report);
                          setOpenLabDialog(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {report.fileUrl && (
                        <Button
                          asChild
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="w-4 h-4 mr-2 inline" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <PaginationControls
                page={labReportsQuery.data.pagination.page}
                totalPages={labReportsQuery.data.pagination.totalPages}
                onPrev={() => setLabReportsPage((p) => Math.max(p - 1, 1))}
                onNext={() => setLabReportsPage((p) => p + 1)}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="medical-history" className="space-y-4 mt-6">
          {isDoctor && (
            <div className="flex justify-end mb-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Medical History
              </Button>
            </div>
          )}

          {medicalHistoryQuery.isLoading ? (
            <div className="text-center py-8">Loading medical history...</div>
          ) : !medicalHistoryQuery.data?.items.length ? (
            <Card className="border-border bg-card border-dashed">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No medical history available yet
                </p>
                {isDoctor && (
                  <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medical History
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {medicalHistoryQuery.data.items.map((history) => (
                <Card key={history.id} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {history.condition}
                        </CardTitle>
                        <CardDescription>
                          Since {formatDate(history.startDate)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {history.status}
                        </span>
                        {isDoctor && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteMedicalHistory(history.id)
                              }
                              disabled={deleteMedicalHistoryMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {history.notes && (
                      <p className="text-sm text-foreground">{history.notes}</p>
                    )}
                    {history.endDate && (
                      <p className="text-sm text-muted-foreground mt-2">
                        End Date: {formatDate(history.endDate)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              <PaginationControls
                page={medicalHistoryQuery.data.pagination.page}
                totalPages={medicalHistoryQuery.data.pagination.totalPages}
                onPrev={() => setMedicalHistoryPage((p) => Math.max(p - 1, 1))}
                onNext={() => setMedicalHistoryPage((p) => p + 1)}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="medications" className="space-y-4 mt-6">
          {isDoctor && (
            <div className="flex justify-end mb-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>
          )}

          {medicationsQuery.isLoading ? (
            <div className="text-center py-8">Loading medications...</div>
          ) : !medicationsQuery.data?.items.length ? (
            <Card className="border-border bg-card border-dashed">
              <CardContent className="py-12 text-center">
                <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No medications available yet
                </p>
                {isDoctor && (
                  <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {medicationsQuery.data.items.map((med) => (
                <Card
                  key={med.id}
                  className="border-border bg-card overflow-hidden"
                >
                  <CardHeader className="bg-linear-to-r from-slate-700 to-slate-800 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
                          <Pill className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">
                            {med.name}
                          </CardTitle>
                          <CardDescription className="text-slate-300 text-xs sm:text-sm">
                            {med.dosage}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="shrink-0">
                          {med.reason}
                        </Badge>
                        {isDoctor && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20"
                              onClick={() => handleDeleteMedication(med.id)}
                              disabled={deleteMedicationMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Prescribed By
                        </p>
                        <p className="font-semibold text-sm text-foreground">
                          Dr. {med.doctorId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Start Date
                        </p>
                        <p className="font-semibold text-sm text-foreground">
                          {formatDate(med.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Adherence Rate
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-linear-to-r from-emerald-400 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${med.adherence}%` }}
                            />
                          </div>
                          <span className="font-semibold text-sm text-emerald-400">
                            {med.adherence}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Effectiveness
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(med.effectivenessRating || 0)].map(
                            (_, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 bg-yellow-400 rounded-full"
                              />
                            )
                          )}
                          {[...Array(5 - (med.effectivenessRating || 0))].map(
                            (_, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 bg-slate-600 rounded-full"
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Side Effects
                      </p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        {med.sideEffects === "None" || !med.sideEffects ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            None
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                            {med.sideEffects}
                          </>
                        )}
                      </p>
                    </div>

                    {med.endDate && (
                      <div className="border-t border-slate-700 pt-4">
                        <p className="text-xs text-muted-foreground mb-2">
                          End Date
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(med.endDate)}
                        </p>
                      </div>
                    )}

                    {med.notes && (
                      <div className="border-t border-slate-700 pt-4">
                        <p className="text-xs text-muted-foreground mb-2">
                          Notes
                        </p>
                        <p className="text-sm text-foreground">{med.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-slate-700">
                      <Button
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent text-sm"
                        onClick={() => {
                          setSelectedMedication(med);
                          setOpenMedicationDialog(true);
                        }}
                      >
                        View Full Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <PaginationControls
                page={medicationsQuery.data.pagination.page}
                totalPages={medicationsQuery.data.pagination.totalPages}
                onPrev={() => setMedicationsPage((p) => Math.max(p - 1, 1))}
                onNext={() => setMedicationsPage((p) => p + 1)}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={openLabDialog} onOpenChange={setOpenLabDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedLab?.name ?? "Lab Report"}</DialogTitle>
            <DialogDescription>
              {selectedLab ? `Date: ${formatDate(selectedLab.date)}` : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedLab && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Status</span>
                <span className="font-medium text-foreground">
                  {selectedLab.status}
                </span>
              </div>
              {selectedLab.notes && (
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {selectedLab.notes}
                </p>
              )}
              {selectedLab.fileUrl && (
                <div className="space-y-2">
                  <img
                    src={selectedLab.fileUrl}
                    alt={selectedLab.name}
                    className="w-full rounded-md border"
                  />
                  <Button asChild className="w-full">
                    <a
                      href={selectedLab.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download Image
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openMedicationDialog}
        onOpenChange={setOpenMedicationDialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedMedication?.name ?? "Medication"}
            </DialogTitle>
            <DialogDescription>
              {selectedMedication ? `Reason: ${selectedMedication.reason}` : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedMedication && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dosage</span>
                <span className="font-medium text-foreground">
                  {selectedMedication.dosage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium text-foreground">
                  {formatDate(selectedMedication.startDate)}
                </span>
              </div>
              {selectedMedication.endDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium text-foreground">
                    {formatDate(selectedMedication.endDate)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adherence</span>
                <span className="font-medium text-foreground">
                  {selectedMedication.adherence}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effectiveness</span>
                <span className="font-medium text-foreground">
                  {selectedMedication.effectivenessRating}/5
                </span>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Side Effects</p>
                <p className="text-foreground font-medium">
                  {selectedMedication.sideEffects || "None"}
                </p>
              </div>
              {selectedMedication.notes && (
                <div>
                  <p className="text-muted-foreground mb-1">Notes</p>
                  <p className="text-foreground whitespace-pre-wrap">
                    {selectedMedication.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MedicalReportsPage() {
  return <MedicalReportsContent />;
}
