import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({ page, pages, onPageChange, total }) {
  if (pages <= 1) return null;

  const items = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(pages, start + 2);

  for (let i = start; i <= end; i++) items.push(i);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-1 py-4 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{pages}</span>
        {typeof total === "number" && <> &middot; {total} total records</>}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {items.map((i) => (
          <Button
            key={i}
            size="icon"
            variant={i === page ? "default" : "outline"}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        ))}
        <Button variant="outline" size="icon" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
