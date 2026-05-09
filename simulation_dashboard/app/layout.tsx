import type { Metadata } from "next";
import "./globals.css";
import { VitalsProvider } from "@/context/VitalsContext";

export const metadata: Metadata = {
  title: "Sentri ICU — Simulation Dashboard",
  description: "Real-time ICU deterioration intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: "#000", overflow: "hidden" }}>
        <VitalsProvider>{children}</VitalsProvider>
      </body>
    </html>
  );
}
