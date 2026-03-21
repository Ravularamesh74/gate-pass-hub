import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  className?: string;
}

export default function StatCard({ label, value, icon: Icon, className = "" }: StatCardProps) {
  return (
    <div className={`bg-card rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1 pass-number">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
