const statusColors = {
  available: "bg-emerald-100 text-emerald-700",
  allocated: "bg-blue-100 text-blue-700",
  reserved: "bg-amber-100 text-amber-700",
  under_maintenance: "bg-orange-100 text-orange-700",
  lost: "bg-red-100 text-red-700",
  retired: "bg-slate-100 text-slate-600",
  disposed: "bg-red-100 text-red-700",
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  assigned: "bg-purple-100 text-purple-700",
  in_progress: "bg-cyan-100 text-cyan-700",
  rejected: "bg-red-100 text-red-700",
  resolved: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600",
  requested: "bg-amber-100 text-amber-700",
  employee: "bg-slate-100 text-slate-600",
  department_head: "bg-blue-100 text-blue-700",
  asset_manager: "bg-purple-100 text-purple-700",
  admin: "bg-rose-100 text-rose-700",
};

export default function StatusBadge({ status, className = "" }) {
  const color = statusColors[status] || "bg-slate-100 text-slate-600";
  const label = status
    ? status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "-";

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}
    >
      {label}
    </span>
  );
}