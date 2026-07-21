import type { Metadata } from "next";
import Link from "next/link";
import Stage from "@/components/Stage";
import Filmstrip from "@/components/Filmstrip";
import WeightType from "@/components/Type";
import Rise from "@/components/Rise";
import { KNOWLEDGE, ROADMAP } from "@/lib/content";

export const metadata: Metadata = {
  title: "System — LedgerOS",
  description:
    "Ingest, extract, classify, match, route. The five stages a forwarded document passes through, and what each one refuses to guess at.",
};

export default function SystemPage() {
  return (
    <>
      <Stage presence={0.3} />

      <main className="relative z-content">
        <section className="flex min-h-[62svh] items-end px-5 pb-16 pt-36 md:px-10 md:pb-20">
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

        {/* the layer we haven't built — stated plainly, not dressed as shipped */}
        <section className="border-t rule bg-ink px-5 py-[14vh] text-porcelain md:px-10">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <span className="readout text-vermilion">In development · not shipped</span>
              <h2 className="wide-thin mt-5 text-d3">{KNOWLEDGE.title}</h2>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className="text-[15px] leading-relaxed text-porcelain/70 md:text-lede">
                {KNOWLEDGE.body}
              </p>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {KNOWLEDGE.sources.map((s) => (
                  <li key={s} className="readout text-porcelain/45">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* roadmap as a ledger, not a card rail */}
        <section className="px-5 py-[14vh] md:px-10">
          <Rise>
            <h2 className="wide max-w-[18ch] text-d2">{ROADMAP.title}</h2>
          </Rise>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
            {ROADMAP.body}
          </p>

          <ol className="mt-14 border-t rule">
            {ROADMAP.items.map((m) => (
              <li
                key={m.n}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 border-b rule py-6 transition-colors duration-300 hover:bg-ink/[0.03] md:gap-10 md:py-8"
              >
                <span className="readout text-graphite">{m.n}</span>
                <span className="wide-thin text-[clamp(1.4rem,3.4vw,2.4rem)]">{m.name}</span>
                <span
                  className={`narrow text-[11px] uppercase tracking-[0.12em] ${
                    m.state === "In pilot" ? "text-vermilion" : "text-graphite"
                  }`}
                >
                  {m.state}
                </span>
              </li>
            ))}
          </ol>

          <Link
            href="/practice"
            className="group mt-16 inline-flex items-center gap-4 border-b-2 border-ink pb-2"
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
