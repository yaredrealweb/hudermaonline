import { Spinner } from "@/components/ui/spinner";

export function AppointmentListSkeleton() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#0F172A]">
      <Spinner />
    </div>
  );
}
