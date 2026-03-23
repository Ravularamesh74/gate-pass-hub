import { cn } from "@/lib/utils";
import {
  User,
  Briefcase,
  Truck,
  CalendarDays,
} from "lucide-react";

export type PassType = "visitor" | "material" | "employee" | "event";

type PassTypeConfig = {
  label: string;
  icon: React.ReactNode;
  styles: {
    soft: string;
    solid: string;
    outline: string;
  };
};

const PASS_TYPE_MAP: Record<PassType, PassTypeConfig> = {
  visitor: {
    label: "Visitor",
    icon: <User className="w-3.5 h-3.5" />,
    styles: {
      soft: "bg-blue-100 text-blue-700 border-blue-200",
      solid: "bg-blue-600 text-white",
      outline: "border border-blue-300 text-blue-700",
    },
  },
  material: {
    label: "Material",
    icon: <Truck className="w-3.5 h-3.5" />,
    styles: {
      soft: "bg-amber-100 text-amber-700 border-amber-200",
      solid: "bg-amber-600 text-white",
      outline: "border border-amber-300 text-amber-700",
    },
  },
  employee: {
    label: "Employee",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    styles: {
      soft: "bg-emerald-100 text-emerald-700 border-emerald-200",
      solid: "bg-emerald-600 text-white",
      outline: "border border-emerald-300 text-emerald-700",
    },
  },
  event: {
    label: "Event",
    icon: <CalendarDays className="w-3.5 h-3.5" />,
    styles: {
      soft: "bg-rose-100 text-rose-700 border-rose-200",
      solid: "bg-rose-600 text-white",
      outline: "border border-rose-300 text-rose-700",
    },
  },
};

interface PassTypeBadgeProps {
  type: PassType;
  variant?: "soft" | "solid" | "outline";
  showIcon?: boolean;
  className?: string;
}

export default function PassTypeBadge({
  type,
  variant = "soft",
  showIcon = true,
  className,
}: PassTypeBadgeProps) {
  const config = PASS_TYPE_MAP[type];

  return (
    <span
      role="status"
      aria-label={config.label}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.styles[variant],
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}