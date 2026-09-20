import { Badge } from "@/components/ui/badge";

// Maps every status string used across the app to a semantic badge variant.
const STATUS_MAP = {
  Active: "success",
  Inactive: "secondary",
  Confirmed: "info",
  Scheduled: "secondary",
  "Checked In": "warning",
  "Checked Out": "success",
  Cancelled: "destructive",
  Rescheduled: "warning",
  Paid: "success",
  Due: "warning",
  Overdue: "destructive",
};

export function StatusBadge({ status, className }) {
  const variant = STATUS_MAP[status] || "outline";
  return (
    <Badge variant={variant} className={className}>
      <span
        className={
          "h-1.5 w-1.5 rounded-full " +
          (variant === "success"
            ? "bg-success"
            : variant === "warning"
            ? "bg-warning"
            : variant === "destructive"
            ? "bg-destructive"
            : variant === "info"
            ? "bg-info"
            : "bg-muted-foreground")
        }
      />
      {status}
    </Badge>
  );
}
