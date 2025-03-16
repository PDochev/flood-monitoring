"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { StationSelectorProps } from "@/lib/definitions";

export default function StationSelector({
  stations,
  onStationSelect,
}: StationSelectorProps) {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const handleStationChange = (value: string) => {
    setSelectedStation(value);
    onStationSelect(value);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
      <Label className="text-md">Select a measurement station</Label>
      <Select
        onValueChange={handleStationChange}
        value={selectedStation || undefined}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a station" />
        </SelectTrigger>
        <SelectContent className="w-[280px]">
          <SelectGroup>
            {stations && stations.length > 0 ? (
              stations.map((station) => (
                <SelectItem key={station["@id"]} value={station["@id"]}>
                  {station.catchmentName || station.label || "Unnamed Station"}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-stations" disabled>
                No stations available
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
