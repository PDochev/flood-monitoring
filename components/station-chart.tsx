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
import type { StationChartProps, ChartData, ViewMode } from "@/lib/definitions";
import { Loader2 } from "lucide-react";
import renderChart from "../components/LinearChart";
import renderTable from "../components/TableReadings";
import {
  fetchReadingsData,
  processReadingsData,
} from "@/lib/services/readings";

export default function StationChart({ stationId }: StationChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasReadings, setHasReadings] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");

  // Function to fetch and process readings data
  const loadReadingsData = useCallback(async () => {
    if (!stationId) return;

    setLoading(true);
    setError(null);
    setHasReadings(false);

    try {
      const data = await fetchReadingsData(stationId);
      setHasReadings(data.length > 0);
      setChartData(processReadingsData(data));
    } catch (err) {
      console.error("Error fetching readings:", err);
      setError("Failed to load station readings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  // Fetch readings data when the component mounts or when stationId changes
  // This ensures that the data is always up to date when the user selects a different station
  // or when the component is first rendered.
  // The useCallback hook is used to memoize the loadReadingsData function
  // so that it doesn't change on every render, which would cause the useEffect to run
  // every time the component re-renders.
  // This is important for performance reasons, especially if the component is re-rendered frequently.
  // By using useCallback, we ensure that the function reference remains the same
  // unless the dependencies (in this case, stationId) change.
  // This prevents unnecessary re-fetching of data when the component re-renders
  // but the stationId remains the same.
  useEffect(() => {
    loadReadingsData();
  }, [loadReadingsData]);

  // Check if the data has stage or downstream values
  const hasStageData = chartData.some((item) => item.stage !== undefined);
  const hasDownstreamData = chartData.some(
    (item) => item.downstream !== undefined
  );

  // Get a subset of data for the table to keep it concise
  // Show every hour instead of every 15 minutes
  // This way we reduce the number of rows in the table
  // index % 4 === 0 means we take every 4th item
  // This will be true for indexes 0, 4, 8, 12, 16, etc.
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
            <CardDescription className="mt-2">
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
                  className="rounded-r-none cursor-pointer"
                  aria-label="View as chart"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chart
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-l-none cursor-pointer"
                  aria-label="View as table"
                >
                  <Table2 className="h-4 w-4 mr-2" />
                  Table
                </Button>
              </div>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={loadReadingsData}
                className="ml-2"
                aria-label="Refresh data"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
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
