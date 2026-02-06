"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  useCreatePrescription,
  useDeletePrescription,
} from "@/hooks/use-prescriptions";
import { useDoctorPrescriptions } from "@/hooks/use-prescriptions";
import { ImageUpload } from "@/components/upload/image-upload";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

export default function Page() {
  const { toast } = useToast();
  const [patientId, setPatientId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const { data: patients, isLoading: patientsLoading } =
    trpc.user.getPatients.useQuery();

  const { data: listData, isLoading: listLoading } = useDoctorPrescriptions({
    patientId: patientId || undefined,
  });

  const createMutation = useCreatePrescription();
  const deleteMutation = useDeletePrescription();

  const canSubmit = useMemo(
    () => !!patientId && !!imageUrl,
    [patientId, imageUrl]
  );

  const onSubmit = async () => {
    try {
      await createMutation.mutateAsync({
        patientId,
        imageUrl,
        title: title?.trim() || undefined,
        note: note?.trim() || undefined,
      });
      toast({
        title: "Prescription uploaded",
        description: "The prescription has been created successfully.",
      });
      setImageUrl("");
      setTitle("");
      setNote("");
    } catch (e: any) {
      toast({
        title: "Upload failed",
        description: e?.message || "Please try again.",
        variant: "destructive" as any,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast({ title: "Deleted", description: "Prescription deleted." });
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e?.message || "Please try again.",
        variant: "destructive" as any,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4 space-y-4 bg-transparent">
          <h2 className="text-lg font-semibold">New Prescription</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Patient</label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    patientsLoading ? "Loading..." : "Choose a patient"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {patients?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="truncate">{p.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title (optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blood Test Results"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional instructions or context..."
              rows={4}
            />
          </div>

          <ImageUpload
            label="Prescription Image"
            onUploadSuccess={(url) => setImageUrl(url)}
            onError={(err) =>
              toast({
                title: "Upload error",
                description: err,
                variant: "destructive" as any,
              })
            }
          />

          <div className="flex justify-end">
            <Button
              onClick={onSubmit}
              disabled={!canSubmit || createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Upload Prescription"}
            </Button>
          </div>
        </Card>

        <Card className="p-4 space-y-4  bg-transparent">
          <h2 className="text-lg font-semibold">Prescriptions</h2>
          {listLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !listData?.items?.length ? (
            <p className="text-sm text-muted-foreground">
              No prescriptions yet.
            </p>
          ) : (
            <div className="space-y-4">
              {listData.items.map((item) => (
                <div key={item.id} className="flex gap-3 border rounded-md p-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title || "Prescription"}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium truncate">
                          {item.title || "Prescription"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            item.createdAt as unknown as string
                          ).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {item.note && (
                      <p className="text-sm mt-2 whitespace-pre-wrap">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
