"use client";

import { useState, type FormEvent } from "react";

export default function NotifyForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setState("sending");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="text-xl font-bold text-bean">Thank you — we&apos;ll save you the first cup. ☕</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="email" className="sr-only">Email address</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@example.lk"
        className="min-w-0 flex-1 rounded-full border border-bean/25 bg-white/60 px-5 py-3 text-bean placeholder:text-bean/40 focus:border-filli focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-orange justify-center disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Notify me"}
      </button>
      {state === "error" && <p className="text-sm text-red-700 sm:basis-full">Something went wrong — please try again.</p>}
    </form>
  );
}
