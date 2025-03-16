import { getStationReadings } from "@/lib/api";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // This ensures the route is always dynamic

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stationId = searchParams.get("stationId");

  if (!stationId) {
    return NextResponse.json(
      { error: "Station ID is required" },
      { status: 400 }
    );
  }

  try {
    const readings = await getStationReadings(stationId);

    // Set cache control headers to prevent browser caching
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
