import { Calendar } from "lucide-react";

export function EmptyAppointments() {
  return (
    <div className="py-12 text-center bg-white/5 border border-white/10 rounded-2xl">
      <Calendar className="h-12 w-12 mx-auto text-slate-500 mb-4" />
      <p className="text-slate-400">You don't have any appointments yet.</p>
    </div>
  );
}
