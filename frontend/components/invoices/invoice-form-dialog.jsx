"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
import { invoicesApi, patientsApi, doctorsApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const EMPTY_ITEM = { name: "", description: "", unitCost: 0, quantity: 1 };
const EMPTY_FORM = {
  patient: "",
  doctor: "",
  dueDate: "",
  taxPercent: 9,
  discountPercent: 0,
  recurring: "None",
  status: "Due",
  items: [EMPTY_ITEM],
};

export function InvoiceFormDialog({ open, onOpenChange, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    patientsApi.list({ limit: 100 }).then((res) => setPatients(res.data.data));
    doctorsApi.list({ limit: 100 }).then((res) => setDoctors(res.data.data));
  }, [open]);

  const updateItem = (idx, key, value) => {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...f, items };
    });
  };

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, EMPTY_ITEM] }));
  const removeItem = (idx) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const subtotal = form.items.reduce((s, i) => s + Number(i.unitCost || 0) * Number(i.quantity || 0), 0);
  const total =
    subtotal + (subtotal * Number(form.taxPercent || 0)) / 100 - (subtotal * Number(form.discountPercent || 0)) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await invoicesApi.create(form);
      toast({ title: "Invoice created", variant: "success" });
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
          <DialogDescription>Generate a billing invoice for a patient.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Patient</Label>
              <Select value={form.patient} onValueChange={(v) => setForm((f) => ({ ...f, patient: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Doctor</Label>
              <Select value={form.doctor} onValueChange={(v) => setForm((f) => ({ ...f, doctor: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Items</Label>
              <Button type="button" size="sm" variant="outline" onClick={addItem}>
                <Plus className="h-3.5 w-3.5" /> Add item
              </Button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center gap-2">
                  <Input
                    className="col-span-5"
                    placeholder="Item name"
                    required
                    value={item.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                  />
                  <Input
                    className="col-span-3"
                    type="number"
                    min={0}
                    placeholder="Unit cost"
                    required
                    value={item.unitCost}
                    onChange={(e) => updateItem(idx, "unitCost", e.target.value)}
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    min={1}
                    placeholder="Qty"
                    required
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="col-span-2 text-destructive"
                    onClick={() => removeItem(idx)}
                    disabled={form.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Tax (%)</Label>
              <Input
                type="number"
                value={form.taxPercent}
                onChange={(e) => setForm((f) => ({ ...f, taxPercent: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                value={form.discountPercent}
                onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Recurring</Label>
              <Select value={form.recurring} onValueChange={(v) => setForm((f) => ({ ...f, recurring: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["None", "Monthly", "Quarterly", "Yearly"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
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
                  {["Paid", "Due", "Overdue", "Cancelled"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end rounded-xl bg-muted p-4 text-sm">
            <div className="w-48 space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span> <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground">
                <span>Total</span> <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !form.patient}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
