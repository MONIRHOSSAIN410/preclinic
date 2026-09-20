"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Phone, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export function DoctorCard({ doctor, onEdit, onDelete, index = 0 }) {
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
              <DropdownMenuItem onClick={() => onEdit?.(doctor)}>
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(doctor)} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent className="p-5">
          <Link href={`/doctors/${doctor._id}`} className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 ring-4 ring-primary/10">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback className="text-lg">{getInitials(doctor.name)}</AvatarFallback>
            </Avatar>
            <h3 className="mt-3 font-semibold text-foreground">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>

            <div className="mt-2 flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-medium text-foreground">{doctor.rating?.toFixed(1)}</span>
              <span className="text-muted-foreground">({doctor.bookings} bookings)</span>
            </div>

            <div className="mt-3 flex w-full items-center justify-between border-t border-border pt-3 text-xs">
              <Badge variant={doctor.status === "Active" ? "success" : "secondary"}>{doctor.status}</Badge>
              <span className="font-semibold text-foreground">Starts from ${doctor.fees}</span>
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
