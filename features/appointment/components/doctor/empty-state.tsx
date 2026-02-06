import { Calendar } from "lucide-react";

export function EmptyState() {
  return (
    <div className="py-20 text-center bg-white/5 border border-white/10 rounded-2xl">
      <Calendar className="h-12 w-12 mx-auto text-slate-500 mb-4" />
      <p className="text-slate-400">No appointments found in this category.</p>
    </div>
  );
}
