import Link from "next/link";
import Stage from "@/components/Stage";
import Hero from "@/components/Hero";
import Entry from "@/components/Entry";
import Cinematic from "@/components/Cinematic";
import Marquee from "@/components/Marquee";
import Figure from "@/components/Figure";
import { BRAND, DRENCH, PLAIN, RESOLUTIONS } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* The field, fixed under the whole document. It resolves into the
          wordmark on its own clock, then takes its scroll treatment from
          08-synapsex.html: smoothed progress driving blur and scale while the
          copy above it scrambles out. It has withdrawn by the time the drench
          band arrives, which is where content takes over. */}
      <Stage />

      <main className="relative z-content">
        {/* ── cold open ── copy takes the corners, the word keeps the middle */}
        <Hero />

        {/* Everything below arrives THROUGH the shattered word: Entry scales
            the rest of the page up out of the porcelain as the camera drives
            forward, so the site itself is what the visitor enters. */}
        <Entry>
        {/* ── the statement ── laid back in space, passing through the frame */}
        <Cinematic />

        {/* ── drench ── the surface becomes the colour. Type on it is
            porcelain: only the light direction clears 4.5:1 on this red. */}
        <section className="relative bg-vermilion py-20 text-porcelain md:py-28">
          <div className="mx-auto max-w-[110rem] px-5 md:px-10">
            <p className="wide max-w-[16ch] text-d3">{DRENCH.lead}</p>
          </div>
          <div className="my-12 border-y border-porcelain/30 py-5">
            <Marquee items={DRENCH.types} />
          </div>
          <div className="mx-auto max-w-[110rem] px-5 md:px-10">
            <p className="max-w-lg text-[15px] leading-relaxed text-porcelain">{DRENCH.note}</p>
          </div>
        </section>

        {/* ── in plain english ── placed directly after the drench on purpose:
            the band above is a wall of compliance vocabulary, and this is
            where a reader who isn't a CA gets it handed back to them in
            sentences. Definition list, not a feature grid. */}
        <section className="border-t rule bg-porcelain px-5 py-28 md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[110rem] gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <p className="readout text-vermilion">{PLAIN.eyebrow}</p>
              <h2 className="wide mt-5 text-d3">{PLAIN.title}</h2>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-graphite">
                {PLAIN.intro}
              </p>
            </div>

            <div className="md:col-span-7 md:col-start-6">
              <dl>
                {PLAIN.terms.map((t) => (
                  <div
                    key={t.term}
                    className="grid gap-2 border-t rule py-8 md:grid-cols-12 md:gap-8"
                  >
                    <dt className="narrow text-[13px] uppercase tracking-[0.1em] text-ink md:col-span-4">
                      {t.term}
                    </dt>
                    <dd className="human-body text-[16px] text-graphite md:col-span-8">
                      {t.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="border-t rule pt-8 text-[15px] leading-relaxed text-ink">
                {PLAIN.close}
              </p>
            </div>
          </div>
        </section>

        {/* ── resolutions ── free-floating figures at three depths */}
        <section className="bg-porcelain px-5 py-28 md:px-10 md:py-36">
          {/* the plate crosses the page: right, left, right — placed by
              explicit grid columns rather than a direction flip, which fights
              any col-start you set alongside it */}
          <div className="space-y-24 md:space-y-28">
            {RESOLUTIONS.map((r, i) => {
              const plateLeft = i % 2 === 1;
              return (
                <div key={r.id} className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
                  <div
                    className={`md:col-span-5 ${plateLeft ? "md:col-start-8" : "md:col-start-1"}`}
                  >
                    <span className="readout text-vermilion">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="wide-thin mt-4 text-d3">{r.title}</h3>
                    <p className="mt-5 max-w-md text-[15px] leading-relaxed text-graphite">
                      {r.body}
                    </p>
                  </div>
                  <div
                    className={`md:col-span-6 md:row-start-1 ${
                      plateLeft ? "md:col-start-1" : "md:col-start-7"
                    }`}
                  >
                    <Figure kind={r.figure} depth={i} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── the hand-off ── */}
        <section className="border-t rule bg-porcelain px-5 py-24 md:px-10 md:py-28">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <h2 className="wide max-w-[14ch] text-d2">Seats are few.</h2>
            <Link
              href="/access"
              className="group relative shrink-0 overflow-hidden bg-vermilion px-10 py-5 text-porcelain"
            >
              <span className="narrow relative z-10 text-[13px] uppercase tracking-[0.12em]">
                Request access → {BRAND.status}
              </span>
              <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-expo group-hover:translate-y-0" />
            </Link>
          </div>
        </section>
        </Entry>
      </main>
    </>
  );
}
