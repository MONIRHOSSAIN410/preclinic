import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarClock,
  ClipboardList,
  Receipt,
  Activity,
  BarChart3,
  Settings,
  Building2,
  BadgeCheck,
  MapPin,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Clinic",
    items: [
      { label: "Doctors", href: "/doctors", icon: Stethoscope },
      { label: "Patients", href: "/patients", icon: Users },
      { label: "Appointments", href: "/appointments", icon: CalendarClock },
      { label: "Locations", href: "/locations", icon: MapPin },
      { label: "Services", href: "/services", icon: ClipboardList },
      { label: "Departments", href: "/departments", icon: Building2 },
      { label: "Specializations", href: "/specializations", icon: BadgeCheck },
    ],
  },
  {
    label: "Finance",
    items: [{ label: "Invoices", href: "/invoices", icon: Receipt }],
  },
  {
    label: "Insights",
    items: [
      { label: "Activities", href: "/activities", icon: Activity },
      { label: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Preferences",
    items: [{ label: "Settings", href: "/settings", icon: Settings }],
  },
];
