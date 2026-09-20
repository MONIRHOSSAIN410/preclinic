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
import { servicesApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

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

const EMPTY_FORM = { name: "", department: DEPARTMENTS[0], price: 100, status: "Active", description: "" };

export function ServiceFormDialog({ open, onOpenChange, service, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setForm(service ? { ...EMPTY_FORM, ...service } : EMPTY_FORM);
  }, [service, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (service?._id) {
        await servicesApi.update(service._id, form);
        toast({ title: "Service updated", variant: "success" });
      } else {
        await servicesApi.create(form);
        toast({ title: "Service created", variant: "success" });
      }
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Something went wrong", description: err?.response?.data?.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service?._id ? "Edit Service" : "New Service"}</DialogTitle>
          <DialogDescription>Define a billable clinical service.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Service name</Label>
            <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              <Label>Price ($)</Label>
              <Input
                type="number"
                min={0}
                required
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {service?._id ? "Save changes" : "Create service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
