import Link from "next/link";
import Stage from "@/components/Stage";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Figure from "@/components/Figure";
import Rise from "@/components/Rise";
import {
  BRAND,
  COPILOT,
  DRENCH,
  HEADINGS,
  HOURS,
  PLAIN,
  ROADMAP,
  STAGES,
  STATEMENT,
} from "@/lib/content";

/*
 * One page, one argument, read top to bottom.
 *
 * System and Practice used to be separate routes; they were never separate
 * arguments, and splitting them meant a reader had to navigate to finish a
 * sentence. They are sections now, and the dock anchors into them.
 *
 * Spacing is quantized in PIXELS, not viewport heights. The previous build
 * used py-[14vh]…py-[16vh] with space-y-[14vh] between blocks, which is why
 * the page read as empty: on a tall monitor every gap grew with the screen
 * while the type stayed the same size. Section rhythm is now 112px / 144px
 * throughout, and nothing else is allowed to invent a gap.
 */

const SECTION = "px-5 py-28 md:px-10 md:py-36";

export default function Home() {
  return (
    <>
      <Stage />

      <main className="relative z-content">
        <Hero />

        {/* ── the statement ──
            Was a scroll-scrubbed 3D tilt that faded to opacity 0 at BOTH ends
            of its travel, which put two blank screens either side of the one
            sentence it existed to show. It is a sentence; it now just sits
            there and is read. */}
        <section id="overview" className={`${SECTION} scroll-mt-24 bg-porcelain`}>
          <Rise className="mx-auto max-w-4xl text-center">
            <h2 className="human-display mx-auto max-w-[20ch] text-d2">{STATEMENT.big}</h2>
            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-graphite">
              {STATEMENT.body}
            </p>
          </Rise>
        </section>

        {/* ── drench ── the surface becomes the colour. Type on it is
            porcelain: only the light direction clears 4.5:1 on this red. */}
        <section className="relative bg-vermilion py-24 text-porcelain md:py-28">
          <div className="mx-auto max-w-[110rem] px-5 md:px-10">
            <p className="wide max-w-[16ch] text-d3">{DRENCH.lead}</p>
          </div>
          <div className="my-10 border-y border-porcelain/30 py-5">
            <Marquee items={DRENCH.types} />
          </div>
          <div className="mx-auto max-w-[110rem] px-5 md:px-10">
            <p className="max-w-2xl text-[15px] leading-relaxed text-porcelain">{DRENCH.note}</p>
          </div>
        </section>

        {/* ── in plain english ── directly after the drench on purpose: the
            band above is a wall of compliance vocabulary, and this is where a
            reader who isn't a CA gets it handed back in sentences. */}
        <section id="plain" className={`${SECTION} scroll-mt-24 bg-porcelain`}>
          <div className="mx-auto grid max-w-[92rem] gap-12 md:grid-cols-12 md:gap-16">
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
                  <div key={t.term} className="grid gap-2 border-t rule py-7 md:grid-cols-12 md:gap-8">
                    <dt className="narrow text-[13px] uppercase tracking-[0.1em] text-ink md:col-span-4">
                      {t.term}
                    </dt>
                    <dd className="human-body text-[16px] text-graphite md:col-span-8">
                      {t.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="border-t rule pt-7 text-[15px] leading-relaxed text-ink">
                {PLAIN.close}
              </p>
            </div>
          </div>
        </section>

        {/* ── how it works ──
            Was a horizontal reel on a 310vh track (5 × 62vh) that hijacked
            vertical scroll to move sideways. That is three more screens of
            scrolling and the single hardest thing on the site to navigate.
            Five steps, read downward, numbered. */}
        <section id="how" className={`${SECTION} scroll-mt-24 border-t rule bg-porcelain`}>
          <div className="mx-auto max-w-[92rem]">
            <div className="max-w-3xl">
              <p className="readout text-vermilion">{HEADINGS.how.eyebrow}</p>
              <h2 className="wide mt-5 text-d2">{HEADINGS.how.title}</h2>
            </div>

            <ol className="mt-16 border-t rule">
              {STAGES.map((s) => (
                <li key={s.key} className="grid gap-x-10 gap-y-4 border-b rule py-10 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <span className="readout text-vermilion">
                      {s.n} · {s.spec}
                    </span>
                    <h3 className="wide mt-3 text-[clamp(1.6rem,3vw,2.3rem)]">{s.name}</h3>
                  </div>
                  <div className="md:col-span-8 md:max-w-2xl">
                    <p className="text-[15px] leading-relaxed text-graphite">{s.line}</p>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-16">
              <Figure kind="inbox" depth={0} />
            </div>
          </div>
        </section>

        {/* ── a morning at the firm ── was its own route; it is the same story
            one scroll further on. */}
        <section className={`${SECTION} border-t rule bg-porcelain`}>
          <div className="mx-auto max-w-[92rem]">
            <div className="max-w-3xl">
              <p className="readout text-vermilion">{HEADINGS.morning.eyebrow}</p>
              <h2 className="wide mt-5 text-d2">{HEADINGS.morning.title}</h2>
            </div>

            <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7">
                <div className="border-t rule">
                  {HOURS.map((h) => (
                    <div key={h.t} className="grid gap-x-8 gap-y-2 border-b rule py-8 md:grid-cols-12">
                      <span className="readout text-vermilion md:col-span-3">{h.t}</span>
                      <div className="md:col-span-9">
                        <h3 className="text-[17px] font-medium text-ink">{h.title}</h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-graphite">{h.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <Figure kind="copilot" depth={0} />
                <dl className="mt-8 border-t rule">
                  {COPILOT.rules.map(([rule, why]) => (
                    <div key={rule} className="border-b rule py-3.5">
                      <dt className="text-[13.5px] font-medium text-ink">{rule}</dt>
                      <dd className="mt-1 text-[13.5px] leading-relaxed text-graphite">{why}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ── where it stands ── */}
        <section className={`${SECTION} border-t rule bg-porcelain`}>
          <div className="mx-auto grid max-w-[92rem] gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <p className="readout text-vermilion">{HEADINGS.state.eyebrow}</p>
              <h2 className="wide mt-5 text-d3">{ROADMAP.title}</h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
                {ROADMAP.body}
              </p>
            </div>

            <ul className="md:col-span-6 md:col-start-7">
              {ROADMAP.items.map((it) => (
                <li
                  key={it.n}
                  className="flex items-baseline justify-between gap-6 border-t rule py-4"
                >
                  <span className="text-[15px] text-ink">{it.name}</span>
                  <span
                    className={`readout shrink-0 uppercase ${
                      it.state === "Live" ? "text-vermilion" : "text-graphite"
                    }`}
                  >
                    {it.state}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── the hand-off ── */}
        <section className="border-t rule bg-porcelain px-5 py-24 md:px-10 md:py-28">
          <div className="mx-auto flex max-w-[92rem] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
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
      </main>
    </>
  );
}
