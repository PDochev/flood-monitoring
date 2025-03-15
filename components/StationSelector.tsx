"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Station } from "@/lib/definitions";

export default function StationSelector({ stations }: { stations: Station[] }) {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  return (
    <div className="flex justify-center items-center gap-4">
      <Label>Select a station</Label>
      <Select
        onValueChange={setSelectedStation}
        value={selectedStation || undefined}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a station" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Stations</SelectLabel>
            {stations.map((station) => (
              <SelectItem key={station["@id"]} value={station["@id"]}>
                {station.catchmentName || station.label || "Unnamed Station"}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
