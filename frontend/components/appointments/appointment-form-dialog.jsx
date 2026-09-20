"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { appointmentsApi, doctorsApi, patientsApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const EMPTY_FORM = {
  patient: "",
  doctor: "",
  date: "",
  time: "10:00",
  mode: "In-person",
  reason: "General Visit",
  status: "Scheduled",
};

export function AppointmentFormDialog({ open, onOpenChange, appointment, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    patientsApi.list({ limit: 100 }).then((res) => setPatients(res.data.data));
    doctorsApi.list({ limit: 100 }).then((res) => setDoctors(res.data.data));
  }, [open]);

  useEffect(() => {
    if (appointment) {
      setForm({
        patient: appointment.patient?._id || appointment.patient,
        doctor: appointment.doctor?._id || appointment.doctor,
        date: appointment.date ? new Date(appointment.date).toISOString().slice(0, 10) : "",
        time: appointment.time || "10:00",
        mode: appointment.mode || "In-person",
        reason: appointment.reason || "General Visit",
        status: appointment.status || "Scheduled",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [appointment, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const doctor = doctors.find((d) => d._id === form.doctor);
      const payload = { ...form, fees: doctor?.fees || 0 };
      if (appointment?._id) {
        await appointmentsApi.update(appointment._id, payload);
        toast({ title: "Appointment updated", variant: "success" });
      } else {
        await appointmentsApi.create(payload);
        toast({ title: "Appointment booked", variant: "success" });
      }
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err?.response?.data?.message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{appointment?._id ? "Edit Appointment" : "New Appointment"}</DialogTitle>
          <DialogDescription>Schedule a visit between a patient and a doctor.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Patient</Label>
            <Select value={form.patient} onValueChange={(v) => setForm((f) => ({ ...f, patient: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name} &middot; #{p.patientId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Doctor</Label>
            <Select value={form.doctor} onValueChange={(v) => setForm((f) => ({ ...f, doctor: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.name} &middot; {d.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Time</Label>
            <Input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Mode</Label>
            <Select value={form.mode} onValueChange={(v) => setForm((f) => ({ ...f, mode: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In-person">In-person</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Scheduled", "Confirmed", "Checked In", "Checked Out", "Cancelled", "Rescheduled"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Input
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="General Visit"
            />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !form.patient || !form.doctor}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {appointment?._id ? "Save changes" : "Book appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
