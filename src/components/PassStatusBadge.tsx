import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";

export type Status = "pending" | "active" | "expired" | "rejected";

type StatusConfig = {
  label: string;
  className: string;
  icon: React.ReactNode;
};

const STATUS_MAP: Record<Status, StatusConfig> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  expired: {
    label: "Expired",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border-red-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

interface PassStatusBadgeProps {
  status: Status;
  className?: string;
  showIcon?: boolean;
}

export default function PassStatusBadge({
  status,
  className,
  showIcon = true,
}: PassStatusBadgeProps) {
  const config = STATUS_MAP[status];

  return (
    <span
      role="status"
      aria-label={config.label}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}