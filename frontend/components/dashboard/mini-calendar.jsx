"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function MiniCalendar({ highlightDates = [] }) {
  const [cursor, setCursor] = useState(new Date());
  const today = new Date();

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const highlightSet = new Set(
    highlightDates.map((d) => new Date(d).toDateString())
  );

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">
          {cursor.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </CardTitle>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <span key={idx} />;
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const hasEvent = highlightSet.has(date.toDateString());
            return (
              <div key={idx} className="relative flex items-center justify-center">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors",
                    isToday
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  {day}
                </span>
                {hasEvent && !isToday && (
                  <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
