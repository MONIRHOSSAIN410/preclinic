"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Toolbar } from "@/components/shared/toolbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DoctorCard } from "@/components/doctors/doctor-card";
import { DoctorFormDialog } from "@/components/doctors/doctor-form-dialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { doctorsApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [formOpen, setFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await doctorsApi.list({ search: debouncedSearch, page, limit: 12 });
      setDoctors(data.data);
      setMeta({ pages: data.pages, total: data.total });
    } catch {
      toast({ title: "Could not load doctors", variant: "error" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await doctorsApi.remove(deleteTarget._id);
      toast({ title: "Doctor removed", variant: "success" });
      setDeleteTarget(null);
      fetchDoctors();
    } catch {
      toast({ title: "Could not delete doctor", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Doctor Grid"
        description={`Total Doctors: ${meta.total}`}
        actions={
          <Button
            onClick={() => {
              setEditingDoctor(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> New Doctor
          </Button>
        }
      />

      <Toolbar search={search} onSearchChange={setSearch} placeholder="Search doctors by name, specialization..." />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No doctors found" description="Try a different search or add a new doctor." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {doctors.map((doc, i) => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              index={i}
              onEdit={(d) => {
                setEditingDoctor(d);
                setFormOpen(true);
              }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Pagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />

      <DoctorFormDialog open={formOpen} onOpenChange={setFormOpen} doctor={editingDoctor} onSaved={fetchDoctors} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete this doctor?"
        description={`${deleteTarget?.name || "This doctor"} will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
