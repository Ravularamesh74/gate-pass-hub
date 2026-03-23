import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number;

  icon: LucideIcon;

  trend?: number; // % change (e.g., +12 or -5)
  trendLabel?: string;

  variant?: "default" | "success" | "warning" | "danger";
  loading?: boolean;

  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  default: "bg-card",
  success: "bg-green-50 border-green-200",
  warning: "bg-yellow-50 border-yellow-200",
  danger: "bg-red-50 border-red-200",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
  loading = false,
  onClick,
  className,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-xl border p-5 shadow-sm transition-all cursor-pointer",
        variantStyles[variant],
        onClick && "hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        {/* LEFT */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>

          {loading ? (
            <div className="h-7 w-20 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold tracking-tight">
              {new Intl.NumberFormat("en-IN").format(value)}
            </p>
          )}

          {/* TREND */}
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {Math.abs(trend)}%
              {trendLabel && (
                <span className="text-muted-foreground ml-1">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* RIGHT ICON */}
        <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}