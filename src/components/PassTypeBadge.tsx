type PassType = "visitor" | "material" | "employee" | "event";

const config: Record<PassType, { label: string; color: string }> = {
  visitor: { label: "Visitor", color: "bg-primary/10 text-primary" },
  material: { label: "Material", color: "bg-warning/10 text-warning" },
  employee: { label: "Employee", color: "bg-accent/10 text-accent" },
  event: { label: "Event", color: "bg-destructive/10 text-destructive" },
};

export default function PassTypeBadge({ type }: { type: PassType }) {
  const c = config[type];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.color}`}>
      {c.label}
    </span>
  );
}
