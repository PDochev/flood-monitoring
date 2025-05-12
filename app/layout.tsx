import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Clarity from "@microsoft/clarity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const projectId = "ribirlzxbb";

export const metadata: Metadata = {
  title: "FloodWatch",
  description:
    "Monitor real-time water levels at flood monitoring stations across the United Kingdom. Select a station to view detailed water level data for the past 24 hours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  Clarity.init(projectId);
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
