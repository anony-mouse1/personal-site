import type { ReactNode } from "react";
import NewsletterCard from "./NewsletterCard";

// TODO: swap this placeholder for the real link when it exists.
const ADMITFOLIO_URL = "#";

// Line icons drawn on a 24x24 grid to match the contact/social glyphs below.
const ICONS = {
  layers: ["m12 2 9 5-9 5-9-5 9-5Z", "m3 12 9 5 9-5", "m3 17 9 5 9-5"],
  folder: ["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"],
  people: [
    "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1",
    "M22 19v-1a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  chat: ["M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9Z"],
  briefcase: [
    "M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z",
    "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
    "M2 12h20",
  ],
};

type Offer = {
  tag: string;
  icon: string[];
  title: string;
  description: string;
  price?: string;
  cta: string;
  url?: string;
  highlight?: boolean;
  comingSoon?: boolean;
};

const OFFERS: Offer[] = [
  {
    tag: "Marketplace",
    icon: ICONS.layers,
    title: "Admitfolio",
    description:
      "A marketplace for college essays that actually got in. College students earn by sharing theirs; high schoolers learn from what works, for a significantly reduced price.",
    cta: "Explore Admitfolio",
    url: ADMITFOLIO_URL,
  },
  {
    tag: "Templates & resources",
    icon: ICONS.folder,
    title: "Student resource hub",
    description:
      "My templates and resources for high school and college students, all in one place: college apps, scholarships, productivity and more.",
    cta: "Browse the hub",
    url: "https://stan.store/fatimahsguide",
  },
  {
    tag: "Mentorship",
    icon: ICONS.people,
    title: "Mentorship through Fatimah's Guide",
    description:
      "I'm building a mentorship program for students working on college, scholarships, extracurriculars, and their own projects. Follow along to get in early.",
    cta: "Follow @fatimahs.guide",
    url: "https://fatimahs.guide",
  },
  {
    tag: "Community",
    icon: ICONS.chat,
    title: "Subscribe to the school community",
    description:
      "Exclusive guides, live info sessions, and mentorship opportunities: a space to navigate college and your early career, together.",
    cta: "Coming soon",
    comingSoon: true,
  },
  {
    tag: "Work with me",
    icon: ICONS.briefcase,
    title: "Brand partnerships & collabs",
    description:
      "I've partnered with OpenAI, Microsoft, Adobe, Notion and more on educational content reaching 200M+ views.",
    cta: "Email me",
    url: "mailto:fatimahhussain@berkeley.edu",
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    url: "https://www.instagram.com/fatimahs.guide",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "TikTok",
    url: "https://www.tiktok.com/@fatimahs.guide",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/fatimah-hussain/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  },
  {
    label: "Twitter",
    url: "https://twitter.com/fatimahs_tech",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

function Ext({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function OfferCard({ o }: { o: Offer }) {
  return (
    <article className={`card p-6 md:p-8 ${o.highlight ? "card-featured" : ""}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="flex items-start gap-3.5 md:gap-5">
          <span className={`card-icon ${o.highlight ? "card-icon-featured" : ""}`} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 md:h-8 md:w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {o.icon.map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
          </span>
          <div className="max-w-2xl">
            <span className={`tag ${o.highlight ? "tag-featured" : ""}`}>{o.tag}</span>
            <h2 className="mt-2 font-sans text-[26px] font-bold leading-snug tracking-tight">{o.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-(--color-muted)">{o.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 md:w-60 md:items-end">
          {o.comingSoon ? (
            <span className="cta-soon">{o.cta}</span>
          ) : (
            <>
              {o.price && (
                <span className="text-right font-sans text-2xl font-bold text-(--color-accent)">
                  {o.price}
                </span>
              )}
              <Ext href={o.url ?? "#"} className={`cta ${o.highlight ? "" : "cta-outline"}`}>
                {o.cta}
              </Ext>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 md:py-16">
      <main className="flex-1">
        <header className="flex flex-col items-center gap-7 text-center md:flex-row md:items-center md:gap-10 md:text-left">
          <img
            src="/about-me.jpg"
            alt="Fatimah Hussain"
            className="h-36 w-36 shrink-0 rounded-full border-4 border-white object-cover shadow-md ring-1 ring-(--color-line) md:h-44 md:w-44"
          />
          <div>
            <h1 className="font-sans text-4xl font-extrabold tracking-tight md:text-5xl">
              fatimahs.guide
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-[17px] leading-relaxed text-(--color-body)">
              I'm a UC Berkeley CS student and creator (200M+ views) helping students pay for
              college, build standout high school roadmaps, navigate tech tools to help them in
              their academic and early career journeys.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] md:justify-start">
              <a
                href="mailto:fatimahhussain@berkeley.edu"
                className="inline-flex items-center gap-1.5 text-(--color-muted) hover:text-(--color-accent)"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                fatimahhussain@berkeley.edu
              </a>
              <Ext
                href="https://stan.store/fatimahsguide"
                className="inline-flex items-center gap-1.5 text-(--color-muted) hover:text-(--color-accent)"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M10 14a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11.4 5.53" />
                  <path d="M14 10a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 1 0 7.07 7.07l1.42-1.42" />
                </svg>
                stan.store/fatimahsguide
              </Ext>
            </div>
            <div className="mt-4 flex justify-center gap-3 md:justify-start">
              {SOCIALS.map((s) => (
                <Ext
                  key={s.label}
                  href={s.url}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-line) bg-white text-(--color-ink) transition-colors hover:border-(--color-accent) hover:text-(--color-accent)"
                >
                  <span className="sr-only">{s.label}</span>
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </Ext>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-12 space-y-6">
          <NewsletterCard />
          {OFFERS.map((o) => (
            <OfferCard key={o.title} o={o} />
          ))}
        </section>

        <section className="mt-12 text-center">
          <a
            href="/personal"
            className="inline-block text-[13px] text-(--color-muted) underline underline-offset-4 hover:text-(--color-accent)"
          >
            more about me: press, work & story →
          </a>
        </section>
      </main>

      <footer className="pt-12 text-center text-[11px] text-(--color-muted)">
        © {new Date().getFullYear()} @fatimahs.guide. All rights reserved.
      </footer>
    </div>
  );
}
