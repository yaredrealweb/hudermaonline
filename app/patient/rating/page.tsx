"use client";

import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Star } from "lucide-react";

type DoctorItem = {
  id: string;
  name: string | null;
  specialty: string | null;
  averageRating: number;
  ratingCount: number;
  patientRating: number | null;
  hasRated: boolean;
};

type DraftState = Record<
  string,
  {
    rating: number;
    review?: string;
  }
>;

function StarPicker({
  value,
  onChange,
  disabled,
  loading,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((score) => {
        const active = score <= value;
        return (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            disabled={disabled || loading}
            className="p-1 rounded-md hover:bg-white/10 disabled:opacity-60"
            aria-label={`Rate ${score} star${score > 1 ? "s" : ""}`}
          >
            <Star
              className={`w-5 h-5 ${
                active ? "text-amber-400 fill-amber-400" : "text-slate-400"
              }`}
            />
          </button>
        );
      })}
      {loading && (
        <Loader2 className="w-4 h-4 ml-1 animate-spin text-slate-300" />
      )}
    </div>
  );
}

function DoctorCard({
  doctor,
  draft,
  onDraftChange,
  onSubmit,
  isSubmitting,
}: {
  doctor: DoctorItem;
  draft?: { rating: number; review?: string };
  onDraftChange: (draft: { rating: number; review?: string }) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const averageLabel = doctor.averageRating
    ? doctor.averageRating.toFixed(1)
    : "No ratings yet";

  return (
    <Card className="bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-lg font-semibold">
            {doctor.name ?? "Doctor"}
          </CardTitle>
          <p className="text-sm text-slate-300">
            {doctor.specialty ?? "General Practitioner"}
          </p>
        </div>
        <Badge className="bg-blue-600/20 text-blue-100 border border-blue-500/30">
          {averageLabel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-slate-200">
          <Star className="w-4 h-4 text-amber-400" />
          <span>
            {doctor.ratingCount} rating{doctor.ratingCount === 1 ? "" : "s"}
          </span>
        </div>

        {doctor.hasRated ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
            You rated this doctor {doctor.patientRating} star
            {doctor.patientRating && doctor.patientRating > 1 ? "s" : ""}.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-200">Your rating</p>
              <StarPicker
                value={draft?.rating ?? 0}
                onChange={(score) =>
                  onDraftChange({ rating: score, review: draft?.review })
                }
                loading={isSubmitting}
              />
            </div>
            <Textarea
              placeholder="Share an optional note (max 1000 chars)"
              value={draft?.review ?? ""}
              onChange={(e) =>
                onDraftChange({
                  rating: draft?.rating ?? 0,
                  review: e.target.value,
                })
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              rows={3}
              maxLength={1000}
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!draft?.rating || isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Submit rating
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PatientRatingPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<DraftState>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isFetching, refetch } =
    trpc.doctorRating.listForPatient.useQuery({
      page,
      pageSize: 6,
      search: search.trim() || undefined,
    });

  const mutation = trpc.doctorRating.create.useMutation({
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Thank you!",
        description: "Your rating has been submitted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Unable to submit rating",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => setSubmittingId(null),
  });

  const doctors = data?.doctors ?? [];
  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  const handleDraftChange = (
    doctorId: string,
    draft: { rating: number; review?: string }
  ) => {
    setDrafts((prev) => ({ ...prev, [doctorId]: draft }));
  };

  const handleSubmit = async (doctorId: string) => {
    const draft = drafts[doctorId];
    if (!draft?.rating) {
      toast({
        title: "Choose a rating",
        description: "Please select between 1 and 5 stars before submitting.",
      });
      return;
    }

    setSubmittingId(doctorId);
    await mutation.mutateAsync({
      doctorId,
      rating: draft.rating,
      review: draft.review?.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-200/80">
              Feedback
            </p>
            <h1 className="text-2xl font-bold">Rate your doctors</h1>
            <p className="text-sm text-slate-300">
              Share feedback to help other patients and improve care.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or specialty"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
            />
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-200">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading doctors...
          </div>
        ) : !doctors.length ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-300">
            No doctors found.
          </div>
        ) : (
          <div className="space-y-4">
            {isFetching && (
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Loader2 className="w-4 h-4 animate-spin" /> Refreshing list...
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  draft={drafts[doctor.id]}
                  onDraftChange={(draft) => handleDraftChange(doctor.id, draft)}
                  isSubmitting={
                    submittingId === doctor.id && mutation.isPending
                  }
                  onSubmit={() => handleSubmit(doctor.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 text-sm text-slate-200">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
