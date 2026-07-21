import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";
import Dock from "@/components/Dock";
import Instrument from "@/components/Instrument";
import Smooth from "@/components/Smooth";
import Foot from "@/components/Foot";
import { BRAND } from "@/lib/content";

/*
 * One family, driven across two axes. Archivo's width axis is the whole type
 * system: display is set wide and heavy, navigation and labels are set narrow
 * and tight, and the contrast between them does the work a second typeface
 * usually does. Martian Mono appears only on numeric readouts.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} — point it at the chaos`,
  description:
    "LedgerOS is the aperture your clients' documents pass through. Notices, invoices, statements and scans arrive forwarded and come out classified, matched to a client, and filed. By Precedal. Entering pilot with CA firms in India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${mono.variable} font-sans antialiased`}>
        {/* Boot is gone. The calibration curtain existed to cover a hero that
            had nothing to say at t=0; the field now opens on its own disorder
            and resolves in front of the visitor, and a curtain in front of
            that is a curtain in front of a curtain. */}
        <Smooth />
        <Instrument />
        {children}
        <Foot />
        <Dock />
      </body>
    </html>
  );
}
