"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBreakdownList } from "@/components/reports/status-breakdown-list";
import { DepartmentChart } from "@/components/reports/department-chart";
import { dashboardApi } from "@/lib/api";

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .reports()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Reports" description="Clinic-wide performance breakdown across appointments and billing." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusBreakdownList
          title="Appointments by Status"
          description="Distribution of all appointments"
          data={data?.appointmentsByStatus || []}
        />
        <StatusBreakdownList
          title="Invoices by Status"
          description="Distribution of billing status"
          data={data?.invoicesByStatus || []}
        />
      </div>

      <div className="mt-4">
        <DepartmentChart data={data?.departmentBreakdown || []} />
      </div>
    </div>
  );
}
