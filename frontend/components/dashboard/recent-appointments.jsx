import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getInitials, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function RecentAppointments({ appointments = [] }) {
  return (
    <Card className="col-span-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest bookings across your clinic</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/appointments">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1">
        {appointments.length === 0 && <EmptyState title="No appointments yet" />}
        {appointments.map((a) => (
          <div
            key={a._id}
            className="flex flex-wrap items-center gap-3 rounded-xl px-2 py-3 hover:bg-accent sm:flex-nowrap"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={a.patient?.avatar} alt={a.patient?.name} />
              <AvatarFallback>{getInitials(a.patient?.name || "P")}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{a.patient?.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                with {a.doctor?.name} &middot; {a.doctor?.specialization}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(a.date)}</span>
            <StatusBadge status={a.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
