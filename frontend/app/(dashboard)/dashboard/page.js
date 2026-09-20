"use client";

import { useEffect, useState } from "react";
import { Users, Stethoscope, CalendarClock, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AppointmentChart } from "@/components/dashboard/appointment-chart";
import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import { PopularDoctors } from "@/components/dashboard/popular-doctors";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .summary()
      .then((res) => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const counters = data?.counters || { doctors: 0, patients: 0, appointments: 0, revenue: 0 };
  const appointmentDates = (data?.recentAppointments || []).map((a) => a.date);

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Welcome back — here's what's happening at your clinic today." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Stethoscope} label="Doctors" value={counters.doctors} trend={8} accent="primary" delay={0} />
        <StatCard icon={Users} label="Patients" value={counters.patients} trend={12} accent="info" delay={0.05} />
        <StatCard
          icon={CalendarClock}
          label="Appointments"
          value={counters.appointments}
          trend={-3}
          accent="warning"
          delay={0.1}
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={formatCurrency(counters.revenue)}
          trend={16}
          accent="success"
          delay={0.15}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AppointmentChart data={data?.monthlyAppointments || []} />
        <MiniCalendar highlightDates={appointmentDates} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentAppointments appointments={data?.recentAppointments || []} />
        <PopularDoctors doctors={data?.popularDoctors || []} />
      </div>
    </div>
  );
}
