import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { getInitials } from "@/lib/utils";

export function PopularDoctors({ doctors = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Doctors</CardTitle>
        <CardDescription>Ranked by total bookings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {doctors.length === 0 && <EmptyState title="No doctors yet" />}
        {doctors.map((doc, i) => (
          <div key={doc._id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-accent">
            <span className="w-4 text-xs font-semibold text-muted-foreground">{i + 1}</span>
            <Avatar className="h-10 w-10">
              <AvatarImage src={doc.avatar} alt={doc.name} />
              <AvatarFallback>{getInitials(doc.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
              <p className="truncate text-xs text-muted-foreground">{doc.specialization}</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {doc.bookings} bookings
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
