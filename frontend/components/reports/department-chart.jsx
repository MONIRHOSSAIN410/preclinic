"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold" style={{ color: "var(--chart-text-primary)" }}>
        {label}
      </p>
      <p style={{ color: "var(--chart-text-secondary)" }}>
        Bookings: <span className="font-medium">{payload[0].value}</span>
      </p>
    </div>
  );
}

export function DepartmentChart({ data = [] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Bookings by Department</CardTitle>
        <CardDescription>Total appointment bookings handled per department</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="No data yet" />
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 16, left: -12, bottom: 40 }}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="department"
                  tickLine={false}
                  axisLine={{ stroke: "var(--chart-baseline)" }}
                  tick={{ fill: "var(--chart-muted)", fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={70}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--chart-muted)", fontSize: 12 }} width={36} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--chart-grid)", opacity: 0.4 }} />
                <Bar dataKey="bookings" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
