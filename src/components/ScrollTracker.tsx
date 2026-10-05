"use client";

import { useEffect } from "react";
import { scroll } from "@/lib/scroll";

export default function ScrollTracker() {
  useEffect(() => {
    let sections: HTMLElement[] = [];
    const measure = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      update();
    };
    const update = () => {
      const y = window.scrollY;
      let s = 0;
      sections.forEach((el, i) => {
        const top = el.offsetTop;
        if (y >= top) s = i + Math.min(1, (y - top) / el.offsetHeight);
      });
      scroll.target = s;
    };
    const onPointer = (e: PointerEvent) => {
      scroll.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scroll.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);
  return null;
}
