const OFFERS = [
  {
    tag: "Free tool",
    title: "Find scholarships with finnie",
    description:
      "The scholarship search tool I'm building so students can actually afford college. Winner of an OpenAI ChatGPT Futures grant.",
    price: "Free",
    cta: "Try finnie",
    url: "https://findmescholarships.com",
    highlight: true,
  },
  {
    tag: "Templates & resources",
    title: "Student resource hub",
    description:
      "My templates and resources for high school and college students, all in one place: college apps, scholarships, productivity and more.",
    price: null,
    cta: "Browse the hub",
    url: "https://stan.store/fatimahsguide",
    highlight: false,
  },
  {
    tag: "Mentorship",
    title: "Mentorship through Fatimah's Guide",
    description:
      "I'm building a mentorship program for students working on college, scholarships, extracurriculars, and their own projects. Follow along to get in early.",
    price: null,
    cta: "Follow @fatimahs.guide",
    url: "https://www.instagram.com/fatimahs.guide",
    highlight: false,
  },
  {
    tag: "Work with me",
    title: "Brand partnerships & collabs",
    description:
      "I've partnered with OpenAI, Microsoft, Adobe, Notion and more on educational content reaching 200M+ views.",
    price: null,
    cta: "Email me",
    url: "mailto:fatimahhussain@berkeley.edu",
    highlight: false,
  },
];

const LINKS = [
  { label: "Instagram", url: "https://www.instagram.com/fatimahs.guide" },
  { label: "TikTok", url: "https://www.tiktok.com/@fatimahs.guide" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/fatimah-hussain/" },
  { label: "Twitter", url: "https://twitter.com/fatimahs_tech" },
];

function Ext({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
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

export default function HomeApp() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-12 md:py-16">
      <main className="flex-1">
        <header className="text-center">
          <img
            src="/about-me.png"
            alt="Fatimah Hussain"
            className="mx-auto h-24 w-24 rounded-full border-2 border-white object-cover shadow-md"
            style={{ objectPosition: "center 40%" }}
          />
          <h1 className="mt-5 font-sans text-3xl font-bold tracking-tight">Fatimah Hussain</h1>
          <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-(--color-muted)">
            UC Berkeley EECS student and creator (200M+ views) helping students pay for college,
            find standout extracurriculars, and build their own things.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px]">
            <a href="mailto:fatimahhussain@berkeley.edu" className="text-(--color-accent) underline underline-offset-4 hover:no-underline">
              fatimahhussain@berkeley.edu
            </a>
            <Ext href="https://stan.store/fatimahsguide" className="text-(--color-accent) underline underline-offset-4 hover:no-underline">
              stan.store/fatimahsguide
            </Ext>
          </div>
        </header>

        <section className="mt-10 space-y-5">
          {OFFERS.map((o) => (
            <article key={o.title} className={`card p-6 ${o.highlight ? "border-(--color-accent)" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">{o.tag}</span>
                {o.price && (
                  <span className="rounded-full bg-(--color-accent) px-3 py-0.5 font-sans text-[12px] font-bold text-white">
                    {o.price}
                  </span>
                )}
              </div>
              <h2 className="mt-3 font-sans text-xl font-bold leading-snug">{o.title}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-(--color-muted)">{o.description}</p>
              <Ext href={o.url} className={`cta mt-5 ${o.highlight ? "" : "cta-outline"}`}>
                {o.cta}
              </Ext>
            </article>
          ))}
        </section>

        <section className="mt-10 text-center">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px]">
            {LINKS.map((l) => (
              <Ext key={l.label} href={l.url} className="text-(--color-muted) underline underline-offset-4 hover:text-(--color-accent)">
                {l.label}
              </Ext>
            ))}
          </div>
          <a
            href="/personal"
            className="mt-6 inline-block text-[12px] text-(--color-muted) underline underline-offset-4 hover:text-(--color-accent)"
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
