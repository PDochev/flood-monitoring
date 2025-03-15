export async function getStations() {
  const response = await fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/stations?_limit=100",
    { next: { revalidate: 3600 } } // This will revalidate the data every hour
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stations");
  }

  const data = await response.json();
  if (!data.items) {
    throw new Error("No stations found in the response");
  }

  return data.items || [];
}

export async function getStationReadings(stationId: string) {
  // Extract the station reference from the full URI
  const stationRef = stationId.split("/").pop();

  const response = await fetch(
    `https://environment.data.gov.uk/flood-monitoring/id/stations/${stationRef}/readings?_sorted&_limit=100`,
    { next: { revalidate: 300 } } // Revalidate every 5 minutes
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch readings for station ${stationRef}`);
  }

  const data = await response.json();
  return data.items || [];
}
