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
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGetProfile } from "@/hooks/use-auth-mutation";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InputForm from "@/components/form/input-form";
import TeaxtareaForm from "@/components/form/textarea-form";
import { useForm, Controller } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/upload/image-upload";

function DoctorMedicalReportsContent() {
  const { data } = useGetProfile();
  const userRole = data?.role;
  const isDoctor = userRole === "DOCTOR";

  // State for patient selection
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  // Get doctor's patients
  const patientsQuery = trpc.user.getPatients.useQuery();
  const patientNameById = useMemo(() => {
    const map = new Map<string, string>();
    (patientsQuery.data || []).forEach((p) => map.set(p.id, p.name ?? p.id));
    return map;
  }, [patientsQuery.data]);

  // Lab Reports
  const [labReportsPage, setLabReportsPage] = useState(1);
  const labReportsQuery = trpc.medicalReports.listLabReports.useQuery({
    page: labReportsPage,
    pageSize: 10,
    patientId: selectedPatientId,
  });

  // Medical History
  const [medicalHistoryPage, setMedicalHistoryPage] = useState(1);
  const medicalHistoryQuery = trpc.medicalReports.listMedicalHistory.useQuery({
    page: medicalHistoryPage,
    pageSize: 10,
    patientId: selectedPatientId,
  });

  // Medications
  const [medicationsPage, setMedicationsPage] = useState(1);
  const medicationsQuery = trpc.medicalReports.listMedications.useQuery({
    page: medicationsPage,
    pageSize: 10,
    patientId: selectedPatientId,
  });

  // Mutations
  const deleteLabReportMutation =
    trpc.medicalReports.deleteLabReport.useMutation();
  const deleteMedicalHistoryMutation =
    trpc.medicalReports.deleteMedicalHistory.useMutation();
  const deleteMedicationMutation =
    trpc.medicalReports.deleteMedication.useMutation();

  const createLabReportMutation =
    trpc.medicalReports.createLabReport.useMutation();
  const createMedicalHistoryMutation =
    trpc.medicalReports.createMedicalHistory.useMutation();
  const createMedicationMutation =
    trpc.medicalReports.createMedication.useMutation();

  // Forms state
  const {
    control: labControl,
    handleSubmit: handleSubmitLab,
    reset: resetLab,
    setValue: setLabValue,
  } = useForm();
  const {
    control: historyControl,
    handleSubmit: handleSubmitHistory,
    reset: resetHistory,
  } = useForm();
  const {
    control: medicationControl,
    handleSubmit: handleSubmitMedication,
    reset: resetMedication,
  } = useForm();

  const [openLabDialog, setOpenLabDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [openMedicationDialog, setOpenMedicationDialog] = useState(false);

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

  const handlePatientChange = (patientId: string) => {
    if (patientId === "all") {
      setSelectedPatientId("");
    } else {
      setSelectedPatientId(patientId);
    }
    setLabReportsPage(1);
    setMedicalHistoryPage(1);
    setMedicationsPage(1);
  };

  // Create handlers
  const onCreateLabReport = handleSubmitLab(async (values: any) => {
    if (!selectedPatientId) {
      alert("Please select a patient first");
      return;
    }
    try {
      await createLabReportMutation.mutateAsync({
        patientId: selectedPatientId,
        name: values.name,
        date: values.date,
        status: values.status ?? "normal",
        notes: values.notes,
        fileUrl: values.fileUrl,
      });
      setOpenLabDialog(false);
      resetLab();
      labReportsQuery.refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to create lab report");
    }
  });

  const onCreateMedicalHistory = handleSubmitHistory(async (values: any) => {
    if (!selectedPatientId) {
      alert("Please select a patient first");
      return;
    }
    try {
      await createMedicalHistoryMutation.mutateAsync({
        patientId: selectedPatientId,
        condition: values.condition,
        status: values.status ?? "ongoing",
        startDate: values.startDate,
        endDate: values.endDate,
        notes: values.notes,
      });
      setOpenHistoryDialog(false);
      resetHistory();
      medicalHistoryQuery.refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to create medical history");
    }
  });

  const onCreateMedication = handleSubmitMedication(async (values: any) => {
    if (!selectedPatientId) {
      alert("Please select a patient first");
      return;
    }
    try {
      await createMedicationMutation.mutateAsync({
        patientId: selectedPatientId,
        name: values.name,
        dosage: values.dosage,
        reason: values.reason,
        startDate: values.startDate,
        endDate: values.endDate,
        adherence: Number(values.adherence ?? 0),
        sideEffects: values.sideEffects,
        effectivenessRating: Number(values.effectivenessRating ?? 0),
        notes: values.notes,
      });
      setOpenMedicationDialog(false);
      resetMedication();
      medicationsQuery.refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to create medication");
    }
  });

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
            Patient Medical Reports
          </h2>
          <p className="text-muted-foreground">
            Manage medical records for all your patients
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openLabDialog} onOpenChange={setOpenLabDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Lab Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Lab Report</DialogTitle>
              </DialogHeader>
              <form className="space-y-3" onSubmit={onCreateLabReport}>
                <InputForm
                  name="name"
                  control={labControl}
                  label="Report Name"
                  placeholder="e.g. CBC Panel"
                  icon={FileText}
                />
                <Controller
                  control={labControl}
                  name="date"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "MMM dd, yyyy")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(d) =>
                              d && field.onChange(format(d, "yyyy-MM-dd"))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                />
                <Controller
                  control={labControl}
                  name="status"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="abnormal">Abnormal</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <TeaxtareaForm
                  name="notes"
                  control={labControl}
                  label="Notes"
                  placeholder="Optional notes"
                />
                <ImageUpload
                  label="Report Image"
                  onUploadSuccess={(url) => setLabValue("fileUrl", url)}
                  onError={(err) => console.error("Upload error:", err)}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground"
                >
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={openHistoryDialog} onOpenChange={setOpenHistoryDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add History
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Medical History</DialogTitle>
              </DialogHeader>
              <form className="space-y-3" onSubmit={onCreateMedicalHistory}>
                <InputForm
                  name="condition"
                  control={historyControl}
                  label="Condition"
                  placeholder="e.g. Hypertension"
                  icon={FileText}
                />
                <Controller
                  control={historyControl}
                  name="status"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <Controller
                  control={historyControl}
                  name="startDate"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "MMM dd, yyyy")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(d) =>
                              d && field.onChange(format(d, "yyyy-MM-dd"))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                />
                <Controller
                  control={historyControl}
                  name="endDate"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "MMM dd, yyyy")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(d) =>
                              d && field.onChange(format(d, "yyyy-MM-dd"))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                />
                <TeaxtareaForm
                  name="notes"
                  control={historyControl}
                  label="Notes"
                  placeholder="Optional notes"
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground"
                >
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={openMedicationDialog}
            onOpenChange={setOpenMedicationDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Medication</DialogTitle>
              </DialogHeader>
              <form className="space-y-3" onSubmit={onCreateMedication}>
                <InputForm
                  name="name"
                  control={medicationControl}
                  label="Medication Name"
                  placeholder="e.g. Metformin"
                  icon={Pill}
                />
                <InputForm
                  name="dosage"
                  control={medicationControl}
                  label="Dosage"
                  placeholder="e.g. 500mg"
                  icon={Pill}
                />
                <InputForm
                  name="reason"
                  control={medicationControl}
                  label="Reason"
                  placeholder="e.g. Type 2 Diabetes"
                  icon={TrendingUp}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Controller
                    control={medicationControl}
                    name="startDate"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Start Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(new Date(field.value), "MMM dd, yyyy")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(d) =>
                                d && field.onChange(format(d, "yyyy-MM-dd"))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  />
                  <Controller
                    control={medicationControl}
                    name="endDate"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(new Date(field.value), "MMM dd, yyyy")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(d) =>
                                d && field.onChange(format(d, "yyyy-MM-dd"))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputForm
                    name="adherence"
                    control={medicationControl}
                    label="Adherence %"
                    placeholder="0-100"
                    type="number"
                    icon={CheckCircle}
                  />
                  <InputForm
                    name="effectivenessRating"
                    control={medicationControl}
                    label="Effectiveness (0-5)"
                    placeholder="0-5"
                    type="number"
                    icon={TrendingUp}
                  />
                </div>
                <InputForm
                  name="sideEffects"
                  control={medicationControl}
                  label="Side Effects"
                  placeholder="Optional"
                  icon={AlertCircle}
                />
                <TeaxtareaForm
                  name="notes"
                  control={medicationControl}
                  label="Notes"
                  placeholder="Optional notes"
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground"
                >
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Patient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Select
              value={selectedPatientId}
              onValueChange={(val) => handlePatientChange(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Patients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {patientsQuery.data?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
                  {selectedPatientId
                    ? "No lab reports available for this patient"
                    : "Select a patient to view their lab reports"}
                </p>
                {selectedPatientId && (
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
                            Patient:{" "}
                            {patientNameById.get(report.patientId) ??
                              report.patientId}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {report.status}
                        </span>
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
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {report.fileUrl && (
                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Download className="w-4 h-4 mr-2" />
                          Download
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
          <div className="flex justify-end mb-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Medical History
            </Button>
          </div>

          {medicalHistoryQuery.isLoading ? (
            <div className="text-center py-8">Loading medical history...</div>
          ) : !medicalHistoryQuery.data?.items.length ? (
            <Card className="border-border bg-card border-dashed">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {selectedPatientId
                    ? "No medical history available for this patient"
                    : "Select a patient to view their medical history"}
                </p>
                {selectedPatientId && (
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
                          Patient:{" "}
                          {patientNameById.get(history.patientId) ??
                            history.patientId}
                        </CardDescription>
                        <CardDescription>
                          Since {formatDate(history.startDate)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {history.status}
                        </span>
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
          <div className="flex justify-end mb-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>

          {medicationsQuery.isLoading ? (
            <div className="text-center py-8">Loading medications...</div>
          ) : !medicationsQuery.data?.items.length ? (
            <Card className="border-border bg-card border-dashed">
              <CardContent className="py-12 text-center">
                <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {selectedPatientId
                    ? "No medications available for this patient"
                    : "Select a patient to view their medications"}
                </p>
                {selectedPatientId && (
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
                          <CardDescription className="text-slate-300 text-xs">
                            Patient:{" "}
                            {patientNameById.get(med.patientId) ??
                              med.patientId}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="shrink-0">
                          {med.reason}
                        </Badge>
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
    </div>
  );
}

export default function DoctorMedicalReportsPage() {
  return <DoctorMedicalReportsContent />;
}
