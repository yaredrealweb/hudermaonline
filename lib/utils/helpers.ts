export function requireRole(
  user: { role: "PATIENT" | "DOCTOR" | "ADMIN" },
  allowed: Array<"PATIENT" | "DOCTOR" | "ADMIN">
) {
  if (!allowed.includes(user.role)) {
    throw new Error("Unauthorized");
  }
}

export function getStatusColor(status: string): string {
  const statusColorMap: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    CONFIRMED: "bg-green-500/20 text-green-400 border border-green-500/20",
    COMPLETED: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
    CANCELED: "bg-red-500/20 text-red-400 border border-red-500/20",
  };

  return (
    statusColorMap[status] ||
    "bg-slate-500/20 text-slate-400 border border-slate-500/20"
  );
}
