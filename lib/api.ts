export async function getStations() {
  const response = await fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/stations?_limit=50",
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stations");
  }

  const data = await response.json();
  return data.items || []; // 'items' contains the list of stations
}
