"use client";

import { useEffect, useState, useCallback } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { BarChart3, Table2 } from "lucide-react";
import type {
  Reading,
  StationChartProps,
  ChartData,
  ViewMode,
} from "@/lib/definitions";
import { Loader2 } from "lucide-react";
import renderChart from "../components/LinearChart";
import renderTable from "../components/TableReadings";

export default function StationChart({ stationId }: StationChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasReadings, setHasReadings] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");

  // Function to fetch readings data
  const fetchReadingsData = useCallback(async () => {
    if (!stationId) return;

    setLoading(true);
    setError(null);
    setHasReadings(false);

    try {
      // We use encodeURIComponent() when constructing URLs to ensure that special characters in parameter values are properly encoded so they don't interfere with URL syntax.
      // The stationId might contain characters that have special meaning in URLs, such as: /, ?, &, etc.
      const response = await fetch(
        `/api/readings?stationId=${encodeURIComponent(
          stationId
        )}&_t=${Date.now()}`
      );

      if (!response.ok) throw new Error("Failed to fetch station readings");

      const data = await response.json();
      setHasReadings(data.length > 0);
      setChartData(processReadingsData(data));
    } catch (err) {
      console.error("Error fetching readings:", err);
      setError("Failed to load station readings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchReadingsData();
  }, [fetchReadingsData]);

  // Process the readings data for the chart
  function processReadingsData(readings: Reading[]): ChartData[] {
    // Record<K, V> is a utility type in TypeScript that creates an object type with keys of type K and values of type V.
    // groupedReadings is an object
    // Its keys are strings in this case, date-time strings (timestapms)
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
  }

  // Check if the data has stage or downstream values
  const hasStageData = chartData.some((item) => item.stage !== undefined);
  const hasDownstreamData = chartData.some(
    (item) => item.downstream !== undefined
  );

  // Get a subset of data for the table to keep it concise
  // Show every hour instead of every 15 minutes
  // This way we reduce the number of rows in the table
  const tableData = chartData.filter((_, index) => index % 4 === 0);

  if (!stationId) {
    return null;
  }

  return (
    <Card className="w-full xl:w-3/4 mt-8 mx-auto shadow-xl mb-12 bg-gray-50/80">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Water Level Readings</CardTitle>
            <CardDescription>
              Last 24 hours of water level data for the selected station
            </CardDescription>
          </div>
          {hasReadings && chartData.length > 0 && (
            <div className="flex items-center justify-around space-x-2">
              <span className="text-sm text-muted-foreground mr-2">
                View as:
              </span>
              <div className="inline-flex rounded-md">
                <Button
                  variant={viewMode === "chart" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("chart")}
                  className="rounded-r-none "
                  aria-label="View as chart"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chart
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-l-none"
                  aria-label="View as table"
                >
                  <Table2 className="h-4 w-4 mr-2" />
                  Table
                </Button>
              </div>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={fetchReadingsData}
                className="ml-2"
                aria-label="Refresh data"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button> */}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[400px] text-red-500">
            {error}
          </div>
        ) : hasReadings ? (
          chartData.length > 0 ? (
            viewMode === "chart" ? (
              renderChart({ chartData, hasStageData, hasDownstreamData })
            ) : (
              renderTable({ tableData, hasStageData, hasDownstreamData })
            )
          ) : (
            <div className="flex justify-center items-center h-[400px] text-muted-foreground">
              No data available for this station
            </div>
          )
        ) : (
          <div className="flex flex-col justify-center items-center h-[400px] space-y-2">
            <div className="text-amber-600 font-medium text-lg">
              No current readings available
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Try selecting a different station to view water level data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
