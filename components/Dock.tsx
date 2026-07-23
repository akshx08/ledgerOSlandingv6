"use client";

/**
 * Dock — the navigation, docked bottom-centre.
 *
 * A floating instrument capsule rather than a top bar: it sits over the
 * content, carries the route index as a readout, and slides a vermilion
 * plate under the active route. On narrow screens it stays exactly where it
 * is — thumb-height is the right place for it — and simply tightens.
 *
 * The wordmark lives top-left, separately, so the two never form a bar.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BRAND, ROUTES } from "@/lib/content";

export default function Dock() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const plateRef = useRef<HTMLSpanElement>(null);

  // slide the plate under the active route; measured, so it survives font
  // loading and any width change
  useEffect(() => {
    const move = () => {
      const list = listRef.current;
      const plate = plateRef.current;
      if (!list || !plate) return;
      const active = list.querySelector<HTMLElement>('[data-active="true"]');
      if (!active) return;
      plate.style.width = `${active.offsetWidth}px`;
      plate.style.transform = `translateX(${active.offsetLeft}px)`;
    };
    move();
    const ro = new ResizeObserver(move);
    if (listRef.current) ro.observe(listRef.current);
    if ("fonts" in document) void document.fonts.ready.then(move);
    return () => ro.disconnect();
  }, [pathname]);

  // /access is drenched, so the wordmark inverts there. A single mid-grey
  // that "works on both" fails on both; the surface decides the ink.
  const onDrench = pathname === "/access";

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-dock p-5 md:p-7">
        <Link
          href="/"
          className={`pointer-events-auto narrow text-[13px] uppercase tracking-[0.14em] ${
            onDrench ? "text-porcelain" : "text-ink"
          }`}
        >
          {BRAND.name}
          <span className={onDrench ? "ml-2 text-porcelain/75" : "ml-2 text-graphite"}>
            {BRAND.maker}
          </span>
        </Link>
      </div>

      <nav
        aria-label="Primary"
        className="fixed bottom-4 left-1/2 z-dock -translate-x-1/2 md:bottom-6"
      >
        <ul
          ref={listRef}
          className="relative flex items-center rounded-full border border-ink/10 bg-paper/95 p-1 shadow-[0_18px_50px_-18px_oklch(var(--ink)/0.4)] backdrop-blur-[2px]"
        >
          <span
            ref={plateRef}
            aria-hidden
            className="absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-vermilion transition-transform duration-500 ease-expo"
            style={{ width: 0 }}
          />
          {ROUTES.map((r) => {
            const active = pathname === r.href;
            return (
              <li key={r.href} data-active={active} className="relative">
                <Link
                  href={r.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] uppercase tracking-[0.1em] transition-colors duration-300 md:px-5 ${
                    active ? "text-porcelain" : "text-graphite hover:text-ink"
                  }`}
                  style={{ fontVariationSettings: '"wdth" 78, "wght" 600' }}
                >
                  <span
                    className={`readout hidden transition-opacity duration-300 sm:inline ${
                      active ? "text-porcelain/90" : "text-graphite"
                    }`}
                  >
                    {r.index}
                  </span>
                  {r.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
