"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeColorProvider } from "@/lib/theme-color-context";
import { ToastProvider } from "@/lib/toast-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeColorProvider>
        <ToastProvider>
          <TooltipProvider delayDuration={200}>
            <AuthProvider>{children}</AuthProvider>
          </TooltipProvider>
        </ToastProvider>
      </ThemeColorProvider>
    </ThemeProvider>
  );
}
