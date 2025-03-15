"use client";

import { useState } from "react";
import StationSelector from "@/components/StationSelector";
import StationChart from "@/components/station-chart";
import type { Station } from "@/lib/definitions";

export default function StationDataContainer({
  stations,
}: {
  stations: Station[];
}) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null
  );

  return (
    <>
      <StationSelector
        stations={stations}
        onStationSelect={setSelectedStationId}
      />

      {selectedStationId && <StationChart stationId={selectedStationId} />}
    </>
  );
}
