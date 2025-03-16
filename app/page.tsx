import { Suspense } from "react";
import StationDataContainer from "../components/station-data-container";
import NavBar from "@/components/NavBar";
import { getStations } from "@/lib/api";

export default async function Home() {
  // Fetch stations on the server
  const stations = await getStations();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-[1960px] p-4 mb-1 flex-grow w-full">
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

        <div className="w-full">
          <Suspense fallback={<div>Loading stations...</div>}>
            <StationDataContainer stations={stations} />
          </Suspense>
        </div>
      </main>
      <footer className="bg-white text-black py-2 border-t border-gray-200 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row  justify-between items-center mt-2 gap-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-sm md:text-md font-bold">FloodWatch</h2>
              <p className="text-sm  md:text-md text-gray-500 mt-2">
                Real-time flood monitoring for the UK
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <a
                href="https://environment.data.gov.uk/flood-monitoring/doc/reference"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-md text-gray-500 hover:text-black"
              >
                Data API
              </a>
              <a
                href="https://check-for-flooding.service.gov.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-md text-gray-500 hover:text-black"
              >
                Official Flood Information
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm mb-2">
            <p>
              &copy; {new Date().getFullYear()} FloodWatch. All rights reserved.
              Made by {""}
              <a
                href="https://github.com/PDochev/flood-monitoring"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-black underline hover:animate-pulse"
              >
                Plamen Dochev
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
