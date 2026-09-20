"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, CalendarClock, Pencil, Trash2, MoreVertical } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppointmentFormDialog } from "@/components/appointments/appointment-form-dialog";
import { appointmentsApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { getInitials, formatDateTime } from "@/lib/utils";

const STATUS_OPTIONS = ["All", "Scheduled", "Confirmed", "Checked In", "Checked Out", "Cancelled", "Rescheduled"];

export default function AppointmentsPage() {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sort: "-date" };
      if (status !== "All") params.status = status;
      const { data } = await appointmentsApi.list(params);
      setAppointments(data.data);
      setMeta({ pages: data.pages, total: data.total });
    } catch {
      toast({ title: "Could not load appointments", variant: "error" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await appointmentsApi.remove(deleteTarget._id);
      toast({ title: "Appointment cancelled", variant: "success" });
      setDeleteTarget(null);
      fetchAppointments();
    } catch {
      toast({ title: "Could not delete appointment", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = appointments.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.patient?.name?.toLowerCase().includes(q) || a.doctor?.name?.toLowerCase().includes(q);
  });

  return (
    <div>
      <PageHeader
        title="Appointments"
        description={`Total appointments: ${meta.total}`}
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> New Appointment
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient or doctor..."
          className="sm:max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : filtered.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No appointments found" />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{formatDateTime(a.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={a.patient?.avatar} />
                        <AvatarFallback>{getInitials(a.patient?.name || "P")}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{a.patient?.name}</span>
                    </div>
                  </TableCell>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(a);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(a)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />
        </div>
      )}

      <AppointmentFormDialog open={formOpen} onOpenChange={setFormOpen} appointment={editing} onSaved={fetchAppointments} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Cancel this appointment?"
        description="This will permanently remove the appointment record."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
