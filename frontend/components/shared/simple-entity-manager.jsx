"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Toolbar } from "@/components/shared/toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/lib/toast-context";

// Generic manager used by Departments, Specializations and Locations --
// entities that only need a name, one free-text field, and an active flag.
// `secondField` lets a caller rename the free-text column (e.g. "address").
export function SimpleEntityManager({
  api,
  title,
  icon: Icon,
  singular = "item",
  placeholder,
  secondField = { key: "description", label: "Description" },
}) {
  const emptyForm = { name: "", [secondField.key]: "", status: "Active" };
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.list({ search: debouncedSearch, limit: 50 });
      setItems(data.data);
    } catch {
      toast({ title: `Could not load ${title.toLowerCase()}`, variant: "error" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, [secondField.key]: item[secondField.key] || "", status: item.status });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?._id) {
        await api.update(editing._id, form);
        toast({ title: `${singular} updated`, variant: "success" });
      } else {
        await api.create(form);
        toast({ title: `${singular} created`, variant: "success" });
      }
      setFormOpen(false);
      fetchItems();
    } catch (err) {
      toast({ title: "Something went wrong", description: err?.response?.data?.message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.remove(deleteTarget._id);
      toast({ title: `${singular} removed`, variant: "success" });
      setDeleteTarget(null);
      fetchItems();
    } catch {
      toast({ title: "Could not delete", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={`Total ${title}: ${items.length}`}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New {singular}
          </Button>
        }
      />

      <Toolbar search={search} onSearchChange={setSearch} placeholder={placeholder} />

      {loading ? (
        <Skeleton className="h-80" />
      ) : items.length === 0 ? (
        <EmptyState icon={Icon} title={`No ${title.toLowerCase()} found`} />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>{secondField.label}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {item[secondField.key] || "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(item)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${singular}` : `New ${singular}`}</DialogTitle>
            <DialogDescription>Basic details for this {singular.toLowerCase()}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{secondField.label}</Label>
              <Input
                value={form[secondField.key]}
                onChange={(e) => setForm((f) => ({ ...f, [secondField.key]: e.target.value }))}
              />
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
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete this ${singular.toLowerCase()}?`}
        description={`${deleteTarget?.name || "This record"} will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
