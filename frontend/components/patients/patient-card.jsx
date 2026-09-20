"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, MoreVertical, Pencil, Trash2, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getInitials, formatDate } from "@/lib/utils";

export function PatientCard({ patient, onEdit, onDelete, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
        <div className="absolute right-3 top-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-lg bg-background/70 p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(patient)}>
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(patient)} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent className="p-5">
          <Link href={`/patients/${patient._id}`} className="flex items-start gap-3">
            <Avatar className="h-14 w-14 ring-4 ring-primary/10">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">{patient.name}</p>
              <p className="text-xs text-muted-foreground">
                #{patient.patientId} &middot; {patient.gender}, {computeAge(patient.dob)}
              </p>
              <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" /> Last visit: {formatDate(patient.lastVisited)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {patient.address || "-"}
              </p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function computeAge(dob) {
  if (!dob) return "-";
  const diff = Date.now() - new Date(dob).getTime();
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return `${age}y`;
}
