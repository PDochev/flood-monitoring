export async function getStations() {
  const response = await fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/stations?_limit=200",
    {
      // Cache for 24 hours, then revalidate in the background
      // This way we avoid fetching the data every time the user visits the page
      // and we can show the data even if the API is down
      // The revalidate option tells Next.js to re-fetch the data in the background
      // after the specified time (in seconds) has passed
      // Benefits:
      // 1. Improved Performance: Reduces load times after the first visit
      // 2. Reduced API Calls: Places less burden on the external API
      // 3. Better User Experience: Stations list loads instantly from cache
      // 4. Still Fresh Enough: 24-hour revalidation catches any station changes
      next: { revalidate: 86400 },
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
  // This manipulation is needed because of how the UK Environment Agency API structures its data
  // When you fetch the list of stations (in getStations()), each station has an @id property that contains the full URI (e.g., "https://environment.data.gov.uk/flood-monitoring/id/stations/1029TH")
  // When you select a station from the UI, you're passing this full URI as the stationId
  // But to query for a specific station's readings, the API endpoint expects just the ID portion, not the full URI
  const stationRef = stationId.split("/").pop();

  const response = await fetch(
    `https://environment.data.gov.uk/flood-monitoring/id/stations/${stationRef}/readings?_sorted&_limit=200`,
    {
      // We don't want to cache this request as the data changes every hour
      // and we want to fetch the latest data every time
      // This way we avoid showing stale data to the user
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
