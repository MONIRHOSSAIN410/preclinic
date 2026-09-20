"use client";

import { MapPin } from "lucide-react";
import { SimpleEntityManager } from "@/components/shared/simple-entity-manager";
import { locationsApi } from "@/lib/api";

export default function LocationsPage() {
  return (
    <SimpleEntityManager
      api={locationsApi}
      title="Locations"
      icon={MapPin}
      singular="Location"
      placeholder="Search locations..."
      secondField={{ key: "address", label: "Address" }}
    />
  );
}
