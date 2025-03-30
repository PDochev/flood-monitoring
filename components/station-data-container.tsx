"use client";

import { useState } from "react";
import StationSelector from "@/components/station-selector";
import StationChart from "@/components/station-chart";
import type { Station } from "@/lib/definitions";

// This component is used to so that a client component can be used in a server component
// It maintains the selectedStationId state, which tracks which station the user has selected.
// It allows us to use the StationSelector and StationChart components
// It only renders the StationChart component when a station is actually selected ({selectedStationId && <StationChart stationId={selectedStationId} />}).
export default function StationDataContainer({
  stations,
}: {
  stations: Station[];
}) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null
  );

  return (
    <div>
      <StationSelector
        stations={stations}
        onStationSelect={setSelectedStationId}
      />

      {selectedStationId && <StationChart stationId={selectedStationId} />}
    </div>
  );
}
