import type { Reading, ChartData } from "@/lib/definitions";

export const fetchReadingsData = async (
  stationId: string
): Promise<Reading[]> => {
  if (!stationId) throw new Error("Station ID is required");

  // We use encodeURIComponent() when constructing URLs to ensure that special characters
  // in parameter values are properly encoded so they don't interfere with URL syntax.
  // The stationId might contain characters that have special meaning in URLs, such as: /, ?, &, etc.
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

  // Object.values() returns an array of a given object's own enumerable property values
  // We sort the array of values by date-time
  // This way we get an array of ChartData objects sorted by date-time
  // This array will be used to render the chart
  return Object.values(groupedReadings).sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );
};
