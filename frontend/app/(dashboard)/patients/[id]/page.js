"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Pencil,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Weight,
  Droplet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PatientFormDialog } from "@/components/patients/patient-form-dialog";
import { patientsApi } from "@/lib/api";
import { getInitials, formatDate, formatDateTime } from "@/lib/utils";

const VITALS = [
  { key: "bloodPressure", label: "Blood Pressure", icon: Activity, suffix: "" },
  { key: "heartRate", label: "Heart Rate", icon: Heart, suffix: " bpm" },
  { key: "spo2", label: "SPO2", icon: Droplet, suffix: "%" },
  { key: "temperature", label: "Temperature", icon: Thermometer, suffix: "°F" },
  { key: "respiratoryRate", label: "Respiratory Rate", icon: Wind, suffix: "/min" },
  { key: "weight", label: "Weight", icon: Weight, suffix: " kg" },
];

export default function PatientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchPatient = () => {
    setLoading(true);
    patientsApi
      .getFull(id)
      .then((res) => {
        setPatient(res.data.data.patient);
        setAppointments(res.data.data.appointments);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatient();
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

  if (!patient) return <p className="text-muted-foreground">Patient not found.</p>;

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-6">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                <AvatarImage src={patient.avatar} alt={patient.name} />
                <AvatarFallback className="text-xl">{getInitials(patient.name)}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
                  <Badge variant="outline">#{patient.patientId}</Badge>
                </div>
                <p className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground sm:justify-start">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {patient.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {patient.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {patient.address || "-"}
                  </span>
                </p>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" /> Edit Patient
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Date of Birth" value={formatDate(patient.dob)} />
              <InfoItem label="Blood Group" value={patient.bloodGroup} />
              <InfoItem label="Gender" value={patient.gender} />
              <InfoItem label="Last Visited" value={formatDate(patient.lastVisited)} />
              <InfoItem label="Status" value={<StatusBadge status={patient.status} />} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {VITALS.map((v) => (
                <div key={v.key} className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <v.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted-foreground">{v.label}</p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {patient.vitals?.[v.key]}
                      {v.suffix}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Appointment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appointments">
              <TabsList>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                {appointments.length === 0 ? (
                  <EmptyState title="No appointments yet" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((a) => (
                        <TableRow key={a._id}>
                          <TableCell>{formatDateTime(a.date)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{a.doctor?.name}</p>
                              <p className="text-xs text-muted-foreground">{a.doctor?.specialization}</p>
                            </div>
                          </TableCell>
                          <TableCell>{a.mode}</TableCell>
                          <TableCell>
                            <StatusBadge status={a.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
              <TabsContent value="transactions">
                <EmptyState title="No transactions yet" description="Invoices for this patient will appear here." />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <PatientFormDialog open={editOpen} onOpenChange={setEditOpen} patient={patient} onSaved={fetchPatient} />
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value || "-"}</div>
    </div>
  );
}
