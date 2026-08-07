"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      // /api/subscribe subscribes them in Kit, then keeps a backup copy in
      // Supabase or a local file. The address is recorded before we say thanks.
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "home" }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("done");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <article className="card p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-sans text-[26px] font-bold leading-snug tracking-tight">
            Looking for free guides?
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-(--color-muted)">
            Free weekly guides on scholarships, standout high-school roadmaps, and the tech tools that
            actually help, straight to your inbox.
          </p>
        </div>
        <span className="shrink-0 font-sans text-2xl font-bold text-(--color-accent)">Free</span>
      </div>

      {status === "done" ? (
        <p className="mt-6 text-[15px] font-medium text-(--color-accent)">
          Thanks! You&apos;re on the list. New guides land in your inbox each week. 🎉
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email address"
            className="news-input flex-1"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="subscribe-btn w-full disabled:opacity-70 sm:w-auto"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && <p className="mt-3 text-[13px] text-red-600">{error}</p>}
    </article>
  );
}
