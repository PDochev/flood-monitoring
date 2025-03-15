export async function getStations() {
  const response = await fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/stations?_limit=50",
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
