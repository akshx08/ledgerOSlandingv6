import type { Metadata } from "next";
import { Archivo, Fraunces, Martian_Mono } from "next/font/google";
import "./globals.css";
import Dock from "@/components/Dock";
import Smooth from "@/components/Smooth";
import Foot from "@/components/Foot";
import { BRAND } from "@/lib/content";

/*
 * Two voices that argue, plus a readout.
 *
 * SYSTEM voice — Helvetica Neue, set large and tight. It reports: headlines,
 * navigation, every figure and label. Neutral on purpose; a compliance tool
 * that shouts in its own typeface is not one you trust with a return.
 * Helvetica Neue is resolved locally (every Apple device has it) and falls to
 * Archivo, which also carries the width axis the narrow nav chips need.
 *
 * HUMAN voice — Fraunces, warm and slightly wonky, used ONLY where the page
 * stops reporting and starts explaining: the statement, the hero's plain
 * account of the job, and the in-plain-English definitions. Three places. It
 * lands because it is rare.
 *
 * Martian Mono stays on numeric readouts and nowhere else.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} — the month's paperwork, ready to file`,
  description:
    "Every business owes the government a monthly account of what it bought and sold. LedgerOS reads the pile a chartered accountant receives, files each page to the right client, checks it against the government's own records, and hands back a return that's ready to submit. The accountant files it. Entering pilot with CA firms in India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${fraunces.variable} ${mono.variable} font-sans antialiased`}
      >
        {/* Boot is gone. The calibration curtain existed to cover a hero that
            had nothing to say at t=0; the field now opens on its own disorder
            and resolves in front of the visitor, and a curtain in front of
            that is a curtain in front of a curtain.

            The custom cursor is gone too: it set `cursor: none` on everything,
            and a site you are trying to find your way around is the wrong
            place to hide the pointer. */}
        <Smooth />
        {children}
        <Foot />
        <Dock />
      </body>
    </html>
  );
}
