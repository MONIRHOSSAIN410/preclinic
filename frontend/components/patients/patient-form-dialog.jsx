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
import { patientsApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  gender: "Male",
  bloodGroup: "O+ve",
  dob: "",
  address: "",
  status: "Active",
};

const BLOOD_GROUPS = ["A+ve", "A-ve", "B+ve", "B-ve", "O+ve", "O-ve", "AB+ve", "AB-ve"];

export function PatientFormDialog({ open, onOpenChange, patient, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (patient) {
      setForm({
        ...EMPTY_FORM,
        ...patient,
        dob: patient.dob ? new Date(patient.dob).toISOString().slice(0, 10) : "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [patient, open]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (patient?._id) {
        await patientsApi.update(patient._id, form);
        toast({ title: "Patient updated", variant: "success" });
      } else {
        await patientsApi.create(form);
        toast({ title: "Patient added", variant: "success" });
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
          <DialogTitle>{patient?._id ? "Edit Patient" : "Create Patient"}</DialogTitle>
          <DialogDescription>Fill in the patient&apos;s details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Full name</Label>
            <Input required value={form.name} onChange={update("name")} placeholder="Alberto Ripley" />
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
            <Label>Date of birth</Label>
            <Input type="date" value={form.dob} onChange={update("dob")} />
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
            <Label>Blood group</Label>
            <Select value={form.bloodGroup} onValueChange={(v) => setForm((f) => ({ ...f, bloodGroup: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
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
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={update("address")} placeholder="Street, City, Country" />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {patient?._id ? "Save changes" : "Create patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
