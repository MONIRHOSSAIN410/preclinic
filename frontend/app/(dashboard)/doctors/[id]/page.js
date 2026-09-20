"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Briefcase,
  Clock,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorFormDialog } from "@/components/doctors/doctor-form-dialog";
import { doctorsApi } from "@/lib/api";
import { getInitials } from "@/lib/utils";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchDoctor = () => {
    setLoading(true);
    doctorsApi
      .get(id)
      .then((res) => setDoctor(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!doctor) return <p className="text-muted-foreground">Doctor not found.</p>;

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-6 overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-primary to-primary/60" />
          <CardContent className="-mt-14 p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                  <AvatarImage src={doctor.avatar} alt={doctor.name} />
                  <AvatarFallback className="text-2xl">{getInitials(doctor.name)}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl font-bold text-foreground">{doctor.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialization} &middot; {doctor.department}
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                    <Badge variant={doctor.status === "Active" ? "success" : "secondary"}>{doctor.status}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {doctor.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {doctor.bio || "No biography provided yet."}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Mail} label="Email" value={doctor.email} />
                <InfoRow icon={Phone} label="Phone" value={doctor.phone} />
                <InfoRow icon={MapPin} label="Address" value={doctor.address} />
                <InfoRow icon={Briefcase} label="Designation" value={doctor.designation} />
                <InfoRow icon={Clock} label="Available Hours" value={`${doctor.availableFrom} - ${doctor.availableTo}`} />
                <InfoRow icon={Briefcase} label="Experience" value={`${doctor.experience} years`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatRow label="Total Bookings" value={doctor.bookings} />
              <StatRow label="Consultation Fee" value={`$${doctor.fees}`} />
              <StatRow label="Rating" value={`${doctor.rating?.toFixed(1)} / 5.0`} />
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Available Days</p>
                <div className="flex flex-wrap gap-1.5">
                  {(doctor.availableDays || []).map((d) => (
                    <Badge key={d} variant="outline">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <DoctorFormDialog open={editOpen} onOpenChange={setEditOpen} doctor={doctor} onSaved={fetchDoctor} />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value || "-"}</p>
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
