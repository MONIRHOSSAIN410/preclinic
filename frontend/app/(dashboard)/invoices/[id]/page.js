"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Printer, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { invoicesApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoicesApi
      .get(id)
      .then((res) => setInvoice(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!invoice) return <p className="text-muted-foreground">Invoice not found.</p>;

  const subtotal = invoice.items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
  const tax = (subtotal * invoice.taxPercent) / 100;
  const discount = (subtotal * invoice.discountPercent) / 100;
  const total = subtotal + tax - discount;
  const daysLeft = Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold">Preclinic</span>
                </div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="font-semibold text-foreground">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={invoice.status} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {daysLeft >= 0 ? `Due in ${daysLeft} days` : `Overdue by ${Math.abs(daysLeft)} days`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 border-b border-border py-6 sm:grid-cols-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Issued On</p>
                <p className="text-sm text-foreground">{formatDate(invoice.issuedOn)}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Due Date</p>
                <p className="text-sm text-foreground">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Recurring</p>
                <p className="text-sm text-foreground">{invoice.recurring}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Invoice To</p>
                <p className="text-sm font-medium text-foreground">{invoice.patient?.name}</p>
                <p className="text-xs text-muted-foreground">{invoice.patient?.email}</p>
                <p className="text-xs text-muted-foreground">{invoice.patient?.address}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Attending Doctor</p>
                <p className="text-sm font-medium text-foreground">{invoice.doctor?.name}</p>
                <p className="text-xs text-muted-foreground">{invoice.doctor?.specialization}</p>
              </div>
            </div>

            <div className="py-6">
              <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Products / Service Items</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                      <th className="py-2 pr-4">#</th>
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-4">Unit Cost</th>
                      <th className="py-2 pr-4">Quantity</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4 text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 pr-4">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </td>
                        <td className="py-3 pr-4">{formatCurrency(item.unitCost)}</td>
                        <td className="py-3 pr-4">{item.quantity}</td>
                        <td className="py-3 text-right font-medium">
                          {formatCurrency(item.unitCost * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
              <div className="max-w-xs text-xs text-muted-foreground">
                <p className="mb-1 text-xs font-semibold uppercase text-foreground">Bank Details</p>
                <p>Bank Name: {invoice.bankName}</p>
                <p>Account Number: {invoice.accountNumber}</p>
                <p>IFSC Code: {invoice.ifscCode}</p>
                <p>Payment Reference: {invoice.invoiceNumber}</p>
              </div>
              <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Amount</span> <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax ({invoice.taxPercent}%)</span> <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount ({invoice.discountPercent}%)</span> <span>-{formatCurrency(discount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold text-foreground">
                  <span>Total</span> <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
