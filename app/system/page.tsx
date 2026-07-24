import type { Metadata } from "next";
import Link from "next/link";
import Stage from "@/components/Stage";
import Filmstrip from "@/components/Filmstrip";
import WeightType from "@/components/Type";
import Rise from "@/components/Rise";
import { ROADMAP } from "@/lib/content";

export const metadata: Metadata = {
  title: "System — LedgerOS",
  description:
    "It arrives, gets read, finds its client, gets checked, and comes out ready to file. The five steps a document passes through, and what each one refuses to guess at.",
};

export default function SystemPage() {
  return (
    <>
      <Stage presence={0.3} />

      <main className="relative z-content">
        <section className="flex min-h-[54svh] items-end px-5 pb-12 pt-28 md:px-10 md:pb-16 md:pt-36">
          <div>
            <p className="readout mb-6 text-vermilion">Five stages · overnight</p>
            <h1 className="wide max-w-[16ch] text-d1">
              <WeightType text="What happens while you sleep" />
            </h1>
          </div>
        </section>

        {/* the reel — opaque, so the reel is read on porcelain */}
        <div className="bg-porcelain">
          <Filmstrip />
        </div>

        {/* roadmap as a ledger, not a card rail. The unbuilt knowledge layer
            used to have a whole ink-drenched section to itself; it is one
            honest line in this list now. */}
        <section className="border-t rule px-5 py-20 md:px-10 md:py-28">
          <Rise>
            <h2 className="wide max-w-[18ch] text-d2">{ROADMAP.title}</h2>
          </Rise>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
            {ROADMAP.body}
          </p>

          <ol className="mt-10 border-t rule">
            {ROADMAP.items.map((m) => (
              <li
                key={m.n}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 border-b rule py-6 transition-colors duration-300 hover:bg-ink/[0.03] md:gap-10 md:py-8"
              >
                <span className="readout text-graphite">{m.n}</span>
                <span className="wide-thin text-[clamp(1.4rem,3.4vw,2.4rem)]">{m.name}</span>
                <span
                  className={`narrow text-[11px] uppercase tracking-[0.12em] ${
                    m.state === "Live" ? "text-vermilion" : "text-graphite"
                  }`}
                >
                  {m.state}
                </span>
              </li>
            ))}
          </ol>

          <Link
            href="/practice"
            className="group mt-12 inline-flex items-center gap-4 border-b-2 border-ink pb-2"
          >
            <span className="wide-thin text-d3">See it in a practice</span>
            <span className="text-vermilion transition-transform duration-500 ease-expo group-hover:translate-x-2">
              →
            </span>
          </Link>
        </section>
      </main>
    </>
  );
}
