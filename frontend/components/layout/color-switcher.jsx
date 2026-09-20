"use client";

import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useThemeColor } from "@/lib/theme-color-context";
import { cn } from "@/lib/utils";

export function ColorSwitcher() {
  const { color, setColor, presets } = useThemeColor();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0" aria-label="Change theme color">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <p className="mb-3 text-sm font-semibold text-foreground">Dashboard color</p>
        <div className="grid grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setColor(preset.value)}
              className="flex flex-col items-center gap-1.5"
              title={preset.name}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-popover transition-all",
                  color === preset.value ? "ring-foreground" : "ring-transparent"
                )}
                style={{ backgroundColor: `hsl(${preset.primary})` }}
              >
                {color === preset.value && <Check className="h-4 w-4 text-white" />}
              </span>
              <span className="text-[10px] text-muted-foreground">{preset.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
