"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const SERIES = [
  { key: "completed", label: "Completed", color: "var(--chart-1)" },
  { key: "cancelled", label: "Cancelled", color: "var(--chart-2)" },
  { key: "rescheduled", label: "Rescheduled", color: "var(--chart-3)" },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg"
      style={{ color: "var(--chart-text-primary)" }}
    >
      <p className="mb-1.5 font-semibold">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: "var(--chart-text-secondary)" }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
          <span className="tabular-nums font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AppointmentChart({ data = [] }) {
  const chartData = useMemo(() => data, [data]);

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Appointment Statistics</CardTitle>
          <CardDescription>Monthly breakdown for the current year</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 16, left: -12, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "var(--chart-baseline)" }}
                tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
                width={36}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--chart-grid)", opacity: 0.4 }} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: "var(--chart-text-secondary)", fontSize: 12 }}>{value}</span>
                )}
              />
              {SERIES.map((s) => (
                <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={14} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
