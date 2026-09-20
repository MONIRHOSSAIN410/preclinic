"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MoreVertical, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Toolbar } from "@/components/shared/toolbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ServiceFormDialog } from "@/components/services/service-form-dialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { servicesApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { formatCurrency } from "@/lib/utils";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await servicesApi.list({ search: debouncedSearch, page, limit: 10 });
      setServices(data.data);
      setMeta({ pages: data.pages, total: data.total });
    } catch {
      toast({ title: "Could not load services", variant: "error" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await servicesApi.remove(deleteTarget._id);
      toast({ title: "Service removed", variant: "success" });
      setDeleteTarget(null);
      fetchServices();
    } catch {
      toast({ title: "Could not delete service", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description={`Total Services: ${meta.total}`}
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> New Service
          </Button>
        }
      />

      <Toolbar search={search} onSearchChange={setSearch} placeholder="Search services..." />

      {loading ? (
        <Skeleton className="h-96" />
      ) : services.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No services found" />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s._id}>
                  <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                  <TableCell>{s.department}</TableCell>
                  <TableCell>{formatCurrency(s.price)}</TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
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
                            setEditing(s);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(s)}
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
          <Pagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />
        </div>
      )}

      <ServiceFormDialog open={formOpen} onOpenChange={setFormOpen} service={editing} onSaved={fetchServices} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete this service?"
        description={`${deleteTarget?.name || "This service"} will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
