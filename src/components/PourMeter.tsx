"use client";

import { useEffect, useRef } from "react";
import { scroll, POUR } from "@/lib/scroll";
import { range } from "@/lib/anim";

/** Small fixed gauge that tracks how full the cup is while pouring. */
export default function PourMeter() {
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const s = scroll.s;
      const fill = range(s, ...POUR.fill);
      const show = s > 0.7 && s < 2.05;
      if (wrap.current) wrap.current.style.opacity = show ? "1" : "0";
      if (bar.current) bar.current.style.transform = `scaleY(${fill})`;
      if (label.current) label.current.textContent = `${Math.round(fill * 100)}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrap}
      className="pointer-events-none fixed right-5 bottom-8 z-20 hidden flex-col items-center gap-3 opacity-0 transition-opacity duration-500 md:right-10 md:flex"
    >
      <div className="relative h-36 w-2 overflow-hidden rounded-full bg-bean/10">
        <div ref={bar} className="absolute inset-0 origin-bottom bg-gradient-to-t from-bean to-filli" style={{ transform: "scaleY(0)" }} />
      </div>
      <span ref={label} className="text-sm font-bold text-bean">0%</span>
      <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-bean/50 [writing-mode:vertical-rl]">Pouring</span>
    </div>
  );
}
