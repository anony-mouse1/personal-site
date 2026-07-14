// Knowledge base for the Terminal "how can Fatimah help you" assistant.
// This is the single source of truth the terminal searches to answer questions.
// It mirrors the facts shown across the site (Notes app, brands, links, press) and
// is framed around helping the visitor (student / creator / founder), not just bio Q&A.

export const CONTACT_EMAIL = "fatimahhussain@berkeley.edu";

export const TERMINAL_INTRO = [
  "fatimah.sh: how can Fatimah help you?  👋",
  "",
  "Whether you're a student, creator, or founder, I can point you to the right resources.",
  'Try:  "i\'m a student, how can you help?"  ·  "how do i find scholarships?"  ·  "what is finnie?"',
  "You can also ask anything about Fatimah: her work, projects, brands, or links.",
  "Type 'help' for ideas, or 'clear' to reset.",
].join("\n");

const ANSWERS = {
  // ----- how Fatimah can help the visitor -----
  help_student:
    "Here's how Fatimah can help, especially if you're a student:\n" +
    "- finnie - find scholarships & afford college  →  findmescholarships.com\n" +
    "- Fatimah's Guide - free content on paying for college, unique extracurriculars & more  →  instagram.com/fatimahs.guide\n" +
    "- Mentorship: she's building a mentorship program through Fatimah's Guide\n" +
    "- Stan store - templates + resources for high-school & college students  →  stan.store/fatimahsguide\n\n" +
    "Tell me what you need (scholarships, extracurriculars, mentorship, resources) and I'll point you the right way -\n" +
    "or reach her directly at " + CONTACT_EMAIL + ".",

  scholarships:
    "Looking for scholarships or help affording college?\n" +
    "Fatimah is building finnie: a tool that makes scholarship search simpler and less\n" +
    "overwhelming so students can actually afford college.\n" +
    "→  findmescholarships.com\n\n" +
    "She also shares free guidance on paying for college through Fatimah's Guide:\n" +
    "→  instagram.com/fatimahs.guide",

  mentorship:
    "Fatimah is building a mentorship program through Fatimah's Guide to help students with\n" +
    "college, scholarships, extracurriculars, and building their own projects.\n" +
    "The best way in: follow & message @fatimahs.guide on Instagram, or email " + CONTACT_EMAIL + ".",

  resources:
    "Fatimah's Stan store has templates + resources for high-school & college students, all in\n" +
    "one hub: college apps, scholarships, productivity and more.\n" +
    "→  stan.store/fatimahsguide\n\n" +
    "She also posts free guides across her socials  →  instagram.com/fatimahs.guide",

  extracurriculars:
    "Want extracurriculars that actually stand out (not the usual clubs)?\n" +
    "Helping students find unique extracurriculars is a big part of what Fatimah's Guide does -\n" +
    "browse her content for ideas and playbooks:\n" +
    "→  instagram.com/fatimahs.guide\n\n" +
    "Have a specific situation? Email her at " + CONTACT_EMAIL + ".",

  creator:
    "Want to grow as a creator? Fatimah grew Fatimah's Guide to 200M+ views and 250k+ followers\n" +
    "making educational content, and has partnered with OpenAI, Notion, Adobe and more. She\n" +
    "shares how she does it across her socials. Start here:\n" +
    "→  instagram.com/fatimahs.guide  ·  tiktok.com/@fatimahs.guide\n\n" +
    "For a collab or a specific question, email " + CONTACT_EMAIL + ".",

  founder:
    "Building something? Fatimah's been shipping since she was 14: a 3D-printing business that\n" +
    "made five figures, apps on the App Store, and now finnie. She was part of FoundHer House\n" +
    "and the Founders Inc offseason cohort.\n" +
    "Want advice or to connect? Reach her at " + CONTACT_EMAIL + ".",

  // ----- about Fatimah -----
  about:
    "Fatimah Hussain: 2nd-year EECS student at UC Berkeley and founder of Fatimah's Guide,\n" +
    "where she helps high-school & college students pay for college and find standout\n" +
    "extracurriculars (200M+ views, 250k+ followers). She's currently building finnie, a\n" +
    "scholarship-search tool, and has been building things since she was 14.\n\n" +
    "Ask how she can help you, or about: brands · projects · finnie · press · links · now",

  interests:
    "A few things Fatimah is into: building cute things on the internet, edtech, helping students\n" +
    "afford college, content creation, and shipping side projects. She's been an entrepreneur\n" +
    "since 14 and loves turning ideas into real things.\n" +
    "Curious about something specific? Ask about her projects or what she's up to now, or\n" +
    "email her at " + CONTACT_EMAIL + ".",

  email: "📧  " + CONTACT_EMAIL,

  links:
    "Where to find Fatimah online:\n" +
    "- Instagram:  instagram.com/fatimahs.guide   (197k)\n" +
    "- TikTok:     tiktok.com/@fatimahs.guide   (45k)\n" +
    "- LinkedIn:   linkedin.com/in/fatimah-hussain   (20k)\n" +
    "- Twitter/X:  twitter.com/fatimahs_tech\n" +
    "- Email:      " + CONTACT_EMAIL + "\n" +
    "- Stan store: stan.store/fatimahsguide",

  brands:
    "Brands & companies Fatimah has partnered with:\n\n" +
    "Tech            Microsoft, OpenAI, Adobe, Notion, Lovable, QuillBot, JobRight, Soundcore, Whop\n" +
    "Consumer Goods  Clorox, Good Culture, Chiquita, Maruchan, Extra Gum, Zevo\n" +
    "Education       Five Star, Lumiere Education, Aceable, CalKids, ABE\n" +
    "Finance         Webull, Kraken\n\n" +
    "Interested in working together? Email " + CONTACT_EMAIL + ".",

  projects:
    "Things Fatimah has built:\n" +
    "- finnie - a scholarship-search tool helping students afford college  →  findmescholarships.com\n" +
    "- Workout Wizard: a fitness companion that builds personalized workout plans\n" +
    "- Blackjack Jackpot Cards: an iOS card game shipped to the App Store (hand-coded, pre-AI)\n" +
    "- Stan store: templates + resources for students and creators\n" +
    "- perky3dprints: a 3D-printing business she ran in high school (made five figures)\n" +
    "- 2minMaths: a channel breaking down hard math concepts in 2 minutes",

  finnie:
    "finnie is the scholarship-search tool Fatimah is building to help students afford college\n" +
    "through simpler, less-overwhelming discovery. It recently won the ChatGPT Futures grant.\n" +
    "→  findmescholarships.com",

  guide:
    "Fatimah's Guide helps high-school & college students pay for college, find unique\n" +
    "extracurriculars, and more. It's reached 200M+ views and 250k+ followers across socials,\n" +
    "and has partnered with OpenAI, Notion, Adobe, Microsoft and others.\n" +
    "→  instagram.com/fatimahs.guide",

  press:
    "Selected press & features:\n" +
    "- ChatGPT Futures 2026 Awardee (OpenAI)\n" +
    "- Fast Company: OpenAI's $10,000 student prize\n" +
    "- APP Accelerator: 1st place, $15k grant\n" +
    "- The New York Times & USA Today: FoundHer House\n" +
    "- New York Times Square billboard (Karat × fatimahs.guide)\n" +
    "- Web Dev Challenge S3E3 · Tech Roast Show\n" +
    "- TEDxYouth @ Shaftesbury · KTVU Shark Tank",

  awards:
    "Awards & grants:\n" +
    "- ChatGPT Futures 2026 grant: $10,000 from OpenAI\n" +
    "- APP Accelerator: 1st place, $15,000 grant (HiiiWAY)\n" +
    "- 2022 San Ramon Outstanding Teen Citizenship Award",

  education:
    "Fatimah is a 2nd-year studying Electrical Engineering & Computer Science (EECS)\n" +
    "at UC Berkeley.",

  now:
    "Right now Fatimah is:\n" +
    "- in NYC (she splits her summers between SF and New York City)\n" +
    "- building edtech tools and working with some cool companies\n" +
    "- building out finnie's scholarship tool (recently won the ChatGPT Futures grant)\n" +
    "- building a mentorship program through Fatimah's Guide",

  foundher:
    "Fatimah was part of the founding cohort of FoundHer House: an all-female hacker house\n" +
    "in SF. It was featured in The New York Times & USA Today, and the women in the house\n" +
    "raised a combined $7M by the end of the cohort (members from Stanford, Berkeley,\n" +
    "Cornell & USC).",

  tedx:
    "Fatimah has given TEDx talks in London and in her hometown: including\n" +
    "'Breaking the feedback loop from Hell' (TEDxYouth @ Shaftesbury School).",

  work:
    "Want to work with Fatimah: a collab, brand deal, speaking, or just to connect?\n" +
    "Email " + CONTACT_EMAIL + " or DM @fatimahs.guide on Instagram.",

  greeting:
    "Hey! 👋  I'm here to help. Whether you're a student, creator, or founder, ask how Fatimah\n" +
    "can help you: try \"i'm a student, how can you help?\" or \"how do i find scholarships?\".\n" +
    "Type 'help' for more.",

  thanks: "Anytime! 🌸  Ask me anything else, or reach Fatimah directly at " + CONTACT_EMAIL + ".",

  help:
    "Ask me how Fatimah can help you, or anything about her. For example:\n" +
    "  • i'm a student: how can fatimah help me?\n" +
    "  • how do i find scholarships / pay for college?\n" +
    "  • is there a mentorship program?\n" +
    "  • what resources or templates does she have?\n" +
    "  • how did she grow as a creator?\n" +
    "  • what brands has she worked with?\n" +
    "  • what is finnie?   ·   where can i find her online?\n\n" +
    "If I can't answer, you can always reach Fatimah at " + CONTACT_EMAIL + ".\n" +
    "Shortcuts:  help · clear",

  fallback:
    "I'm not sure about that one, but Fatimah would love to help you directly.\n" +
    "📧  Reach her at " + CONTACT_EMAIL + "  or DM @fatimahs.guide on Instagram.\n\n" +
    "You can also ask me about: scholarships · mentorship · resources · projects · brands · links · now",
};

// Each intent scores against the query. Multi-word "phrases" are strong signals (substring,
// weight 3); single "keywords" are weaker (whole-word, weight 1). Highest score wins; ties
// resolve to whichever intent appears first here, so order = priority.
type Intent = { id: keyof typeof ANSWERS; phrases?: string[]; keywords?: string[] };

const INTENTS: Intent[] = [
  { id: "help", keywords: ["help", "commands", "command"], phrases: ["what can i ask", "what can you do", "how does this work"] },
  { id: "thanks", phrases: ["thank you", "thanks", "appreciate it"], keywords: ["thx", "ty"] },
  { id: "greeting", keywords: ["hi", "hello", "hey", "yo", "sup", "howdy"] },
  { id: "email", keywords: ["email", "mail", "gmail", "reach", "contact"], phrases: ["how do i reach", "get in touch", "e-mail"] },
  { id: "work", phrases: ["work with", "hire", "collaborate with", "work together", "partner with you", "brand deal", "sponsor you", "speak at", "speaking"] },

  // helping the visitor (specific → general)
  { id: "scholarships", keywords: ["scholarship", "scholarships", "tuition", "fafsa", "aid"], phrases: ["find scholarships", "pay for college", "paying for college", "afford college", "financial aid", "scholarship search", "money for college", "fund college", "cant afford"] },
  { id: "mentorship", keywords: ["mentor", "mentorship", "mentee", "coach", "coaching"], phrases: ["mentor me", "be my mentor", "mentorship program", "guidance"] },
  { id: "resources", keywords: ["resources", "templates", "template", "toolkit", "worksheets"], phrases: ["stan store", "study resources", "free resources"] },
  { id: "extracurriculars", keywords: ["extracurricular", "extracurriculars", "clubs", "ecs"], phrases: ["stand out", "college application", "college app", "get into college", "college admissions", "look good for college"] },
  { id: "creator", keywords: ["creator", "content", "grow", "growth", "followers", "audience", "influencer", "viral"], phrases: ["grow on social", "grow my", "social media growth", "content creation", "become a creator", "start a youtube", "start a tiktok", "i'm a creator", "im a creator"] },
  { id: "founder", keywords: ["startup", "founder", "entrepreneur", "entrepreneurship"], phrases: ["start a business", "start a company", "build a startup", "raise money", "i'm a founder", "im a founder", "i want to build"] },
  { id: "help_student", keywords: ["student", "students"], phrases: ["how can you help", "how can fatimah help", "how can she help", "help me", "can you help", "i'm a student", "im a student", "i am a student", "as a student", "help students", "what can fatimah do for me"] },

  // about Fatimah
  { id: "brands", keywords: ["brand", "brands", "partner", "partners", "partnership", "partnerships", "companies", "sponsor", "sponsors", "sponsored", "collab", "collabs", "collaborations"], phrases: ["worked with", "partnered with", "which companies", "what companies"] },
  { id: "finnie", keywords: ["finnie", "finnie's"] },
  { id: "guide", phrases: ["fatimah's guide", "fatimahs guide"], keywords: ["guide"] },
  { id: "foundher", keywords: ["foundher"], phrases: ["foundher house", "hacker house", "all-female", "all female"] },
  { id: "tedx", keywords: ["tedx", "ted"], phrases: ["ted talk", "ted talks", "public speaking", "given a talk"] },
  { id: "awards", keywords: ["award", "awards", "grant", "grants", "prize", "prizes", "won", "win", "recognition"], phrases: ["has she won", "what has she won"] },
  { id: "press", keywords: ["press", "feature", "featured", "media", "news", "article", "articles", "mention", "mentions", "nyt", "newspaper"], phrases: ["in the news", "new york times"] },
  { id: "projects", keywords: ["project", "projects", "built", "build", "building", "made", "ship", "shipped", "apps", "portfolio", "startups"], phrases: ["worked on", "what has she built", "what does she build", "what did she make"] },
  { id: "links", keywords: ["link", "links", "social", "socials", "instagram", "insta", "ig", "tiktok", "twitter", "linkedin", "follow", "handle", "handles", "youtube"], phrases: ["find her", "find fatimah", "where can i find", "follow her", "social media"] },
  { id: "education", keywords: ["school", "college", "university", "berkeley", "major", "study", "studying", "studies", "education", "eecs", "degree"], phrases: ["go to school", "where does she study", "what does she study"] },
  { id: "now", keywords: ["now", "currently", "lately", "today"], phrases: ["up to", "these days", "right now", "working on now", "what is she doing"] },
  { id: "interests", keywords: ["interest", "interests", "hobby", "hobbies", "passion", "passions", "favorite", "favorites", "favourite", "enjoy", "enjoys"], phrases: ["what does she like", "what is she into", "free time", "what does she enjoy"] },
  { id: "about", keywords: ["about", "who", "bio", "yourself", "her", "she", "fatimah"], phrases: ["tell me about", "who is", "introduce"] },
];

// Shown when neither the local matcher nor the API can answer.
export const FALLBACK_ANSWER = ANSWERS.fallback;

function normalize(s: string) {
  return s.toLowerCase().replace(/[^\w\s'@.-]/g, " ").replace(/\s+/g, " ").trim();
}

// Returns a canned answer for a confidently-matched topic, or null when nothing
// matches - the caller can then fall through to the Claude API for a freeform reply.
export function answerQuestion(raw: string): string | null {
  const q = normalize(raw);
  if (!q) return "";

  // Playful shell-style shortcuts that still feel like a terminal.
  if (q === "whoami") return "fatimah hussain - eecs @ uc berkeley";
  if (q === "ls" || q === "ls projects" || q === "ls projects/") return ANSWERS.projects;
  if (q === "help" || q === "man" || q === "?") return ANSWERS.help;

  const words = new Set(q.split(" "));
  let best: { id: keyof typeof ANSWERS; score: number } | null = null;

  for (const intent of INTENTS) {
    let score = 0;
    for (const p of intent.phrases ?? []) if (q.includes(p)) score += 3;
    for (const k of intent.keywords ?? []) if (words.has(k)) score += 1;
    if (score > 0 && (!best || score > best.score)) best = { id: intent.id, score };
  }

  if (!best) return null;
  return ANSWERS[best.id];
}

// Full factual dossier handed to Claude (Haiku) as grounding context for freeform
// questions the local matcher can't handle. Keep this in sync with the site's content.
export const BIO_CONTEXT = `
ABOUT
- Fatimah Hussain. 2nd-year studying Electrical Engineering & Computer Science (EECS) at UC Berkeley.
- Founder of Fatimah's Guide - helps high-school & college students pay for college, find unique extracurriculars, and more. 200M+ views and 250k+ followers across socials.
- Has been building things since she was 14.
- Public email: ${CONTACT_EMAIL}

WHAT SHE'S BUILDING NOW
- In NYC (splits summers between SF and New York City).
- Building edtech tools and working with some companies.
- Building finnie, a scholarship-search tool - findmescholarships.com. Recently won the ChatGPT Futures grant.
- Building a mentorship program through Fatimah's Guide.

HOW SHE CAN HELP PEOPLE
- Students: scholarships and affording college (finnie), free guidance via Fatimah's Guide, a forthcoming mentorship program, and templates/resources via her Stan store (stan.store/fatimahsguide).
- Finding unique, standout extracurriculars (not the usual clubs) - a core focus of Fatimah's Guide.
- Creators: she grew Fatimah's Guide to 200M+ views / 250k+ followers; she shares how across her socials.
- Founders/builders: she's shipped since 14 (3D-printing business, App Store apps, finnie); was in FoundHer House and the Founders Inc offseason cohort.

PROJECTS
- finnie - scholarship-search tool to help students afford college (findmescholarships.com).
- Workout Wizard - a fitness companion that builds personalized workout plans.
- Blackjack Jackpot Cards - an iOS card game shipped to the App Store, hand-coded pre-AI.
- Stan store - templates + resources for students and creators (stan.store/fatimahsguide).
- perky3dprints - a 3D-printing business she ran in high school that made five figures.
- 2minMaths - a channel breaking down hard math concepts in 2 minutes (~20k TikTok, ~5k YouTube).

BRANDS / PARTNERSHIPS
- Tech: Microsoft, OpenAI, Adobe, Notion, Lovable, QuillBot, JobRight, Soundcore, Whop.
- Consumer Goods: Clorox, Good Culture, Chiquita, Maruchan, Extra Gum, Zevo.
- Education: Five Star, Lumiere Education, Aceable, CalKids, ABE.
- Finance: Webull, Kraken.

PRESS & AWARDS
- ChatGPT Futures 2026 Awardee (OpenAI); Fast Company covered OpenAI's $10,000 student prize.
- APP Accelerator - 1st place, $15,000 grant (HiiiWAY).
- The New York Times & USA Today - featured for FoundHer House.
- New York Times Square billboard (Karat x fatimahs.guide).
- Web Dev Challenge S3E3; Tech Roast Show; TEDxYouth @ Shaftesbury ("Breaking the feedback loop from Hell"); KTVU Shark Tank youth competition; The Wildcat Tribune (3D-printing business); 2022 San Ramon Outstanding Teen Citizenship Award.

BACKGROUND
- Founding cohort of FoundHer House - all-female hacker house in SF; featured in NYT & USA Today; women in the house raised a combined $7M by the end of the cohort; members from Stanford, Berkeley, Cornell, USC.
- TEDx talks in London and her hometown.
- Ran children's business fairs in her hometown.

LINKS
- Instagram: instagram.com/fatimahs.guide (197k)
- TikTok: tiktok.com/@fatimahs.guide (45k)
- LinkedIn: linkedin.com/in/fatimah-hussain (20k)
- Twitter/X: twitter.com/fatimahs_tech
- Personal Instagram: instagram.com/fatim4hhussain
- Stan store: stan.store/fatimahsguide
- Email: ${CONTACT_EMAIL}
`.trim();
