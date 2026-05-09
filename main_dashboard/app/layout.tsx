import type { Metadata } from "next";

import "./globals.css";

import {
  IBM_Plex_Mono,
  Barlow_Condensed,
} from "next/font/google";

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-ibm-plex-mono",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Sentri",
  description: "Sentinel Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${ibm.variable}
          ${barlow.variable}
        `}
      >
        {children}
      </body>
    </html>
  );
}