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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { doctorsApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const SPECIALIZATIONS = [
  "Cardiologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Gynecologist",
  "Psychiatrist",
  "Oncologist",
  "Pulmonologist",
  "Urologist",
  "Practitioner",
  "Surgeon",
  "Neurosurgeon",
  "Dermatologist",
  "Dentist",
  "Ophthalmologist",
];

const DEPARTMENTS = [
  "General Medicine",
  "Cardiology",
  "Dentistry",
  "Ophthalmology",
  "Radiology",
  "Physiotherapy",
  "Pathology",
  "ENT",
  "Nutrition",
  "Oncology",
  "Gynecology",
  "Psychiatry",
  "Urology",
  "Pulmonology",
  "Neurosurgery",
  "Dermatology",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  specialization: SPECIALIZATIONS[0],
  department: DEPARTMENTS[0],
  designation: "Consultant",
  gender: "Male",
  experience: 1,
  fees: 200,
  status: "Active",
};

export function DoctorFormDialog({ open, onOpenChange, doctor, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (doctor) {
      setForm({ ...EMPTY_FORM, ...doctor });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [doctor, open]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (doctor?._id) {
        await doctorsApi.update(doctor._id, form);
        toast({ title: "Doctor updated", variant: "success" });
      } else {
        await doctorsApi.create(form);
        toast({ title: "Doctor added", variant: "success" });
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
          <DialogTitle>{doctor?._id ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
          <DialogDescription>Fill in the doctor&apos;s details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Full name</Label>
            <Input required value={form.name} onChange={update("name")} placeholder="Dr. John Smith" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input required type="email" value={form.email} onChange={update("email")} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input required value={form.phone} onChange={update("phone")} />
          </div>
          <div className="space-y-1.5">
            <Label>Specialization</Label>
            <Select value={form.specialization} onValueChange={(v) => setForm((f) => ({ ...f, specialization: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPECIALIZATIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Select value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Experience (years)</Label>
            <Input type="number" min={0} value={form.experience} onChange={update("experience")} />
          </div>
          <div className="space-y-1.5">
            <Label>Consultation fee ($)</Label>
            <Input type="number" min={0} value={form.fees} onChange={update("fees")} />
          </div>
          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {doctor?._id ? "Save changes" : "Add doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
