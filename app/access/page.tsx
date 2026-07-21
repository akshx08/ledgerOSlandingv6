import type { Metadata } from "next";
import AccessForm from "@/components/AccessForm";
import { ACCESS, BRAND } from "@/lib/content";

export const metadata: Metadata = {
  title: "Access — LedgerOS",
  description:
    "LedgerOS is entering pilot with Chartered Accountant firms in India. Request a seat.",
};

/*
 * The whole page is the colour. No aperture stage here — the instrument has
 * already opened by the time you arrive, and the drench is the payoff.
 *
 * Type on the drench is porcelain, never ink: at the vermilion's pinned
 * lightness only the light direction clears 4.5:1 for body copy.
 */
export default function AccessPage() {
  return (
    <main className="relative z-content min-h-[100svh] bg-vermilion text-porcelain">
      <div className="px-5 pb-32 pt-36 md:px-10 md:pb-40">
        <div className="grid gap-x-14 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="readout mb-8 text-porcelain/85">{BRAND.status} · seats are few</p>
            <h1 className="wide text-d1">
              {ACCESS.big.map((l, i) => (
                <span key={l} className="block" style={{ marginLeft: `${i * 1.6}vw` }}>
                  {l}
                </span>
              ))}
            </h1>
            <p className="mt-10 max-w-md text-[15px] leading-relaxed text-porcelain md:text-lede">
              {ACCESS.body}
            </p>

            <dl className="mt-14 space-y-6 border-t-2 border-porcelain/35 pt-8">
              {ACCESS.terms.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-4">
                  <dt className="narrow text-[12px] uppercase tracking-[0.12em]">{k}</dt>
                  <dd className="max-w-sm text-[14.5px] leading-relaxed text-porcelain/90">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="wide-thin text-d3">{ACCESS.form.heading}</h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-porcelain/90">
              {ACCESS.form.note}
            </p>
            <div className="mt-12">
              <AccessForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
