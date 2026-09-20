import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

// Renders a set of named counts as horizontal bars with the count as a
// direct label -- color never carries the meaning alone (text does).
const COLOR_MAP = {
  "Checked Out": "var(--chart-good)",
  Paid: "var(--chart-good)",
  Confirmed: "var(--chart-1)",
  Scheduled: "var(--chart-1)",
  "Checked In": "var(--chart-warning)",
  Due: "var(--chart-warning)",
  Rescheduled: "var(--chart-warning)",
  Cancelled: "var(--chart-critical)",
  Overdue: "var(--chart-critical)",
};

export function StatusBreakdownList({ title, description, data = [], labelKey = "status" }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 && <EmptyState title="No data yet" />}
        {data.map((row) => (
          <div key={row[labelKey]}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{row[labelKey]}</span>
              <span className="tabular-nums text-muted-foreground">{row.count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(row.count / max) * 100}%`,
                  backgroundColor: COLOR_MAP[row[labelKey]] || "var(--chart-1)",
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
