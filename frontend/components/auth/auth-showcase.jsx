"use client";

import { motion } from "framer-motion";
import { Stethoscope, ShieldCheck, Activity, Users2 } from "lucide-react";

const FEATURES = [
  { icon: Users2, text: "Manage doctors, patients & appointments in one place" },
  { icon: Activity, text: "Real-time clinic activity feed & analytics" },
  { icon: ShieldCheck, text: "Secure, role-based admin access" },
];

export function AuthShowcase() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/70 p-10 text-primary-foreground lg:flex">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <Stethoscope className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold">Preclinic</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative"
      >
        <h2 className="mb-4 max-w-md text-3xl font-bold leading-tight">
          Run your clinic smarter, from a single dashboard.
        </h2>
        <p className="mb-8 max-w-sm text-sm text-primary-foreground/80">
          Preclinic brings your doctors, patients, appointments, billing and
          reports together — fast, responsive, and built for busy clinics.
        </p>
        <div className="space-y-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur"
            >
              <f.icon className="h-4 w-4 shrink-0" />
              <span className="text-sm">{f.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <p className="relative text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Preclinic. All rights reserved.
      </p>
    </div>
  );
}
