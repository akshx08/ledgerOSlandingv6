"use client";

/**
 * AccessForm — the waitlist, on the vermilion drench.
 *
 * Fields are underlines on the colour rather than boxed inputs, so the form
 * reads as part of the surface. Every response state is distinct: a 400 says
 * what to fix, a 503 says the store isn't connected and hands over an email
 * address. It never fakes a success.
 */

import { useState } from "react";
import { ACCESS, BRAND } from "@/lib/content";

type Phase = "idle" | "sending" | "done" | "invalid" | "unconfigured" | "error";

const F = ACCESS.form;

export default function AccessForm() {
  const [phase, setPhase] = useState<Phase>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setPhase("sending");
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setPhase("done");
        form.reset();
      } else if (res.status === 400) setPhase("invalid");
      else if (res.status === 503) setPhase("unconfigured");
      else setPhase("error");
    } catch {
      setPhase("error");
    }
  };

  if (phase === "done") {
    return (
      <div role="status" className="border-t-2 border-porcelain/40 pt-8">
        <p className="wide text-d3">{F.done}</p>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-porcelain/90">{F.doneSub}</p>
      </div>
    );
  }

  const field =
    "w-full border-0 border-b-2 border-porcelain/40 bg-transparent px-0 py-3 text-[16px] text-porcelain outline-none transition-colors duration-300 placeholder:text-porcelain/60 focus:border-porcelain";

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      {/* honeypot — off-screen, never announced, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
        <label className="block">
          <span className="readout text-porcelain/85">{F.fields.name}</span>
          <input name="name" required maxLength={120} autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="readout text-porcelain/85">{F.fields.email}</span>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={field}
          />
        </label>
        <label className="block">
          <span className="readout text-porcelain/85">{F.fields.firm}</span>
          <input
            name="firm"
            required
            maxLength={160}
            autoComplete="organization"
            className={field}
          />
        </label>
        <label className="block">
          <span className="readout text-porcelain/85">{F.fields.role}</span>
          <select name="role" defaultValue={F.roles[0]} className={field}>
            {F.roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="readout text-porcelain/85">{F.fields.city}</span>
          <input name="city" maxLength={80} className={field} />
        </label>
        <label className="block">
          <span className="readout text-porcelain/85">{F.fields.volume}</span>
          <input name="volume" maxLength={40} inputMode="numeric" className={field} />
        </label>
      </div>

      <button
        type="submit"
        disabled={phase === "sending"}
        className="group relative mt-12 overflow-hidden bg-porcelain px-12 py-5 text-ink disabled:opacity-60"
      >
        <span className="narrow relative z-10 text-[13px] uppercase tracking-[0.14em]">
          {phase === "sending" ? F.sending : F.submit}
        </span>
        <span className="absolute inset-0 translate-y-full bg-ink/15 transition-transform duration-500 ease-expo group-hover:translate-y-0" />
      </button>

      {phase === "invalid" && (
        <p role="alert" className="mt-8 max-w-md border-l-2 border-porcelain pl-4 text-[14.5px] leading-relaxed text-porcelain">
          {F.invalid}
        </p>
      )}
      {phase === "unconfigured" && (
        <p role="alert" className="mt-8 max-w-md border-l-2 border-porcelain pl-4 text-[14.5px] leading-relaxed text-porcelain">
          {F.unconfigured}{" "}
          <a className="underline underline-offset-4" href={`mailto:${BRAND.contact}`}>
            {BRAND.contact}
          </a>
        </p>
      )}
      {phase === "error" && (
        <p role="alert" className="mt-8 max-w-md border-l-2 border-porcelain pl-4 text-[14.5px] leading-relaxed text-porcelain">
          {F.failed}{" "}
          <a className="underline underline-offset-4" href={`mailto:${BRAND.contact}`}>
            {BRAND.contact}
          </a>
        </p>
      )}
    </form>
  );
}
