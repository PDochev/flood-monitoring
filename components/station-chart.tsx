"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart3, Table2 } from "lucide-react";
import type { Reading } from "@/lib/definitions";
import { Loader2 } from "lucide-react";
import { StationChartProps, ChartData } from "@/lib/definitions";

type ViewMode = "chart" | "table";

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
      // Add a timestamp to bust cache
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/readings?stationId=${encodeURIComponent(
          stationId
        )}&_t=${timestamp}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch station readings");
      }

      const data = await response.json();

      // Check if we have any readings at all
      setHasReadings(data.length > 0);

      // Process the data for the chart
      const processedData = processReadingsData(data);
      setChartData(processedData);
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
    // Group readings by dateTime
    const groupedByDateTime = readings.reduce((acc, reading) => {
      const dateTime = reading.dateTime;

      if (!acc[dateTime]) {
        acc[dateTime] = {
          dateTime,
          time: new Date(dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }

      // Check the measure type and add the value to the appropriate property
      if (
        reading.measure.includes("stage") &&
        !reading.measure.includes("downstage")
      ) {
        acc[dateTime].stage = reading.value;
      } else if (reading.measure.includes("downstage")) {
        acc[dateTime].downstream = reading.value;
      }

      return acc;
    }, {} as Record<string, ChartData>);

    // Convert to array and sort by dateTime
    return Object.values(groupedByDateTime).sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
  }

  const hasStageData = chartData.some((item) => item.stage !== undefined);
  const hasDownstreamData = chartData.some(
    (item) => item.downstream !== undefined
  );

  // Get a subset of data for the table to keep it concise
  // Show every hour instead of every 15 minutes
  const tableData = chartData.filter((_, index) => index % 4 === 0);

  if (!stationId) {
    return null;
  }

  const renderChart = () => (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottomRight",
              offset: -10,
            }}
          />
          <YAxis
            label={{
              value: "Water Level (m)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          {hasStageData && (
            <Line
              type="monotone"
              dataKey="stage"
              name="Stage Level"
              stroke="#2563eb"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          )}
          {hasDownstreamData && (
            <Line
              type="monotone"
              dataKey="downstream"
              name="Downstream Level"
              stroke="#16a34a"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Hourly water level readings (m)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Time</TableHead>
            {hasStageData && <TableHead>Stage (m)</TableHead>}
            {hasDownstreamData && <TableHead>Downstream (m)</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((reading) => (
            <TableRow key={reading.dateTime}>
              <TableCell className="font-medium">{reading.time}</TableCell>
              {hasStageData && (
                <TableCell>
                  {reading.stage !== undefined ? reading.stage.toFixed(3) : "-"}
                </TableCell>
              )}
              {hasDownstreamData && (
                <TableCell>
                  {reading.downstream !== undefined
                    ? reading.downstream.toFixed(3)
                    : "-"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card className="w-full xl:w-3/4 mt-8 mx-auto shadow-xl mb-12">
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
              <div className="inline-flex rounded-md shadow-sm">
                <Button
                  variant={viewMode === "chart" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("chart")}
                  className="rounded-r-none"
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
              renderChart()
            ) : (
              renderTable()
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
