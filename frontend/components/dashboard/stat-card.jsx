"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ icon: Icon, label, value, trend, trendLabel, accent = "primary", delay = 0 }) {
  const positive = trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{value}</p>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                accent === "primary" && "bg-primary/10 text-primary",
                accent === "success" && "bg-success/10 text-success",
                accent === "warning" && "bg-warning/10 text-warning",
                accent === "info" && "bg-info/10 text-info"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
          {typeof trend === "number" && (
            <div className="mt-4 flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "flex items-center gap-0.5 font-semibold",
                  positive ? "text-success" : "text-destructive"
                )}
              >
                {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(trend)}%
              </span>
              <span className="text-muted-foreground">{trendLabel || "vs last month"}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
