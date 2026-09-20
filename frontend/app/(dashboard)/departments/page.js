"use client";

import { Building2 } from "lucide-react";
import { SimpleEntityManager } from "@/components/shared/simple-entity-manager";
import { departmentsApi } from "@/lib/api";

export default function DepartmentsPage() {
  return (
    <SimpleEntityManager
      api={departmentsApi}
      title="Departments"
      icon={Building2}
      singular="Department"
      placeholder="Search departments..."
    />
  );
}
