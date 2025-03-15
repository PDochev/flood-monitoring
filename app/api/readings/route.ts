import { getStationReadings } from "@/lib/api";
import { type NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json(readings);
  } catch (error) {
    console.error("Error fetching station readings:", error);
    return NextResponse.json(
      { error: "Failed to fetch station readings" },
      { status: 500 }
    );
  }
}
