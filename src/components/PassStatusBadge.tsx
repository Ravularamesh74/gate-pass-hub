type Status = "pending" | "active" | "expired" | "rejected";

const labels: Record<Status, string> = {
  pending: "Pending",
  active: "Active",
  expired: "Expired",
  rejected: "Rejected",
};

export default function PassStatusBadge({ status }: { status: Status }) {
  const cls = `status-badge-${status}`;
  return <span className={cls}>{labels[status]}</span>;
}
