"use client";

import { useRef, useState } from "react";
import { CONTACT_EMAIL, answerQuestion, FALLBACK_ANSWER } from "@/lib/bio";

/* ============================================================
   Content
   ============================================================ */

type PressItem = {
  url: string;
  title: string;
  description: string;
  source: string;
  date: string;
  image: string;
  featured?: boolean;
};

const PRESS: { era: string; items: PressItem[] }[] = [
  {
    era: "College",
    items: [
      {
        url: "https://www.nytimes.com/2025/08/23/business/ai-female-hackers-foundher-house.html",
        title: "In an All-Female Hacker House, Women Build the Next Wave of AI Startups",
        description:
          "Inside FoundHer House, the SF live-in incubator where 18- to 21-year-old founders from Stanford, Berkeley, Cornell, and USC are racing to ship AI products.",
        source: "The New York Times",
        date: "Aug 23, 2025",
        image: "/press-nyt.webp",
        featured: true,
      },
      {
        url: "https://chatgpt.com/futures/#finnie",
        title: "ChatGPT Futures 2026 Awardee",
        description:
          "Recognized in OpenAI's inaugural ChatGPT Futures Class of 2026: 26 students and young builders honored for shipping with AI.",
        source: "OpenAI",
        date: "May 6, 2026",
        image: "/press-chatgpt-futures.png",
        featured: true,
      },
      {
        url: "https://www.linkedin.com/posts/fatimah-hussain_mom-look-i-made-it-on-the-new-york-times-activity-7419828292716806144-GYWH",
        title: "Featured on a New York Times Square billboard",
        description:
          "Karat × fatimahs.guide: 300M views and 200K followers as an educational content creator, lit up in Times Square.",
        source: "Times Square",
        date: "2025",
        image: "/press-billboard.jpeg",
        featured: true,
      },
      {
        url: "https://www.fastcompany.com/91539141/students-receive-10000-prizes-from-openai-for-innovative-use-of-ai",
        title: "OpenAI awards students $10,000 prizes for innovative use of AI",
        description:
          "Fast Company covered OpenAI's ChatGPT Futures program, highlighting the students receiving $10,000 grants for building ambitious projects with AI.",
        source: "Fast Company",
        date: "May 2026",
        image: "/press-fastcompany-openai-prize.png",
      },
      {
        url: "https://www.usatoday.com/story/money/2025/08/20/silicon-valley-tech-women-hacker-houses/85521246007/",
        title:
          "Their rent is VC-backed and they're blasting Taylor Swift: Inside this all-female hacker house",
        description:
          "USA Today goes inside the all-female hacker house in Silicon Valley redefining what a tech founder looks like.",
        source: "USA Today",
        date: "Aug 20, 2025",
        image: "/press-usatoday.png",
      },
      {
        url: "https://www.allpeoplepower.com/",
        title: "APP Accelerator First Place Winner: $15K Grant",
        description:
          "Won first place in the All People Powered Accelerator pitch competition for finnie, awarded a $15,000 grant from HiiiWAY.",
        source: "All People Power",
        date: "2026",
        image: "/press-app-accelerator.png",
      },
      {
        url: "https://codetv.dev/series/web-dev-challenge/s3/e3-bring-people-together/play",
        title: "Web Dev Challenge S3E3: An app to bring people together",
        description:
          "Featured on CodeTV's Web Dev Challenge: building an app to make us less lonely, maybe.",
        source: "CodeTV",
        date: "S3 · E3",
        image: "/press-codex-challenge.png",
      },
      {
        url: "https://www.youtube.com/watch?v=CYl_3eL3o0w",
        title: "Pitching a meme app on the Tech Roast Show",
        description: "Got roasted (and pitched) live on the Tech Roast Show podcast.",
        source: "Tech Roast Show",
        date: "2025",
        image: "https://img.youtube.com/vi/CYl_3eL3o0w/maxresdefault.jpg",
      },
    ],
  },
  {
    era: "High School",
    items: [
      {
        url: "https://www.youtube.com/watch?v=h3bRt453CVM",
        title: "Breaking the feedback loop from Hell",
        description: "TEDxYouth @ Shaftesbury School · Fatimah Hussain.",
        source: "TEDx Talks",
        date: "London",
        image: "https://img.youtube.com/vi/h3bRt453CVM/maxresdefault.jpg",
      },
      {
        url: "https://www.ktvu.com/video/1413508",
        title: "Contra Costa Shark Tank Youth Competition",
        description:
          "Bay Area teen entrepreneur kickstarts a local youth competition, live in-studio on KTVU with the first-place winner.",
        source: "KTVU FOX 2",
        date: "2023",
        image: "/press-shark-tank.png",
      },
      {
        url: "https://thewildcattribune.com/17839/news/learning-by-doing-how-fatimah-hussain-journeyed-through-her-1st-3d-printing-business/",
        title: "Learning by Doing: A First 3D Printing Business",
        description:
          "Profile on starting Unicorn Lock, a child-safe lock business, and the lessons of consistency, failure, and impact across four early ventures.",
        source: "The Wildcat Tribune",
        date: "Oct 10, 2023",
        image: "/press-wildcat-tribune.jpg",
      },
      {
        url: "https://www.instagram.com/p/CnSzjKdPKtr/",
        title: "2022 San Ramon Outstanding Teen Citizenship Award",
        description:
          "Honored by the City of San Ramon Parks & Community Services for community service and leadership.",
        source: "City of San Ramon",
        date: "2022",
        image: "/press-citizenship-award.png",
      },
    ],
  },
];

const WORK = [
  {
    index: "01",
    name: "finnie",
    url: "https://findmescholarships.com",
    role: "Founder · now",
    description:
      "A scholarship search tool that helps students afford college through simpler, less overwhelming discovery. Winner of an OpenAI ChatGPT Futures grant and a $15K APP Accelerator grant.",
  },
  {
    index: "02",
    name: "Fatimah's Guide",
    url: "https://www.instagram.com/fatimahs.guide",
    role: "Creator · now",
    description:
      "Educational content helping high school and college students pay for college and find unique extracurriculars. 200M+ views and 250K+ followers across platforms, with a mentorship program on the way.",
  },
  {
    index: "03",
    name: "Stan Store",
    url: "https://stan.store/fatimahsguide",
    role: "Templates & resources",
    description:
      "Templates and resources for high school and college students, all in one hub: college apps, scholarships, productivity and more.",
  },
  {
    index: "04",
    name: "Earlier ventures",
    url: null,
    role: "Since age 14",
    description:
      "perky3dprints, a five-figure 3D-printing business in high school · Blackjack Jackpot Cards, an iOS game hand-coded pre-AI tools · 2minmaths, a math channel with 25K subscribers · children's business fairs · two TEDx talks · founding cohort of FoundHer House and the Founders Inc offseason cohort.",
  },
];

const PARTNERS: { name: string; logo: string; h: number }[] = [
  { name: "OpenAI", logo: "/logos/openai.png", h: 22 },
  { name: "Microsoft", logo: "/logos/microsoft.svg", h: 22 },
  { name: "Adobe", logo: "/logos/adobe.svg", h: 26 },
  { name: "Notion", logo: "/logos/notion.svg", h: 24 },
  { name: "Lovable", logo: "/logos/lovable-wordmark.png", h: 18 },
  { name: "QuillBot", logo: "/logos/quillbot-wordmark.png", h: 22 },
  { name: "Whop", logo: "/logos/whop.png", h: 22 },
  { name: "soundcore", logo: "/logos/soundcore.webp", h: 18 },
  { name: "Clorox", logo: "/logos/clorox.svg", h: 20 },
  { name: "Chiquita", logo: "/logos/chiquita.svg", h: 30 },
  { name: "Maruchan", logo: "/logos/maruchan.svg", h: 26 },
  { name: "Extra", logo: "/logos/extra-gum.svg", h: 24 },
  { name: "Jobright", logo: "/logos/jobright.png", h: 22 },
  { name: "Zevo", logo: "/logos/zevo.png", h: 22 },
  { name: "Kraken", logo: "/logos/kraken.webp", h: 20 },
  { name: "Webull", logo: "/logos/webull.png", h: 22 },
  { name: "Five Star", logo: "/logos/five-star.svg", h: 22 },
  { name: "CalKIDS", logo: "/logos/calkids.png", h: 22 },
  { name: "Lumiere", logo: "/logos/lumiere-education.png", h: 22 },
  { name: "Aceable", logo: "/logos/aceable.png", h: 22 },
];

const SOCIALS = [
  { name: "Instagram", handle: "@fatimahs.guide", note: "197K", url: "https://www.instagram.com/fatimahs.guide" },
  { name: "TikTok", handle: "@fatimahs.guide", note: "45K", url: "https://www.tiktok.com/@fatimahs.guide" },
  { name: "LinkedIn", handle: "fatimah-hussain", note: "20K", url: "https://www.linkedin.com/in/fatimah-hussain/" },
  { name: "Twitter", handle: "@fatimahs_tech", note: "", url: "https://twitter.com/fatimahs_tech" },
  { name: "Instagram (personal)", handle: "@fatim4hhussain", note: "", url: "https://www.instagram.com/fatim4hhussain" },
];

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Press", href: "#press" },
  { label: "Work", href: "#work" },
  { label: "Partners", href: "#partners" },
  { label: "Ask", href: "#ask" },
  { label: "Contact", href: "#contact" },
];

/* ============================================================
   Building blocks
   ============================================================ */

function Ext({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

function SectionHeading({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <div id={id} className="scroll-mt-24 pt-16 md:pt-24">
      <div className="rule-heavy" />
      <div className="flex flex-wrap items-baseline justify-between gap-2 pt-4 pb-10 md:pb-14">
        <span className="kicker">{kicker}</span>
        <h2 className="display text-3xl md:text-5xl font-medium tracking-tight">{title}</h2>
      </div>
    </div>
  );
}

/* ============================================================
   Sections
   ============================================================ */

function Masthead() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <header className="border-b border-(--color-rule) bg-(--color-paper)/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">
          <a href="#top" className="font-semibold text-(--color-ink) hover:text-(--color-accent) transition-colors">
            Fatimah Hussain
          </a>
          <span className="hidden md:block">{today}</span>
          <nav className="flex gap-4 md:gap-6">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-(--color-accent) transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16 items-end pt-14 md:pt-24 pb-14 md:pb-20">
        <div>
          <p className="kicker mb-6">Berkeley, California</p>
          <h1 className="display text-[13vw] leading-[0.95] md:text-8xl font-light tracking-tight">
            Fatimah
            <br />
            <em className="font-medium">Hussain</em>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-(--color-muted)">
            Creator &amp; builder helping students afford college. Founder of{" "}
            <Ext href="https://www.instagram.com/fatimahs.guide" className="elink text-(--color-ink)">
              Fatimah's Guide
            </Ext>{" "}
            and{" "}
            <Ext href="https://findmescholarships.com" className="elink text-(--color-ink)">
              finnie
            </Ext>
            . EECS at UC Berkeley.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md border-t border-(--color-rule) pt-6">
            {[
              ["200M+", "content views"],
              ["250K+", "followers"],
              ["NYT · USA Today", "featured in"],
            ].map(([num, label]) => (
              <div key={label}>
                <dt className="display text-xl md:text-2xl font-medium">{num}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.15em] text-(--color-faint)">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="max-w-xs md:max-w-none md:justify-self-end">
          <img
            src="/about-me.png"
            alt="Fatimah in Shibuya"
            className="w-full aspect-[4/5] object-cover"
            style={{ objectPosition: "center 55%" }}
          />
          <figcaption className="mt-2 text-[11px] uppercase tracking-[0.15em] text-(--color-faint)">
            Shibuya, Tokyo
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8">
      <SectionHeading id="about" kicker="No. 1" title="About" />
      <div className="grid gap-12 md:grid-cols-2 md:gap-16 pb-4">
        <div>
          <h3 className="kicker mb-5">Currently</h3>
          <ul className="space-y-5 text-[17px] leading-relaxed">
            <li>
              Second-year studying electrical engineering &amp; computer science at UC Berkeley.
            </li>
            <li>
              Founder of{" "}
              <Ext href="https://www.instagram.com/fatimahs.guide" className="elink">
                Fatimah's Guide
              </Ext>
              , helping high school &amp; college students pay for college and find unique
              extracurriculars. 200M views, 250K followers, partnered with OpenAI, Notion, Adobe,
              Microsoft and more.
            </li>
            <li>
              Building{" "}
              <Ext href="https://findmescholarships.com" className="elink">
                finnie
              </Ext>
              , a tool that helps students afford college through simpler scholarship search.
              Recent winner of the{" "}
              <Ext href="https://chatgpt.com/futures/#finnie" className="elink">
                ChatGPT Futures grant
              </Ext>
              .
            </li>
            <li>
              Building a mentorship program through{" "}
              <Ext href="https://www.instagram.com/fatimahs.guide" className="elink">
                Fatimah's Guide
              </Ext>
              .
            </li>
          </ul>
        </div>
        <div>
          <h3 className="kicker mb-5">Previously</h3>
          <ul className="space-y-5 text-[17px] leading-relaxed text-(--color-muted)">
            <li>Building since age 14, starting with children's business fairs in her hometown.</li>
            <li>
              Founding cohort of{" "}
              <Ext href="https://www.foundherhouse.org/" className="elink text-(--color-ink)">
                FoundHer House
              </Ext>
              , the all-female hacker house in SF covered by The New York Times and USA Today,
              where residents raised $7M by the end of the cohort.
            </li>
            <li>
              Ran{" "}
              <Ext href="https://youtube.com/@2minmaths" className="elink text-(--color-ink)">
                2minmaths
              </Ext>
              , breaking down difficult math concepts in two minutes, reaching 25K subscribers
              across TikTok and YouTube.
            </li>
            <li>
              Founded perky3dprints, a five-figure 3D-printing business in high school, and shipped
              Blackjack Jackpot Cards to the App Store, hand-coded pre-AI tools.
            </li>
            <li>
              Two{" "}
              <Ext href="https://www.ted.com/about/programs-initiatives/tedx-program" className="elink text-(--color-ink)">
                TEDx
              </Ext>{" "}
              talks (London and her hometown) and part of the{" "}
              <Ext href="https://f.inc" className="elink text-(--color-ink)">
                Founders Inc
              </Ext>{" "}
              offseason cohort.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function PressCard({ item }: { item: PressItem }) {
  return (
    <Ext href={item.url} className="group block">
      <div className="overflow-hidden bg-(--color-rule)">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="press-img aspect-[16/10] w-full object-cover group-hover:scale-[1.02]"
        />
      </div>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-(--color-accent)">
          {item.source} <span className="text-(--color-faint)">· {item.date}</span>
        </p>
        <h3 className="display mt-2 text-xl md:text-2xl font-medium leading-snug group-hover:text-(--color-accent) transition-colors">
          {item.title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-(--color-muted)">{item.description}</p>
      </div>
    </Ext>
  );
}

function Press() {
  const items = PRESS.flatMap((g) => g.items);
  const railRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  function updateArrows() {
    const el = railRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 8,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 8,
    });
  }

  function page(dir: 1 | -1) {
    railRef.current?.scrollBy({
      left: dir * Math.round(railRef.current.clientWidth * 0.85),
      behavior: "smooth",
    });
  }

  const caret =
    "flex h-11 w-11 items-center justify-center border border-(--color-rule) text-xl leading-none " +
    "text-(--color-ink) transition-colors hover:border-(--color-accent) hover:text-(--color-accent) " +
    "disabled:opacity-30 disabled:hover:border-(--color-rule) disabled:hover:text-(--color-ink)";

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8">
      <SectionHeading id="press" kicker="No. 2" title="Press" />
      <div className="-mt-4 flex items-center justify-between pb-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-(--color-faint)">
          {items.length} features · scroll for more
        </p>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous press" onClick={() => page(-1)} disabled={!canScroll.left} className={caret}>
            ‹
          </button>
          <button type="button" aria-label="More press" onClick={() => page(1)} disabled={!canScroll.right} className={caret}>
            ›
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        onScroll={updateArrows}
        className="no-scrollbar flex snap-x gap-8 overflow-x-auto pb-6"
      >
        {items.map((item) => (
          <div key={item.url} className="w-[300px] shrink-0 snap-start md:w-[360px]">
            <PressCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8">
      <SectionHeading id="work" kicker="No. 3" title="Work" />
      <div className="divide-y divide-(--color-rule) border-b border-(--color-rule)">
        {WORK.map((w) => {
          const inner = (
            <div className="grid gap-2 md:grid-cols-[80px_260px_1fr] md:gap-8 py-8 items-baseline">
              <span className="display text-lg text-(--color-faint)">{w.index}</span>
              <div>
                <h3 className="display text-2xl md:text-3xl font-medium group-hover:text-(--color-accent) transition-colors">
                  {w.name}
                </h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-(--color-faint)">{w.role}</p>
              </div>
              <p className="text-[16px] leading-relaxed text-(--color-muted)">{w.description}</p>
            </div>
          );
          return w.url ? (
            <Ext key={w.index} href={w.url} className="group block">
              {inner}
            </Ext>
          ) : (
            <div key={w.index}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8">
      <SectionHeading id="partners" kicker="No. 4" title="Partners" />
      <p className="max-w-xl text-[16px] leading-relaxed text-(--color-muted) -mt-6 pb-10">
        Brands Fatimah's Guide has worked with on educational content and campaigns.
      </p>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-8 pb-4">
        {PARTNERS.map((p) => (
          <span key={p.name} className="partner-logo inline-flex items-center gap-2" title={p.name}>
            <img src={p.logo} alt={p.name} style={{ height: p.h }} className="w-auto object-contain" />
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Ask: answers entirely from the local matcher in lib/bio.ts
   ============================================================ */

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "I'm a student, how can you help?",
  "How do I find scholarships?",
  "What is finnie?",
  "How did you grow to 200M views?",
];

function Ask() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  function submit(raw?: string) {
    const question = (raw ?? input).trim();
    if (!question) return;
    setInput("");

    const answer = answerQuestion(question) || FALLBACK_ANSWER;
    setTurns((t) => [...t, { role: "user", content: question }, { role: "assistant", content: answer }]);
    requestAnimationFrame(() =>
      threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" })
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8">
      <SectionHeading id="ask" kicker="No. 5" title="Ask" />
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16 pb-4">
        <div>
          <p className="text-[17px] leading-relaxed text-(--color-muted)">
            An assistant trained on Fatimah's work. Whether you're a student, creator, or founder,
            ask it anything and it will point you to the right resource.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="border border-(--color-rule) px-3 py-1.5 text-[13px] text-(--color-muted) hover:border-(--color-accent) hover:text-(--color-accent) transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="border border-(--color-rule) bg-white/50">
          <div ref={threadRef} className="max-h-80 overflow-y-auto px-5 py-4 space-y-4">
            {turns.length === 0 && (
              <p className="text-[14px] text-(--color-faint) py-6 text-center">
                Ask a question to start.
              </p>
            )}
            {turns.map((t, i) => (
              <div key={i}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-(--color-faint) mb-1">
                  {t.role === "user" ? "You" : "Assistant"}
                </p>
                <p
                  className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                    t.role === "user" ? "display text-lg" : "text-(--color-muted)"
                  }`}
                >
                  {t.content}
                </p>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex border-t border-(--color-rule)"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Fatimah, finnie, scholarships…"
              className="min-w-0 flex-1 bg-transparent px-5 py-3.5 text-[15px] outline-none placeholder:text-(--color-faint)"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-(--color-accent) disabled:text-(--color-faint) transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 md:px-8 pb-16">
      <SectionHeading id="contact" kicker="No. 6" title="Contact" />
      <div className="grid gap-12 md:grid-cols-2 pb-16">
        <div>
          <p className="text-[17px] leading-relaxed text-(--color-muted) max-w-md">
            For collaborations, mentorship, speaking, or anything else, the fastest way to reach
            Fatimah is email.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="display elink mt-4 inline-block text-2xl md:text-3xl font-medium"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <div className="divide-y divide-(--color-rule) border-t border-(--color-rule) md:border-t-0">
          {SOCIALS.map((s) => (
            <Ext
              key={s.url}
              href={s.url}
              className="group flex items-baseline justify-between py-3"
            >
              <span className="text-[15px] font-medium group-hover:text-(--color-accent) transition-colors">
                {s.name}
              </span>
              <span className="text-[13px] text-(--color-faint)">
                {s.handle}
                {s.note && <span className="ml-2 text-(--color-accent)">{s.note}</span>}
              </span>
            </Ext>
          ))}
        </div>
      </div>
      <div className="rule pt-4 flex flex-wrap justify-between gap-2 text-[11px] uppercase tracking-[0.18em] text-(--color-faint)">
        <span>© {new Date().getFullYear()} Fatimah Hussain</span>
        <span>Berkeley, CA</span>
      </div>
    </footer>
  );
}

/* ============================================================ */

export default function App() {
  return (
    <>
      <Masthead />
      <main>
        <Hero />
        <About />
        <Press />
        <Work />
        <Partners />
        <Ask />
      </main>
      <Footer />
    </>
  );
}
