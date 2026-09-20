"use client";

import { Search, LayoutGrid, List as ListIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Toolbar({ search, onSearchChange, placeholder = "Search...", view, onViewChange, right }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        {right}
        {onViewChange && (
          <div className="flex items-center rounded-lg border border-border p-1">
            <button
              onClick={() => onViewChange("grid")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange("list")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
