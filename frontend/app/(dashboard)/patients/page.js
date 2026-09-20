"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Toolbar } from "@/components/shared/toolbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientFormDialog } from "@/components/patients/patient-form-dialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { patientsApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await patientsApi.list({ search: debouncedSearch, page, limit: 12 });
      setPatients(data.data);
      setMeta({ pages: data.pages, total: data.total });
    } catch {
      toast({ title: "Could not load patients", variant: "error" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await patientsApi.remove(deleteTarget._id);
      toast({ title: "Patient removed", variant: "success" });
      setDeleteTarget(null);
      fetchPatients();
    } catch {
      toast({ title: "Could not delete patient", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Patient Grid"
        description={`Total Patients: ${meta.total}`}
        actions={
          <Button
            onClick={() => {
              setEditingPatient(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> New Patient
          </Button>
        }
      />

      <Toolbar search={search} onSearchChange={setSearch} placeholder="Search patients by name, phone, ID..." />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : patients.length === 0 ? (
        <EmptyState icon={Users} title="No patients found" description="Try a different search or add a new patient." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((p, i) => (
            <PatientCard
              key={p._id}
              patient={p}
              index={i}
              onEdit={(patient) => {
                setEditingPatient(patient);
                setFormOpen(true);
              }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Pagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />

      <PatientFormDialog open={formOpen} onOpenChange={setFormOpen} patient={editingPatient} onSaved={fetchPatients} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete this patient?"
        description={`${deleteTarget?.name || "This patient"} will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
