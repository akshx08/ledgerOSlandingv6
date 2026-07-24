import type { Metadata } from "next";
import Link from "next/link";
import Stage from "@/components/Stage";
import Figure from "@/components/Figure";
import WeightType from "@/components/Type";
import Rise from "@/components/Rise";
import { COPILOT, INBOX_NOTE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Practice — LedgerOS",
  description:
    "A morning at the firm: the inbox already sorted, a copilot that answers with citations, and corrections that stick.",
};

/* the day, as a set of times — no eyebrow, no numbered scaffold */
const HOURS = [
  {
    t: "18:40",
    title: "The day's paper lands",
    body: "Forty-odd pages from nine clients — invoices, bank statements, a notice, three photographs of receipts taken at an angle. On a normal evening this is tomorrow's problem. It goes into LedgerOS instead.",
  },
  {
    t: "02:15",
    title: "It gets read, matched and checked",
    body: "Figures lifted off each page by rule, not by guess. Each page matched to a client on its tax ID. Then the month set against the government's own record of it, so anything missing or disagreeing is already found by morning.",
  },
  {
    t: "09:00",
    title: "The assistant opens a sorted list",
    body: "Newest first. What it is, whose it is, the amount, when it's due — and four things flagged as needing a human, out of forty. The ninety minutes of triage is already spent, and it wasn't spent by a person.",
  },
  {
    t: "09:04",
    title: "Judgement, instead of sorting",
    body: "Read the page in place, correct the four, chase the supplier whose invoice never showed up — the one costing the client ₹18,000 in credit. Then export the return and file it. That last part is still yours, and always will be.",
  },
];

export default function PracticePage() {
  return (
    <>
      <Stage presence={0.3} />

      <main className="relative z-content">
        <section className="flex min-h-[62svh] items-end px-5 pb-16 pt-36 md:px-10 md:pb-20">
          <div>
            <p className="readout mb-6 text-vermilion">One morning · one assistant</p>
            <h1 className="wide max-w-[15ch] text-d1">
              <WeightType text="The ninety minutes you get back" />
            </h1>
          </div>
        </section>

        {/* the day — a time column, not a spine with nodes */}
        <section className="bg-porcelain px-5 md:px-10">
          <div className="border-t rule">
            {HOURS.map((h) => (
              <div
                key={h.t}
                className="grid gap-3 border-b rule py-8 md:grid-cols-12 md:gap-10 md:py-11"
              >
                <span className="readout text-vermilion md:col-span-2">{h.t}</span>
                <h2 className="wide-thin text-[clamp(1.5rem,3.2vw,2.3rem)] md:col-span-5">
                  {h.title}
                </h2>
                <p className="max-w-lg text-[15px] leading-relaxed text-graphite md:col-span-5">
                  {h.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* the surfaces, full width */}
        <section className="bg-porcelain px-5 py-20 md:px-10 md:py-28">
          <Rise>
            <h2 className="wide max-w-[16ch] text-d2">What it puts in front of them</h2>
          </Rise>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <Figure kind="inbox" depth={0} />
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-graphite">
                Filter by client, type, status or date, or search free-text across filenames
                and every extracted word. Every PDF opens in place.
              </p>
            </div>
            <div className="md:mt-24">
              <Figure kind="copilot" depth={1} />
              <ul className="mt-8 max-w-md space-y-5">
                {COPILOT.rules.map(([k, v]) => (
                  <li key={k}>
                    <p className="narrow text-[12px] uppercase tracking-[0.12em]">{k}</p>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-graphite">{v}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="readout mt-10 text-graphite">{INBOX_NOTE}</p>
        </section>

        <section className="border-t rule bg-porcelain px-5 py-16 md:px-10 md:py-20">
          <Link
            href="/access"
            className="group inline-flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b-2 border-ink pb-3"
          >
            <span className="wide text-d2">Run it on your firm</span>
            <span className="text-vermilion transition-transform duration-500 ease-expo group-hover:translate-x-2">
              →
            </span>
          </Link>
        </section>
      </main>
    </>
  );
}
