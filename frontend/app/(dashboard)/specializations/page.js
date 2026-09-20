"use client";

import { BadgeCheck } from "lucide-react";
import { SimpleEntityManager } from "@/components/shared/simple-entity-manager";
import { specializationsApi } from "@/lib/api";

export default function SpecializationsPage() {
  return (
    <SimpleEntityManager
      api={specializationsApi}
      title="Specializations"
      icon={BadgeCheck}
      singular="Specialization"
      placeholder="Search specializations..."
    />
  );
}
