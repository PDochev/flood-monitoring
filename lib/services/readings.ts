import type { Reading, ChartData } from "@/lib/definitions";

export const fetchReadingsData = async (
  stationId: string
): Promise<Reading[]> => {
  if (!stationId) throw new Error("Station ID is required");

  // We use encodeURIComponent() when constructing URLs to ensure that special characters
  // in parameter values are properly encoded so they don't interfere with URL syntax.
  // The stationId might contain characters that have special meaning in URLs, such as: /, ?, &, etc.
  // If the stationId contained characters like & or ?, it would break the URL structure.
  // For example, if stationId was "station&param=123", without encoding, the URL would become .../readings?stationId=station&param=123&_t=...
  // which would be interpreted as having an additional parameter named param.

  // Date.now() is used to append a timestamp to the URL
  // This is a common technique to prevent caching issues, especially in development environments.
  // By appending a timestamp, we ensure that the browser treats each request as unique,
  // and it won't serve a cached version of the response.
  // This is particularly useful when we want to ensure that we always get the latest data from the server
  // and not a stale version from the browser cache.
  // Its not compulsory to use it in production, but it can be helpful during development
  // to avoid caching issues.
  const response = await fetch(
    `/api/readings?stationId=${encodeURIComponent(stationId)}&_t=${Date.now()}`
  );

  if (!response.ok) throw new Error("Failed to fetch station readings");

  return response.json();
};

export const processReadingsData = (readings: Reading[]): ChartData[] => {
  // Record<K, V> is a utility type in TypeScript that creates an object type with keys of type K and values of type V.
  // groupedReadings is an object
  // Its keys are strings in this case, date-time strings (timestamps)
  // Its values are objects of type ChartData
  const groupedReadings: Record<string, ChartData> = {};

  // Loop through each reading
  for (const reading of readings) {
    // Get the dateTime from the reading
    const dateTime = reading.dateTime;

    // This block of code is checking if an entry for a specific timestamp already exists in the groupedReadings object.
    // If it doesn't, it creates a new entry.
    if (!groupedReadings[dateTime]) {
      groupedReadings[dateTime] = {
        dateTime,
        time: new Date(dateTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }

    // Add the appropriate value based on the measure type
    // The measure type is a string that describes the type of reading
    // It can be "stage" or "downstage"
    // If the measure type includes "stage" but not "downstage", we set the stage value
    // If the measure type includes "downstage", we set the downstream value
    if (
      reading.measure.includes("stage") &&
      !reading.measure.includes("downstage")
    ) {
      groupedReadings[dateTime].stage = reading.value;
    } else if (reading.measure.includes("downstage")) {
      groupedReadings[dateTime].downstream = reading.value;
    }
  }

  console.log("Grouped Readings:", groupedReadings);

  // Object.values() returns an array of a given object's own enumerable property values
  // We sort the array of values by date-time
  // This way we get an array of ChartData objects sorted by date-time
  // new Date("2025-03-30T15:45:00Z").getTime() === 1743356700000
  // This converts the date-time string to a timestamp (number of milliseconds since epoch)
  // The getTime() method returns the number of milliseconds since January 1, 1970, 00:00:00 UTC
  // This array will be used to render the chart
  // The subtraction a.time - b.time returns:
  // - A negative number if a is before b (earlier)
  // - A positive number if a is after b (later)
  // - Zero if they are equal
  return Object.values(groupedReadings).sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );
};
