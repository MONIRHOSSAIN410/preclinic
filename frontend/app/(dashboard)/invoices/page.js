"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Receipt, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { InvoiceFormDialog } from "@/components/invoices/invoice-form-dialog";
import { invoicesApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { formatCurrency, formatDate } from "@/lib/utils";

function invoiceTotal(inv) {
  const subtotal = inv.items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
  const tax = (subtotal * inv.taxPercent) / 100;
  const discount = (subtotal * inv.discountPercent) / 100;
  return subtotal + tax - discount;
}

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await invoicesApi.list({ page, limit: 10, sort: "-issuedOn" });
      setInvoices(data.data);
      setMeta({ pages: data.pages, total: data.total });
    } catch {
      toast({ title: "Could not load invoices", variant: "error" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`Total Invoices: ${meta.total}`}
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> New Invoice
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-96" />
      ) : invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices found" />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Issued On</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv._id}>
                  <TableCell className="font-medium text-foreground">{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.patient?.name}</TableCell>
                  <TableCell>{formatDate(inv.issuedOn)}</TableCell>
                  <TableCell>{formatDate(inv.dueDate)}</TableCell>
                  <TableCell>{formatCurrency(invoiceTotal(inv))}</TableCell>
                  <TableCell>
                    <StatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/invoices/${inv._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />
        </div>
      )}

      <InvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} onSaved={fetchInvoices} />
    </div>
  );
}
