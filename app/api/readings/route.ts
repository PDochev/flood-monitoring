import { getStationReadings } from "@/lib/api";
import { type NextRequest, NextResponse } from "next/server";

// Force dynamic rendering
// This will ensure that the API route is always rendered dynamically
// even when the page is statically generated
// It tells Next.js to always execute the route handler for each incoming request,
// skipping any static optimization or caching that Next.js might otherwise apply.
// Why it's necessary for FloodWatch:
// Data Freshness: Ensures that users always receive the most up-to-date readings for the station.
// Bypassing Static Generation: Next.js by default tries to optimize routes by statically generating them at build time where possible. For an API that serves real-time data, this would result in stale data.
export const dynamic = "force-dynamic";

// GET /api/readings
// API route to fetch readings for a given station
// This route expects a query parameter `stationId` which is the ID of the station
// for which we want to fetch readings
// Example: /api/readings?stationId=123456
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stationId = searchParams.get("stationId");

  // If no station ID is provided, we return an error with status 400 (Bad Request)
  if (!stationId) {
    return NextResponse.json(
      { error: "Station ID is required" },
      { status: 400 }
    );
  }

  try {
    const readings = await getStationReadings(stationId);

    // If no readings are found for the station, we return an error with status 404 (Not Found)
    if (readings.length === 0) {
      return NextResponse.json(
        { error: "No readings found for the station" },
        { status: 404 }
      );
    }

    // Set cache control headers to prevent browser caching
    // This way we always fetch the latest data from the API
    // and avoid showing stale data to the user
    // Since we want to display every 24h data, we set max-age=0 , so that the browser always fetches the latest data
    // The must-revalidate directive tells any caching mechanism (browsers, CDNs, proxies) that once a cached response becomes stale,
    // it must check with the origin server before using the cached version.
    return NextResponse.json(readings, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching station readings:", error);
    return NextResponse.json(
      { error: "Failed to fetch station readings" },
      { status: 500 }
    );
  }
}
