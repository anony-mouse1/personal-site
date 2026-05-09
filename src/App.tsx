import { useState, useRef, useEffect } from "react";

type AppId = "finder" | "notes" | "spotify" | "photos" | "bear" | "safari";

type WindowState = {
  id: AppId;
  x: number;
  y: number;
  z: number;
};

const APP_TITLES: Record<AppId, string> = {
  finder: "Finder",
  notes: "Notes",
  spotify: "Spotify",
  photos: "Photos",
  bear: "Projects",
  safari: "Safari",
};

type Theme = "light" | "dark";

export default function App() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: "notes", x: 120, y: 60, z: 1 },
  ]);
  const [topZ, setTopZ] = useState(1);
  const [activeApp, setActiveApp] = useState<AppId>("notes");
  const [now, setNow] = useState(new Date());
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [userOverrodeTheme, setUserOverrodeTheme] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("theme") !== null;
  });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (userOverrodeTheme) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [userOverrodeTheme]);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    setUserOverrodeTheme(true);
    window.localStorage.setItem("theme", next);
  };

  const openApp = (id: AppId) => {
    setActiveApp(id);
    setWindows((ws) => {
      const newZ = topZ + 1;
      setTopZ(newZ);
      const existing = ws.find((w) => w.id === id);
      if (existing) {
        return ws.map((w) => (w.id === id ? { ...w, z: newZ } : w));
      }
      const offset = ws.length * 30;
      return [...ws, { id, x: 130 + offset, y: 70 + offset, z: newZ }];
    });
  };

  const closeWindow = (id: AppId) =>
    setWindows((ws) => ws.filter((w) => w.id !== id));

  const focusWindow = (id: AppId) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setActiveApp(id);
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z: newZ } : w)));
  };

  const moveWindow = (id: AppId, x: number, y: number) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));

  return (
    <div className={`wallpaper relative w-full h-full overflow-hidden select-none ${theme === "dark" ? "dark" : ""}`}>
      <MenuBar appName={APP_TITLES[activeApp]} now={now} theme={theme} onToggleTheme={toggleTheme} />

      <DesktopIcons onOpen={openApp} />

      {windows.map((w) => (
        <Window
          key={w.id}
          state={w}
          onClose={() => closeWindow(w.id)}
          onFocus={() => focusWindow(w.id)}
          onMove={(x, y) => moveWindow(w.id, x, y)}
        >
          {w.id === "notes" && <NotesApp />}
          {w.id === "bear" && <BearApp />}
          {w.id === "safari" && <SafariApp />}
          {w.id === "photos" && <PhotosApp />}
          {w.id === "finder" && <FinderApp />}
          {w.id === "spotify" && <SpotifyApp />}
        </Window>
      ))}

      <Dock onOpen={openApp} openIds={windows.map((w) => w.id)} />
    </div>
  );
}

/* ==================== Menu bar ==================== */
function MenuBar({ appName, now, theme, onToggleTheme }: { appName: string; now: Date; theme: Theme; onToggleTheme: () => void }) {
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  return (
    <div className="glass-menubar absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-3 text-[13px] text-white z-50">
      <div className="flex items-center gap-4">
        <AppleLogo />
        <span className="font-semibold">{appName}</span>
        <span className="opacity-90">File</span>
        <span className="opacity-90">Edit</span>
        <span className="opacity-90">View</span>
        <span className="opacity-90">Window</span>
        <span className="opacity-90">Help</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="hover:bg-white/15 rounded px-1 py-0.5 transition-colors"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
        <BatteryIcon />
        <WifiIcon />
        <ControlCenterIcon />
        <span>{date}  {time}</span>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
      <path d="M11.6 8.5c0-1.4 1.1-2.1 1.2-2.2-0.7-1-1.7-1.1-2.1-1.1-0.9-0.1-1.7 0.5-2.2 0.5-0.5 0-1.2-0.5-2-0.5-1 0-2 0.6-2.5 1.5-1.1 1.9-0.3 4.6 0.8 6.1 0.5 0.7 1.1 1.5 1.9 1.5 0.8 0 1.1-0.5 2.1-0.5s1.2 0.5 2 0.5c0.8 0 1.4-0.7 1.9-1.5 0.6-0.9 0.9-1.7 0.9-1.7s-1.7-0.6-1.7-2.6zm-2-4.7c0.4-0.5 0.7-1.2 0.6-1.9-0.6 0-1.3 0.4-1.7 0.9-0.4 0.4-0.7 1.1-0.6 1.8 0.7 0.1 1.3-0.3 1.7-0.8z"/>
    </svg>
  );
}

function BatteryIcon() {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px]">84%</span>
      <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
        <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="white" strokeOpacity="0.6"/>
        <rect x="2" y="2" width="13" height="7" rx="1" fill="white"/>
        <rect x="19.5" y="3.5" width="1.5" height="4" rx="0.5" fill="white" fillOpacity="0.6"/>
      </svg>
    </div>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
      <path d="M8 11l1.5-2c-0.4-0.3-0.9-0.5-1.5-0.5s-1.1 0.2-1.5 0.5L8 11z"/>
      <path d="M8 7c1.4 0 2.6 0.5 3.5 1.4l1.4-1.4C11.6 5.6 9.9 5 8 5S4.4 5.6 3.1 7l1.4 1.4C5.4 7.5 6.6 7 8 7z" opacity="0.85"/>
      <path d="M8 3c2.2 0 4.3 0.9 5.8 2.4l1.4-1.4C13.4 2.1 10.8 1 8 1S2.6 2.1 0.8 4l1.4 1.4C3.7 3.9 5.8 3 8 3z" opacity="0.7"/>
    </svg>
  );
}

function ControlCenterIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <rect x="1" y="1" width="14" height="4" rx="2" stroke="white" strokeOpacity="0.85"/>
      <rect x="1" y="7" width="14" height="4" rx="2" stroke="white" strokeOpacity="0.85"/>
      <circle cx="11" cy="3" r="1" fill="white"/>
      <circle cx="5" cy="9" r="1" fill="white"/>
    </svg>
  );
}

/* ==================== Window chrome ==================== */
function Window({
  state,
  onClose,
  onFocus,
  onMove,
  children,
}: {
  state: WindowState;
  onClose: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
}) {
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    onFocus();
    dragRef.current = { dx: e.clientX - state.x, dy: e.clientY - state.y };
    const onMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      onMove(ev.clientX - dragRef.current.dx, ev.clientY - dragRef.current.dy);
    };
    const onMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className="window-open absolute window-shadow rounded-xl overflow-hidden"
      style={{ left: state.x, top: state.y, zIndex: state.z, width: 880, height: 580 }}
      onMouseDown={onFocus}
    >
      <div
        className="h-7 bg-[#e5e2e0]/95 dark:bg-[#2a2a2a]/95 flex items-center px-3 cursor-grab active:cursor-grabbing border-b border-black/10 dark:border-white/10"
        onMouseDown={onMouseDown}
      >
        <div className="flex gap-1.5 group">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-[#ff605c] hover:brightness-95 transition flex items-center justify-center"
            aria-label="close"
          >
            <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <path d="M1 1 L5 5 M5 1 L1 5" stroke="#4d0000" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="w-3 h-3 rounded-full bg-[#ffbd44] hover:brightness-95 transition" />
          <button className="w-3 h-3 rounded-full bg-[#00ca4e] hover:brightness-95 transition" />
        </div>
      </div>
      <div className="bg-white" style={{ height: "calc(100% - 1.75rem)", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/* ==================== Notes App ==================== */
type NoteMeta = {
  id: string;
  emoji: string;
  title: string;
  date: string;
  preview: string;
  group: "pinned" | "today" | "yesterday" | "previous";
  body: string;
};

function NotesApp() {
  const now = new Date();
  const shortDate = now.toLocaleDateString("en-US");
  const longDate = `${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

  const notes: NoteMeta[] = [
    { id: "about", emoji: "📍", title: "about me", date: shortDate, preview: "my name is fatimah (eecs @ berkeley...", group: "pinned", body: "about" },
    { id: "where", emoji: "🔗", title: "where to find me", date: shortDate, preview: "all the links in one place", group: "pinned", body: "where" },
    { id: "now", emoji: "✨", title: "now", date: shortDate, preview: "what I'm up to lately", group: "today", body: "now" },
    { id: "press", emoji: "📰", title: "press", date: shortDate, preview: "features, articles, mentions", group: "today", body: "press" },
    { id: "guest", emoji: "📝", title: "guestbook", date: shortDate, preview: "drop a piece of wisdom...", group: "today", body: "guest" },
    { id: "ideas", emoji: "💡", title: "ideas log", date: shortDate, preview: "a place for half-baked thoughts", group: "today", body: "ideas" },
    { id: "favs", emoji: "🌷", title: "favorite things", date: shortDate, preview: "a running list of favorite things", group: "today", body: "favs" },
  ];

  const [selectedNote, setSelectedNote] = useState<string>("about");
  const note = notes.find((n) => n.id === selectedNote) ?? notes[0];

  const groups: { key: NoteMeta["group"]; label: React.ReactNode }[] = [
    { key: "pinned", label: <span className="flex items-center gap-1.5"><PinIconNotes /> Pinned</span> },
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "previous", label: "Previous 7 Days" },
  ];

  return (
    <div className="flex h-full text-[13px] text-gray-800 dark:text-gray-200">
      <aside className="w-[300px] bg-[#fbfaf9] dark:bg-[#1f1f21] border-r border-black/5 dark:border-white/5 flex flex-col flex-shrink-0">
        <div className="flex items-center justify-end px-3 pt-2 pb-1.5">
          <button className="w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300" aria-label="new note">
            <ComposeIcon />
          </button>
        </div>

        <div className="px-3 mb-3">
          <div className="bg-black/5 dark:bg-white/10 rounded-md flex items-center gap-2 px-2.5 py-1.5">
            <SearchIconNotes />
            <span className="text-gray-500 dark:text-gray-400 text-[13px]">Search</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-3">
          {groups.map((g) => {
            const items = notes.filter((n) => n.group === g.key);
            if (items.length === 0) return null;
            return (
              <div key={g.key}>
                <div className="px-4 pt-3 pb-1 text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">{g.label}</div>
                {items.map((n) => (
                  <NoteListItem
                    key={n.id}
                    n={n}
                    active={n.id === selectedNote}
                    onClick={() => setSelectedNote(n.id)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1a1a1c] px-12 py-8">
        <NoteBody body={note.body} longDate={longDate} />
      </div>
    </div>
  );
}

function NoteListItem({ n, active, onClick }: { n: NoteMeta; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 transition-colors ${
        active ? "bg-[#ffd400]/30 dark:bg-[#ffd400]/20" : "hover:bg-black/[0.03] dark:hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[13px]">{n.emoji}</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-[13px]">{n.title}</span>
      </div>
      <div className="text-[11px] mt-0.5 truncate ml-[22px]">
        <span className="text-gray-700 dark:text-gray-300">{n.date}</span> <span className="text-gray-500 dark:text-gray-400">{n.preview}</span>
      </div>
    </button>
  );
}

function PinIconNotes() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.5 1.5l5 5-1.5 1.5-1-1-3 3 .5 3-1 1-3-3-3.5 3.5L1 14l3.5-3.5-3-3 1-1 3 .5 3-3-1-1z"/>
    </svg>
  );
}

function SearchIconNotes() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-gray-500">
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.3-4.3"/>
    </svg>
  );
}

function ComposeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A1.5 1.5 0 015.5 4H12"/>
      <path d="M4 5.5v13A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V12"/>
      <path d="M16.5 3.5a2 2 0 012.83 2.83L11 14.66l-3.5.84.84-3.5 8.16-8.5z"/>
    </svg>
  );
}

function LinkPreviewCard({
  url,
  title,
  description,
  source,
  date,
  image,
}: {
  url: string;
  title: string;
  description?: string;
  source: string;
  date: string;
  image?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 rounded-xl overflow-hidden hover:bg-gray-50 hover:border-gray-300 transition my-3 max-w-md no-underline"
    >
      {image && (
        <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-3.5">
        <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{source}</div>
        <div className="font-semibold text-gray-900 text-[14px] leading-snug mb-1">{title}</div>
        {description && <div className="text-[12px] text-gray-600 leading-snug mb-2 line-clamp-3">{description}</div>}
        <div className="text-[11px] text-gray-500">{date}</div>
      </div>
    </a>
  );
}

function NoteBody({ body, longDate }: { body: string; longDate: string }) {
  const link = "text-orange-500 underline hover:text-orange-600";

  if (body === "about") {
    return (
      <>
        <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📍</span>
          <h1 className="text-[22px] font-bold text-gray-900 leading-none">about me</h1>
        </div>
        <p className="text-gray-800 mb-6">my name is fatimah (eecs @ berkeley, building fatimah's guide)</p>

        <div className="mb-7 flex justify-center">
          <img
            src="/about-me.png"
            alt="fatimah in shibuya"
            className="w-80 aspect-square object-cover rounded-xl shadow-md"
            style={{ objectPosition: "center 55%" }}
          />
        </div>

        <h2 className="text-[20px] font-bold text-gray-900 mb-3">currently</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed mb-8">
          <li>2nd year studying electrical engineering & computer science at uc berkeley</li>
          <li>
            founder of <a href="https://www.instagram.com/fatimahs.guide" target="_blank" rel="noopener noreferrer" className={link}>fatimah's guide</a> — helping high school & college students pay for college, find unique extracurriculars, and more
            <ul className="list-[circle] pl-6 space-y-1.5 mt-1.5">
              <li>reached 200M views & 250k followers across socials</li>
              <li>partnered w <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className={link}>openai</a>, <a href="https://notion.so" target="_blank" rel="noopener noreferrer" className={link}>notion</a>, <a href="https://adobe.com" target="_blank" rel="noopener noreferrer" className={link}>adobe</a>, <a href="https://microsoft.com" target="_blank" rel="noopener noreferrer" className={link}>microsoft</a>, etc</li>
            </ul>
          </li>
          <li>building <a href="https://findmescholarships.com" target="_blank" rel="noopener noreferrer" className={link}>finnie</a> — a tool that helps students afford college through simpler scholarship search</li>
        </ul>

        <h2 className="text-[20px] font-bold text-gray-900 mb-3">previously</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed mb-8">
          <li>been building since I was 14</li>
          <li>ran children's business fairs in my hometown</li>
          <li>had a <a href="https://youtube.com/@2minmaths" target="_blank" rel="noopener noreferrer" className={link}>math channel</a> breaking down difficult math concepts in 2 minutes — 20k <a href="https://tiktok.com/@2minmaths" target="_blank" rel="noopener noreferrer" className={link}>tiktok</a>, 5k <a href="https://youtube.com/@2minmaths" target="_blank" rel="noopener noreferrer" className={link}>youtube</a> subscribers</li>
          <li>founded perky3dprints — a 3d printing business in high school that made five figures</li>
          <li>shipped blackjack jackpot cards to the app store (pre-ai tools, all hand-coded)</li>
          <li>did a <a href="https://www.ted.com/about/programs-initiatives/tedx-program" target="_blank" rel="noopener noreferrer" className={link}>tedx</a> talk in london and my hometown</li>
          <li>part of <a href="https://f.inc" target="_blank" rel="noopener noreferrer" className={link}>founders inc</a> offseason cohort</li>
          <li>
            founding cohort of <a href="https://www.foundherhouse.org/" target="_blank" rel="noopener noreferrer" className={link}>foundher house</a> — all-female hacker house in sf
            <ul className="list-[circle] pl-6 space-y-1.5 mt-1.5">
              <li>featured in the new york times & usa today</li>
              <li>women in the house raised a total of $7m by the end of the cohort</li>
              <li>18–21 year olds from stanford, berkeley, cornell, & usc</li>
            </ul>
          </li>
        </ul>

      </>
    );
  }
  if (body === "press") {
    return (
      <>
        <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📰</span>
          <h1 className="text-[22px] font-bold text-gray-900 leading-none">press</h1>
        </div>
        <p className="text-gray-700 mb-5">features, articles, and mentions</p>

        <h2 className="text-[15px] font-bold text-gray-800 mt-2 mb-3 uppercase tracking-wide">College</h2>
        <LinkPreviewCard
          url="https://chatgpt.com/futures/#finnie"
          title="ChatGPT Futures 2026 Awardee"
          description="Recognized as part of OpenAI's inaugural ChatGPT Futures Class of 2026 — 26 students/young builders honored for shipping with AI."
          source="chatgpt.com"
          date="May 6, 2026"
          image="/press-chatgpt-futures.png"
        />
        <LinkPreviewCard
          url="https://www.allpeoplepower.com/"
          title="APP Accelerator — First Place Winner: $15K Grant"
          description="Won first place in the All People Powered (APP) Accelerator pitch competition for finnie, awarded a $15,000 grant from HiiiWAY to grow the platform."
          source="allpeoplepower.com"
          date="2026"
          image="/press-app-accelerator.png"
        />
        <LinkPreviewCard
          url="https://www.nytimes.com/2025/08/23/business/ai-female-hackers-foundher-house.html"
          title="In an All-Female Hacker House, Women Build the Next Wave of AI Startups"
          description="Inside FoundHer House, the SF live-in incubator where 18- to 21-year-old founders from Stanford, Berkeley, Cornell, and USC are racing to ship AI products."
          source="nytimes.com"
          date="Aug 23, 2025"
          image="/press-nyt.webp"
        />
        <LinkPreviewCard
          url="https://www.usatoday.com/story/money/2025/08/20/silicon-valley-tech-women-hacker-houses/85521246007/"
          title="Their rent is VC-backed and they're blasting Taylor Swift: Inside this all-female hacker house"
          description="USA Today goes inside the all-female hacker house in Silicon Valley redefining what a tech founder looks like."
          source="usatoday.com"
          date="Aug 20, 2025"
          image="/press-usatoday.png"
        />
        <LinkPreviewCard
          url="https://www.linkedin.com/posts/fatimah-hussain_mom-look-i-made-it-on-the-new-york-times-activity-7419828292716806144-GYWH"
          title="Featured on a New York Times Square billboard"
          description="Karat × fatimahs.guide — 300M views, 200K followers as an educational content creator, lit up in Times Square."
          source="linkedin.com"
          date="2025"
          image="/press-billboard.jpeg"
        />
        <LinkPreviewCard
          url="https://codetv.dev/series/web-dev-challenge/s3/e3-bring-people-together/play"
          title="Web Dev Challenge S3E3 — An app to bring people together"
          description="Featured on CodeTV's Web Dev Challenge: building an app to make us LESS lonely, maybe?"
          source="codetv.dev"
          date="Web Dev Challenge · S3E3"
          image="/press-codex-challenge.png"
        />
        <LinkPreviewCard
          url="https://www.youtube.com/watch?v=CYl_3eL3o0w"
          title="Pitching a meme app on the Tech Roast Show"
          description="Got roasted (and pitched) live on the Tech Roast Show podcast."
          source="youtube.com"
          date="Tech Roast Show"
          image="https://img.youtube.com/vi/CYl_3eL3o0w/maxresdefault.jpg"
        />

        <h2 className="text-[15px] font-bold text-gray-800 mt-6 mb-3 uppercase tracking-wide">High School</h2>
        <LinkPreviewCard
          url="https://www.youtube.com/watch?v=h3bRt453CVM"
          title="Breaking the feedback loop from Hell"
          description="TEDxYouth @ Shaftesbury School · Fatimah Hussain"
          source="youtube.com"
          date="TEDx Talks"
          image="https://img.youtube.com/vi/h3bRt453CVM/maxresdefault.jpg"
        />
        <LinkPreviewCard
          url="https://www.ktvu.com/video/1413508"
          title="Contra Costa Shark Tank Youth Competition"
          description="Bay Area teen entrepreneur kickstarts a local youth competition. The founder and the first-place winner joined KTVU live in-studio to talk about their award-winning businesses and the inspiration behind the competition."
          source="ktvu.com"
          date="KTVU FOX 2"
          image="/press-shark-tank.png"
        />
        <LinkPreviewCard
          url="https://www.instagram.com/p/CnSzjKdPKtr/"
          title="2022 San Ramon Outstanding Teen Citizenship Award"
          description="Honored by the City of San Ramon Parks & Community Services with the Outstanding Teen Citizenship Award for community service and leadership."
          source="instagram.com"
          date="2022"
          image="/press-citizenship-award.png"
        />

        <h2 className="text-[15px] font-bold text-gray-800 mt-6 mb-3 uppercase tracking-wide">Brand Collaborations</h2>
        <div className="grid grid-cols-3 gap-2 max-w-md mb-2">
          {[
            { name: "Microsoft", color: "from-blue-500 to-cyan-500" },
            { name: "OpenAI", color: "from-gray-700 to-gray-900" },
            { name: "Codex", color: "from-emerald-500 to-teal-700" },
            { name: "ChatGPT", color: "from-green-500 to-emerald-700" },
            { name: "Adobe", color: "from-red-500 to-rose-700" },
            { name: "Notion", color: "from-gray-600 to-gray-800" },
            { name: "Notion", color: "from-gray-600 to-gray-800" },
          ].map((b, i) => (
            <div
              key={`${b.name}-${i}`}
              className={`bg-gradient-to-br ${b.color} text-white rounded-lg px-3 py-3 text-center font-semibold text-[13px] shadow-sm`}
            >
              {b.name}
            </div>
          ))}
        </div>
      </>
    );
  }
  if (body === "where") {
    return (
      <>
        <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🔗</span>
          <h1 className="text-[22px] font-bold text-gray-900 leading-none">where to find me</h1>
        </div>
        <p className="text-gray-700 mb-4">all the links in one place</p>
        <ul className="space-y-2 text-gray-800 list-disc pl-6">
          <li><a href="https://www.instagram.com/fatimahs.guide" target="_blank" rel="noopener noreferrer" className={link}>instagram</a></li>
          <li><a href="https://twitter.com/fatimahs_tech" target="_blank" rel="noopener noreferrer" className={link}>twitter</a></li>
          <li><a href="https://www.tiktok.com/@fatimahs.guide" target="_blank" rel="noopener noreferrer" className={link}>tiktok</a></li>
          <li><a href="mailto:fatimahhussain@berkeley.edu" className={link}>email</a></li>
          <li><a href="https://www.linkedin.com/in/fatimah-hussain/" target="_blank" rel="noopener noreferrer" className={link}>linkedin</a></li>
          <li><a href="https://www.instagram.com/fatim4hhussain" target="_blank" rel="noopener noreferrer" className={link}>personal instagram</a></li>
        </ul>
      </>
    );
  }
  if (body === "guest") {
    return (
      <>
        <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📝</span>
          <h1 className="text-[22px] font-bold text-gray-900 leading-none">guestbook</h1>
        </div>
        <p className="text-gray-700 mb-3">drop a piece of wisdom, a hello, or just a 🌸 — I'll read it.</p>
        <div className="rounded-xl border border-gray-200 p-4 mb-3 bg-gray-50">
          <div className="text-sm text-gray-700">"keep building cute things on the internet."</div>
          <div className="text-xs text-gray-400 mt-1">— anon, march</div>
        </div>
      </>
    );
  }
  if (body === "favs") {
    return (
      <>
        <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🌷</span>
          <h1 className="text-[22px] font-bold text-gray-900 leading-none">favorite things</h1>
        </div>
        <ul className="list-disc pl-6 space-y-1.5 text-gray-800 leading-relaxed">
          <li>[favorite book]</li>
          <li>[favorite album]</li>
          <li>[favorite cafe]</li>
          <li>[a small joy]</li>
        </ul>
      </>
    );
  }
  if (body === "now") {
    return (
      <>
        <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">✨</span>
          <h1 className="text-[22px] font-bold text-gray-900 leading-none">now</h1>
        </div>
        <p className="text-gray-800 mb-2">what I'm up to lately:</p>
        <ul className="list-disc pl-6 space-y-1.5 text-gray-800 leading-relaxed">
          <li>building [project]</li>
          <li>reading [book]</li>
          <li>listening to [album]</li>
        </ul>
      </>
    );
  }
  return (
    <>
      <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💡</span>
        <h1 className="text-[22px] font-bold text-gray-900 leading-none">ideas log</h1>
      </div>
      <p className="text-gray-800">a place for half-baked thoughts that might turn into something.</p>
    </>
  );
}

/* ==================== Bear (Projects) App ==================== */
function BearApp() {
  return (
    <div className="flex h-full text-[13px]">
      <aside className="w-44 bg-[#3a3140] text-gray-200 p-3">
        <div className="px-2 py-1.5 rounded-md bg-rose-400 text-white flex items-center gap-2 mb-1">
          🐾 Profile
        </div>
        <div className="px-2 py-1.5 rounded-md flex items-center gap-2 text-gray-300">
          📚 Projects
        </div>
      </aside>
      <div className="w-64 bg-white border-r border-gray-200 p-3 overflow-y-auto">
        <div className="rounded-lg p-3 mb-2 border-l-4 border-rose-400">
          <div className="font-semibold text-gray-800">🐱 About Me</div>
          <div className="text-xs text-gray-500 mt-1">hey there!</div>
        </div>
        <div className="rounded-lg p-3 mb-2 hover:bg-gray-50">
          <div className="font-semibold text-gray-700">🐙 Github Stats</div>
          <div className="text-xs text-gray-500 mt-1">some stats about my...</div>
        </div>
        <div className="rounded-lg p-3 hover:bg-gray-50">
          <div className="font-semibold text-gray-700">🌐 About This Site</div>
          <div className="text-xs text-gray-500 mt-1">how this little portfolio...</div>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-xs font-bold text-rose-300">H1</span>
          <h1 className="text-2xl font-bold text-gray-800">About Me</h1>
        </div>
        <div className="flex items-baseline gap-3 mb-3 mt-6">
          <span className="text-xs font-bold text-rose-300">H2</span>
          <h2 className="text-lg font-bold text-gray-800">Biography</h2>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Hey there! I'm a <span className="text-rose-400 font-medium">[student / role]</span>{" "}
          studying <span className="text-rose-400 font-medium">[major]</span> at{" "}
          <span className="text-rose-400 font-medium">[your school]</span>.
        </p>
      </div>
    </div>
  );
}

/* ==================== Safari App ==================== */
function SafariApp() {
  const links = [
    { name: "Twitter / X", url: "twitter.com/[handle]", emoji: "🐦", color: "from-sky-300 to-blue-500" },
    { name: "GitHub", url: "github.com/[handle]", emoji: "🐙", color: "from-gray-700 to-gray-900" },
    { name: "Instagram", url: "instagram.com/[handle]", emoji: "📸", color: "from-fuchsia-400 to-rose-500" },
    { name: "LinkedIn", url: "linkedin.com/in/[handle]", emoji: "💼", color: "from-blue-500 to-indigo-600" },
    { name: "YouTube", url: "youtube.com/@[handle]", emoji: "📺", color: "from-rose-400 to-red-600" },
    { name: "Email", url: "you@email.com", emoji: "✉️", color: "from-amber-300 to-orange-500" },
  ];
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="h-11 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-3">
        <div className="flex gap-2 text-gray-400 text-lg"><span>‹</span><span>›</span></div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-600 flex items-center gap-2 border border-gray-200">
          🔒 yourname.com/links
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">find me elsewhere</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">all the links in one place</p>
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          {links.map((l) => (
            <div key={l.name} className={`bg-gradient-to-br ${l.color} rounded-xl p-5 text-white shadow-md hover:scale-[1.02] transition cursor-pointer`}>
              <div className="text-3xl mb-2">{l.emoji}</div>
              <div className="font-bold">{l.name}</div>
              <div className="text-xs opacity-80 mt-0.5">{l.url}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== Photos App ==================== */
function PhotosApp() {
  const [view, setView] = useState<"library" | "favorites">("library");

  const gradients = [
    "from-rose-400 to-rose-700",
    "from-orange-300 to-amber-500",
    "from-amber-400 to-yellow-600",
    "from-yellow-300 to-orange-400",
    "from-lime-300 to-green-500",
    "from-emerald-400 to-teal-600",
    "from-teal-300 to-cyan-500",
    "from-sky-400 to-blue-600",
    "from-blue-500 to-indigo-700",
    "from-indigo-400 to-purple-600",
    "from-purple-500 to-fuchsia-600",
    "from-fuchsia-400 to-pink-600",
    "from-pink-300 to-rose-400",
    "from-stone-400 to-stone-700",
    "from-zinc-500 to-zinc-800",
    "from-amber-700 to-stone-900",
    "from-rose-300 to-orange-400",
    "from-cyan-300 to-blue-400",
    "from-violet-400 to-indigo-600",
    "from-emerald-300 to-cyan-500",
    "from-orange-400 to-red-600",
    "from-yellow-400 to-amber-600",
    "from-blue-300 to-purple-500",
    "from-pink-400 to-fuchsia-600",
    "from-green-500 to-emerald-700",
  ];

  const favoriteIndices = [0, 4, 7, 10, 13, 18, 22];
  const tiles = view === "library" ? gradients : favoriteIndices.map((i) => gradients[i]);

  const isLibrary = view === "library";

  return (
    <div className="flex h-full bg-[#1c1c1e] text-gray-200 font-sans" style={{ fontSize: 13 }}>
      <aside className="w-56 bg-[#2a2a2c] border-r border-black/40 p-3 flex flex-col gap-0.5 flex-shrink-0">
        <div className="text-[11px] text-gray-500 px-2 mt-1 mb-1 font-semibold tracking-[0.06em]">LIBRARY</div>
        <button
          onClick={() => setView("library")}
          className={`px-2 py-[5px] rounded-[6px] flex items-center gap-2.5 text-left transition-colors ${
            isLibrary ? "bg-[#3a82f6]/20" : "hover:bg-white/5"
          }`}
        >
          <PhotosLibraryIcon active={isLibrary} />
          <span className={isLibrary ? "text-[#5ea7ff] font-medium" : "text-gray-200"}>Library</span>
        </button>
        <button
          onClick={() => setView("favorites")}
          className={`px-2 py-[5px] rounded-[6px] flex items-center gap-2.5 text-left transition-colors ${
            !isLibrary ? "bg-[#3a82f6]/20" : "hover:bg-white/5"
          }`}
        >
          <PhotosHeartIcon active={!isLibrary} />
          <span className={!isLibrary ? "text-[#5ea7ff] font-medium" : "text-gray-200"}>Favorites</span>
        </button>
      </aside>

      <div className="flex-1 flex flex-col bg-[#1c1c1e] overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-4 pb-3 flex-shrink-0">
          <div>
            <h1 className="text-[22px] font-bold text-white leading-tight tracking-tight">
              {isLibrary ? "Library" : "Favorites"}
            </h1>
            <p className="text-[11px] text-gray-400 mt-1">
              {isLibrary ? "Nov 19, 2022 - Apr 29, 2026" : `${tiles.length} Photos`}
            </p>
          </div>
          {isLibrary && (
            <div className="flex items-center gap-0.5 bg-[#2a2a2c] rounded-md p-0.5 text-[12px]">
              <button className="px-3 py-1 rounded text-gray-300 hover:text-white">Years</button>
              <button className="px-3 py-1 rounded text-gray-300 hover:text-white">Months</button>
              <button className="px-3 py-1 rounded bg-white/15 text-white font-medium">All Photos</button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="grid grid-cols-5 gap-0.5">
            {tiles.map((g, i) => (
              <div key={i} className={`aspect-square bg-gradient-to-br ${g} hover:opacity-90 transition cursor-pointer`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotosLibraryIcon({ active }: { active: boolean }) {
  const fill = active ? "#5ea7ff" : "#9ca3af";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="2" width="11" height="9" rx="1.5" fill={fill} opacity="0.55"/>
      <rect x="2" y="4" width="11" height="10" rx="1.5" fill={fill}/>
    </svg>
  );
}

function PhotosHeartIcon({ active }: { active: boolean }) {
  const stroke = active ? "#5ea7ff" : "#d1d5db";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? "#5ea7ff" : "none"} stroke={stroke} strokeWidth="1.4">
      <path d="M8 13.5s-5-3.2-5-7a3 3 0 015-2.2A3 3 0 0113 6.5c0 3.8-5 7-5 7z"/>
    </svg>
  );
}

/* ==================== Finder App ==================== */
function FinderApp() {
  const projects = [
    { name: "Finnie", desc: "scholarship search tool helping students afford college", url: "https://findmescholarships.com" },
    { name: "Workout Wizard", desc: "fitness companion that builds personalized workout plans", url: "#" },
    { name: "Blackjack Jackpot Cards", desc: "iOS card game shipped to the App Store, hand-coded pre-AI", url: "#" },
  ];
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<"open" | "trash" | "info" | null>(null);

  return (
    <div className="flex h-full text-[13px]">
      <aside className="w-48 bg-[#ebe8e6] border-r border-black/5 p-2">
        <div className="text-[10px] text-gray-500 px-2 mb-1 mt-1 font-semibold tracking-wide">FAVORITES</div>
        <div className="px-2 py-1 rounded-md flex items-center gap-2 text-gray-800">📁 Desktop</div>
        <div className="px-2 py-1 rounded-md flex items-center gap-2 text-gray-800">📄 Documents</div>
        <div className="px-2 py-1 rounded-md bg-blue-500 text-white flex items-center gap-2 mt-0.5">📂 Projects</div>
        <div className="px-2 py-1 rounded-md flex items-center gap-2 text-gray-800 mt-0.5">⬇ Downloads</div>
      </aside>
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        <div className="text-xs text-gray-500 mb-4">Projects</div>
        <div className="grid grid-cols-3 gap-6">
          {projects.map((p, idx) => (
            <div
              key={p.name}
              className="relative flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => { setHoveredIdx(null); setHoveredItem(null); }}
            >
              <div className="w-28 h-24 overflow-hidden flex items-start justify-center">
                <img
                  src="/folder-new.png"
                  alt=""
                  className="w-28 h-auto object-cover object-top"
                  style={{ aspectRatio: "1 / 1" }}
                  draggable={false}
                />
              </div>
              <div className="text-[13px] text-gray-800 text-center">{p.name}</div>

              {hoveredIdx === idx && (
                <div
                  className="absolute left-1/2 top-full mt-1 -translate-x-1/2 z-20 rounded-lg py-1.5 min-w-[260px] text-[14px] text-white"
                  style={{
                    background: "rgba(30, 30, 32, 0.92)",
                    backdropFilter: "blur(30px) saturate(180%)",
                    WebkitBackdropFilter: "blur(30px) saturate(180%)",
                    boxShadow: "0 0 0 0.5px rgba(255,255,255,0.08), 0 12px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  <button
                    onClick={() => { if (p.url !== "#") window.open(p.url, "_blank", "noopener,noreferrer"); }}
                    onMouseEnter={() => setHoveredItem("open")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full text-left px-4 py-1.5 ${hoveredItem === "open" ? "bg-[#0a84ff] text-white" : ""}`}
                  >
                    Open in New Tab
                  </button>
                  <div className="h-px mx-3 my-1 bg-white/12" />
                  <button
                    onMouseEnter={() => setHoveredItem("trash")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full text-left px-4 py-1.5 ${hoveredItem === "trash" ? "bg-[#0a84ff] text-white" : ""}`}
                  >
                    Move to Trash
                  </button>
                  <div className="h-px mx-3 my-1 bg-white/12" />
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredItem("info")}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className={`px-4 py-1.5 ${hoveredItem === "info" ? "bg-[#0a84ff] text-white" : ""}`}>
                      Get Info
                    </div>
                    {hoveredItem === "info" && (
                      <div
                        className="absolute left-full top-0 ml-1 rounded-lg py-2.5 px-3.5 w-64 text-[12px] leading-snug text-white"
                        style={{
                          background: "rgba(30, 30, 32, 0.95)",
                          backdropFilter: "blur(30px) saturate(180%)",
                          WebkitBackdropFilter: "blur(30px) saturate(180%)",
                          boxShadow: "0 0 0 0.5px rgba(255,255,255,0.08), 0 12px 32px rgba(0,0,0,0.5)",
                        }}
                      >
                        <div className="font-semibold mb-1 text-[13px]">{p.name}</div>
                        <div className="text-white/80">{p.desc}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== Spotify App ==================== */
type Song = {
  t: string;
  a: string;
  al: string;
  added: string;
  d: string;
  e?: boolean;
  mv?: boolean;
  cover: string; // gradient fallback
  spotify?: string; // for cover-art fetch only
};

function SpotifyApp() {
  const [covers, setCovers] = useState<Record<string, string>>({});

  const songs: Song[] = [
    { t: "Over My Dead Body", a: "Drake", al: "Take Care (Deluxe)", added: "3 weeks ago", d: "4:33", e: true, cover: "from-amber-700 to-stone-900" },
    { t: "i need u", a: "Ken Carson", al: "A Great Chaos", added: "3 weeks ago", d: "2:29", e: true, cover: "from-zinc-700 to-zinc-900" },
    { t: "What Did I Miss?", a: "Drake", al: "What Did I Miss?", added: "3 weeks ago", d: "3:14", e: true, cover: "from-sky-300 to-blue-500", spotify: "57GsLpRtEtrzcPGPop20rS" },
    { t: "Myron", a: "Lil Uzi Vert", al: "Eternal Atake (Deluxe) - LUV vs. The W...", added: "3 weeks ago", d: "3:45", e: true, cover: "from-purple-700 to-indigo-900", spotify: "56uXDJRCuoS7abX3SkzHKQ" },
    { t: "beibs in the trap", a: "Travis Scott", al: "Birds In The Trap Sing McKnight", added: "3 weeks ago", d: "3:34", e: true, mv: true, cover: "from-stone-600 to-stone-900", spotify: "0ESJlaM8CE1jRWaNtwSNj8" },
    { t: "Rock N Roll", a: "Ken Carson", al: "Project X", added: "3 weeks ago", d: "2:29", e: true, cover: "from-green-600 to-green-900", spotify: "7sdHMJvhKib3ReVPsZFbrf" },
    { t: "Hours In Silence", a: "Drake, 21 Savage", al: "Her Loss", added: "3 weeks ago", d: "6:39", e: true, cover: "from-amber-200 to-amber-400" },
    { t: "on one tonight", a: "Gunna", al: "One of Wun", added: "3 weeks ago", d: "1:31", e: true, cover: "from-blue-500 to-indigo-700", spotify: "6EUcP55GlbmsmCzfL2vxtZ" },
    { t: "Over", a: "Playboi Carti", al: "Whole Lotta Red", added: "3 weeks ago", d: "2:46", e: true, cover: "from-red-700 to-black", spotify: "08dz3ygXyFur6bL7Au8u8J" },
    { t: "Stereo Love", a: "Edward Maya, Vika Jigulina", al: "Stereo Love", added: "3 weeks ago", d: "3:05", mv: true, cover: "from-rose-400 to-purple-700", spotify: "11Iv8RCFmeImLOpaHYxKb4" },
    { t: "Back Home", a: "Yeat, Joji", al: "ADL", added: "3 weeks ago", d: "3:14", e: true, cover: "from-stone-400 to-stone-700" },
    { t: "Liv Likë Dis", a: "Yeat", al: "ADL", added: "1 week ago", d: "2:41", e: true, cover: "from-stone-400 to-stone-700" },
    { t: "Let King Tonka Talk", a: "Yeat, King Kylie", al: "ADL", added: "1 week ago", d: "3:02", e: true, cover: "from-stone-400 to-stone-700" },
    { t: "Real Life Shit", a: "Yeat", al: "ADL", added: "1 week ago", d: "3:13", e: true, cover: "from-stone-400 to-stone-700" },
    { t: "Griddlë", a: "Yeat, Don Toliver", al: "ADL", added: "1 week ago", d: "2:37", e: true, cover: "from-stone-400 to-stone-700" },
    { t: "Poker Face", a: "Lady Gaga", al: "The Fame", added: "1 week ago", d: "3:57", cover: "from-pink-400 to-pink-700" },
  ];

  const playingIndex = 3; // Myron
  const playing = songs[playingIndex];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      await Promise.all(
        songs.map(async (s) => {
          // Use spotify ID if present (key by ID); else use "title|artist" key
          const key = s.spotify ?? `${s.t}|${s.a}`;
          try {
            if (s.spotify) {
              const res = await fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${s.spotify}`);
              if (res.ok) {
                const data = await res.json();
                if (data.thumbnail_url) {
                  next[key] = data.thumbnail_url;
                  return;
                }
              }
            }
            // Fallback: iTunes Search API (no auth, returns artwork URLs)
            const term = encodeURIComponent(`${s.t} ${s.a}`);
            const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=1`);
            if (!res.ok) return;
            const data = await res.json();
            const artwork = data?.results?.[0]?.artworkUrl100 as string | undefined;
            if (artwork) {
              // bump resolution: 100x100 → 300x300
              next[key] = artwork.replace("100x100bb", "300x300bb");
            }
          } catch {
            // network/CORS — gradient fallback
          }
        })
      );
      if (!cancelled) setCovers((prev) => ({ ...prev, ...next }));
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Decorative library thumbnails — visual only, not a real list
  const libraryThumbs = [
    { kind: "liked", c: "from-indigo-400 via-purple-500 to-blue-600" },
    { kind: "bookmark", c: "from-emerald-700 to-emerald-900" },
    { kind: "april", c: "from-amber-700 to-orange-900" },
    { kind: "note", c: "from-zinc-700 to-zinc-900" },
    { kind: "dj", c: "from-teal-400 to-cyan-700" },
    { kind: "photo", c: "from-rose-300 to-pink-500" },
    { kind: "date", c: "from-zinc-200 to-zinc-400" },
    { kind: "album", c: "from-red-800 to-stone-900" },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-black text-gray-100 text-[13px]">
      {/* Top toolbar */}
      <div className="h-14 bg-black flex items-center px-3 gap-3 flex-shrink-0">
        <div className="flex items-center gap-1 ml-2">
          <button className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 text-gray-300 flex items-center justify-center">‹</button>
          <button className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 text-gray-500 flex items-center justify-center">›</button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 max-w-2xl w-full">
            <button className="w-12 h-12 rounded-full bg-[#1f1f1f] hover:bg-[#2a2a2a] flex items-center justify-center text-gray-200">
              <HomeSvg/>
            </button>
            <div className="flex-1 h-12 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-full flex items-center px-4 gap-3">
              <SearchSvg/>
              <span className="text-gray-400 text-sm">What do you want to play?</span>
              <div className="ml-auto flex items-center gap-3 text-gray-400">
                <div className="w-px h-6 bg-white/15"/>
                <BrowseSvg/>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mr-2">
          <button className="text-gray-400 hover:text-white"><BellSvg/></button>
          <button className="text-gray-400 hover:text-white"><FriendsSvg/></button>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 ring-[3px] ring-black overflow-hidden">
              <img src="/icons/profile.png" alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}/>
            </div>
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-black"/>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-2 px-2 pb-2">
        {/* Thin sidebar */}
        <aside className="w-[72px] bg-[#121212] rounded-lg flex flex-col items-center py-3 gap-3 flex-shrink-0">
          <button className="text-gray-300 hover:text-white"><SidebarSvg/></button>
          <button className="w-9 h-9 rounded-full bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 flex items-center justify-center text-xl">+</button>
          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-3 mt-1">
            {libraryThumbs.map((t, i) => (
              <div key={i} className={`w-12 h-12 rounded-md bg-gradient-to-br ${t.c} flex items-center justify-center text-white shadow flex-shrink-0`}>
                {t.kind === "liked" && <span>♥</span>}
                {t.kind === "bookmark" && <span>🔖</span>}
                {t.kind === "note" && <span>♪</span>}
                {t.kind === "dj" && <span className="text-[9px] font-bold">DJ</span>}
                {t.kind === "date" && <div className="text-center"><div className="text-[8px] font-semibold text-gray-700 leading-none">Aug</div><div className="text-sm font-bold text-gray-800 leading-none">13</div></div>}
              </div>
            ))}
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-600 to-stone-800 ring-2 ring-[#121212]"/>
        </aside>

        {/* Main scroll area */}
        <div className="flex-1 bg-gradient-to-b from-[#7a4524] via-[#3a2418] to-[#121212] overflow-y-auto rounded-lg">
          {/* Header */}
          <div className="flex items-end gap-5 p-6 pb-5">
            <div className="w-52 h-52 bg-gradient-to-br from-amber-600 via-orange-700 to-stone-800 shadow-2xl flex items-center justify-center text-7xl rounded-sm flex-shrink-0">
              🥤
            </div>
            <div className="pb-2">
              <div className="text-xs font-semibold">Public Playlist</div>
              <div className="text-[6.5rem] font-black leading-[0.95] mt-2 mb-5 tracking-tight">April 🥹</div>
              <div className="text-xs text-gray-200 flex items-center gap-2">
                <button className="w-5 h-5 rounded-full border border-gray-300 text-gray-300 flex items-center justify-center text-[11px]">+</button>
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-700 to-stone-800 inline-block"/>
                <span className="font-bold text-white">fatimah</span>
                <span className="font-bold">·</span>
                <span>36 songs, 2 hr 7 min</span>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="px-6 py-3 flex items-center gap-5">
            <button className="w-14 h-14 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 transition flex items-center justify-center text-black shadow-lg">
              <span className="text-xl ml-0.5">▶</span>
            </button>
            <div className="w-12 h-12 rounded bg-gradient-to-br from-amber-700 to-stone-900 border border-white/20"/>
            <button className="text-3xl text-[#1ed760] hover:scale-110 transition">⇄</button>
            <button className="text-2xl text-gray-300 hover:text-white">
              <DownloadSvg/>
            </button>
            <button className="text-2xl text-gray-300 hover:text-white"><AddUserSvg/></button>
            <button className="px-4 py-1.5 rounded-full border border-gray-500 text-gray-200 text-sm flex items-center gap-1.5 hover:border-white">
              <span className="text-xs">⇅</span> Mix
            </button>
            <button className="text-2xl text-gray-300 hover:text-white">⋯</button>
            <div className="ml-auto flex items-center gap-3 text-gray-300">
              <button className="hover:text-white"><SearchSvg/></button>
              <span className="text-sm">Custom order</span>
              <span>≡</span>
            </div>
          </div>

          {/* Track table */}
          <div className="px-6">
            <div className="grid grid-cols-[2.5rem_minmax(0,3fr)_minmax(0,2fr)_minmax(0,1.4fr)_4rem] gap-3 px-3 py-2 text-[12px] text-gray-400 border-b border-white/10">
              <div className="text-right pr-2">#</div>
              <div>Title</div>
              <div>Album</div>
              <div>Date added</div>
              <div className="text-right">⏱</div>
            </div>
            {songs.map((s, i) => {
              const isPlaying = i === playingIndex;
              return (
                <div
                  key={i}
                  className="grid grid-cols-[2.5rem_minmax(0,3fr)_minmax(0,2fr)_minmax(0,1.4fr)_4rem] gap-3 px-3 py-2 rounded group hover:bg-white/10"
                >
                  <div className={`self-center text-right pr-2 ${isPlaying ? "text-[#1ed760]" : "text-gray-400"}`}>{i + 1}</div>
                  <div className="flex items-center gap-3 min-w-0">
                    {(() => {
                      const key = s.spotify ?? `${s.t}|${s.a}`;
                      return covers[key] ? (
                        <img src={covers[key]} alt="" className="w-10 h-10 rounded flex-shrink-0 object-cover"/>
                      ) : (
                        <div className={`w-10 h-10 rounded bg-gradient-to-br ${s.cover} flex-shrink-0`}/>
                      );
                    })()}
                    <div className="min-w-0">
                      <div className={`font-medium truncate ${isPlaying ? "text-[#1ed760]" : "text-white"}`}>{s.t}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
                        {s.e && <span className="text-[9px] font-bold bg-white/15 text-gray-300 rounded px-1 py-0.5 leading-none">E</span>}
                        {s.mv && <span className="text-[10px] text-gray-300 flex items-center gap-0.5"><span className="border border-gray-400 rounded text-[8px] px-0.5 leading-none">▶</span> Music video</span>}
                        {s.mv ? <span>· {s.a}</span> : <span>{s.a}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 self-center truncate">{s.al}</div>
                  <div className="text-gray-400 self-center">{s.added}</div>
                  <div className="self-center text-right text-gray-400">{s.d}</div>
                </div>
              );
            })}
            <div className="h-6"/>
          </div>
        </div>
      </div>

      {/* Now-playing bar */}
      <div className="h-[72px] bg-black flex items-center px-3 gap-3 flex-shrink-0">
        <div className="flex items-center gap-3 w-1/4 min-w-0">
          {(() => {
            const key = playing.spotify ?? `${playing.t}|${playing.a}`;
            return covers[key] ? (
              <img src={covers[key]} alt="" className="w-14 h-14 rounded flex-shrink-0 object-cover"/>
            ) : (
              <div className={`w-14 h-14 rounded bg-gradient-to-br ${playing.cover} flex-shrink-0`}/>
            );
          })()}
          <div className="min-w-0">
            <div className="font-medium text-white text-[14px] truncate">{playing.t}</div>
            <div className="text-[12px] text-gray-400 truncate">{playing.a}</div>
          </div>
          <span className="w-5 h-5 rounded-full bg-[#1ed760] text-black text-xs flex items-center justify-center flex-shrink-0">✓</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5 text-gray-300">
            <span className="text-[#1ed760]">⇄</span>
            <span className="text-xl">⏮</span>
            <button className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm">▶</button>
            <span className="text-xl">⏭</span>
            <span>⟲</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 w-full max-w-2xl">
            <span>0:01</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: "0.4%" }}/>
            </div>
            <span>3:44</span>
          </div>
        </div>
        <div className="w-1/4 flex items-center justify-end gap-3 text-gray-400">
          <span>📝</span>
          <span>≡</span>
          <span>📱</span>
          <span>🔊</span>
          <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-3/4"/>
          </div>
          <span className="ml-2">⛶</span>
          <span>⛶</span>
        </div>
      </div>
    </div>
  );
}

/* Inline SVGs for Spotify toolbar */
function HomeSvg() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-2v9h-5v-6h-4v6H5v-9H3z"/></svg>);
}
function SearchSvg() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>);
}
function BrowseSvg() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg>);
}
function BellSvg() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 1112 0c0 4.5 1.5 5.5 2 6H4c.5-.5 2-1.5 2-6z"/><path d="M10 19.5a2 2 0 004 0"/></svg>);
}
function FriendsSvg() {
  return (<svg width="24" height="22" viewBox="0 0 26 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="6.5" r="3.2"/><circle cx="6" cy="8" r="2.4"/><circle cx="20" cy="8" r="2.4"/><path d="M7 19.5c0-3 2.7-5.2 6-5.2s6 2.2 6 5.2"/><path d="M2 18.5c0-2.4 1.5-4 4-4"/><path d="M24 18.5c0-2.4-1.5-4-4-4"/></svg>);
}
function SidebarSvg() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="3" height="16"/><rect x="11" y="4" width="3" height="16"/><rect x="18" y="4" width="3" height="16"/></svg>);
}
function DownloadSvg() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 7v8m-3-3l3 3 3-3"/></svg>);
}
function AddUserSvg() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="9" r="3.5"/><path d="M4 19c0-3 3-5 7-5s7 2 7 5v1H4v-1z"/><path d="M19 5v6m-3-3h6" stroke="currentColor" strokeWidth="2" fill="none"/></svg>);
}

/* ==================== Desktop Icons ==================== */
function DesktopIcons({ onOpen }: { onOpen: (id: AppId) => void }) {
  const items = ["Documents", "Downloads", "Screenshots"];
  return (
    <div className="absolute top-10 right-4 flex flex-col gap-3 z-0">
      {items.map((name) => (
        <button
          key={name}
          onDoubleClick={() => onOpen("finder")}
          onClick={() => onOpen("finder")}
          className="flex flex-col items-center gap-1 w-20 group"
          title={`Open ${name}`}
        >
          <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition">
            <DesktopFolderIcon />
          </div>
          <div
            className="text-[12px] text-white px-1.5 py-0.5 rounded leading-tight text-center group-hover:bg-blue-500/50"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
              textShadow: "0 1px 2px rgba(0,0,0,0.85)",
              letterSpacing: "-0.01em",
            }}
          >
            {name}
          </div>
        </button>
      ))}
    </div>
  );
}

function DesktopFolderIcon() {
  return <img src="/folder.webp" alt="" className="w-12 h-12 object-contain drop-shadow-md" draggable={false} />;
}

/* ==================== Dock ==================== */
function Dock({ onOpen, openIds }: { onOpen: (id: AppId) => void; openIds: AppId[] }) {
  const apps: { id: AppId; Icon: React.FC }[] = [
    { id: "finder", Icon: FinderIcon },
    { id: "notes", Icon: NotesIcon },
    { id: "spotify", Icon: SpotifyIcon },
    { id: "photos", Icon: PhotosIcon },
  ];
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-dock rounded-2xl px-3 py-2 flex items-end gap-2 border border-white/40 shadow-2xl">
        {apps.map(({ id, Icon }) => {
          const isOpen = openIds.includes(id);
          return (
            <button key={id} onClick={() => onOpen(id)} className="relative flex flex-col items-center" aria-label={APP_TITLES[id]}>
              <div className="w-14 h-14 icon-shadow">
                <Icon />
              </div>
              <div className={`w-1 h-1 rounded-full mt-1 ${isOpen ? "bg-white/80" : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ==================== Real-ish app icons (SVG) ==================== */
function FinderIcon() {
  return <img src="/icons/finder.png" alt="Finder" className="w-full h-full" draggable={false} />;
}

function NotesIcon() {
  return <img src="/icons/notes.webp" alt="Notes" className="w-full h-full" draggable={false} />;
}

function SpotifyIcon() {
  return <img src="/icons/spotify.png" alt="Spotify" className="w-full h-full" draggable={false} />;
}

function PhotosIcon() {
  return <img src="/icons/photos.webp" alt="Photos" className="w-full h-full" draggable={false} />;
}
