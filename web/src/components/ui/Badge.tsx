type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "gold";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  default: "bg-gray-mid text-text-light",
  gold: "bg-primary/15 text-primary",
  success: "bg-green-500/20 text-green-400",
  warning: "bg-yellow-500/20 text-yellow-300",
  danger: "bg-red-500/20 text-red-400",
  info: "bg-blue-500/20 text-blue-400",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide
        ${variantClass[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    active: "success",
    published: "success",
    accepted: "success",
    approved: "success",
    pending: "warning",
    reviewing: "warning",
    draft: "info",
    rejected: "danger",
    declined: "danger",
    inactive: "danger",
    completed: "gold",
  };
  return (
    <Badge variant={map[status.toLowerCase()] ?? "default"}>{status}</Badge>
  );
}
