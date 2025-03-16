import { Suspense } from "react";
import StationDataContainer from "../components/station-data-container";
import NavBar from "@/components/NavBar";
import { getStations } from "@/lib/api";

export default async function Home() {
  // Fetch stations on the server
  const stations = await getStations();

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-[1960px] p-4 mb-1">
        <div className="flex justify-center items-center">
          <h1 className="scroll-m-20 text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-8">
            Welcome to FloodWatch
          </h1>
        </div>
        <div className="mb-8">
          <p className="text-md md:text-xl text-center text-gray-700 max-w-3xl mx-auto">
            Monitor real-time water levels at flood monitoring stations across
            the United Kingdom. Select a station to view detailed water level
            data for the past 24 hours.
          </p>
        </div>

        <Suspense fallback={<div>Loading stations...</div>}>
          <StationDataContainer stations={stations} />
        </Suspense>
      </main>
      {/* <footer className="bg-gray-800 text-white py-8 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">FloodWatch</h2>
              <p className="text-gray-300 mt-2">
                Real-time flood monitoring for the UK
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <a
                href="https://environment.data.gov.uk/flood-monitoring/doc/reference"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                Data API
              </a>
              <a
                href="https://check-for-flooding.service.gov.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                Official Flood Information
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
            <p>
              This application is for educational purposes only. For official
              flood warnings, please visit the Environment Agency website.
            </p>
          </div>
        </div>
      </footer> */}
    </>
  );
}
