"use client";

import { useEffect, useState } from "react";
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
import type { Reading } from "@/lib/definitions";
import { Loader2 } from "lucide-react";

interface StationChartProps {
  stationId: string | null;
}

interface ChartData {
  dateTime: string;
  time: string;
  stage?: number;
  downstream?: number;
}

export default function StationChart({ stationId }: StationChartProps) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadings() {
      if (!stationId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/readings?stationId=${encodeURIComponent(stationId)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch station readings");
        }

        const data = await response.json();
        setReadings(data);

        // Process the data for the chart
        const processedData = processReadingsData(data);
        setChartData(processedData);
      } catch (err) {
        console.error("Error fetching readings:", err);
        setError("Failed to load station readings. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchReadings();
  }, [stationId]);

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

  if (!stationId) {
    return null;
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Water Level Readings</CardTitle>
        <CardDescription>
          Last 24 hours of water level data for the selected station
        </CardDescription>
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
        ) : chartData.length > 0 ? (
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
                {chartData.some((item) => item.stage !== undefined) && (
                  <Line
                    type="monotone"
                    dataKey="stage"
                    name="Stage Level"
                    stroke="#2563eb"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                )}
                {chartData.some((item) => item.downstream !== undefined) && (
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
        ) : (
          <div className="flex justify-center items-center h-[400px] text-muted-foreground">
            No data available for this station
          </div>
        )}
      </CardContent>
    </Card>
  );
}
