export async function getStations() {
  const response = await fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/stations?_limit=200",
    {
      // We don't want to cache this request as the data changes every hour
      // and we want to fetch the latest data every time
      // This way we avoid showing stale data to the user
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stations");
  }

  const data = await response.json();
  // If there is no any stations found in the response we throw an error
  if (!data.items) {
    throw new Error("No stations found in the response");
  }

  // Return the stations array or an empty array if no stations are found
  return data.items || [];
}

export async function getStationReadings(stationId: string) {
  // Extract the station reference from the full URI
  // Example: stationId = "https://environment.data.gov.uk/flood-monitoring/id/stations/1029TH"
  // After calling split("/"), we get an array like: ["https:", "", "environment.data.gov.uk", "flood-monitoring", "id", "stations", "1029TH"]
  // We then call pop() to get the last element of the array which is the station reference
  // In this case, stationRef = "1029TH"
  // This way we extract the station reference from the full URI
  const stationRef = stationId.split("/").pop();

  const response = await fetch(
    `https://environment.data.gov.uk/flood-monitoring/id/stations/${stationRef}/readings?_sorted&_limit=200`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch readings for station ${stationRef}`);
  }

  const data = await response.json();
  if (!data.items) {
    throw new Error("No readings found in the response");
  }
  return data.items || [];
}
