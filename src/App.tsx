import { useState, useRef, useEffect, type ReactNode } from "react";
import { PartnerWordmark, type PartnerId } from "./partnerWordmarks";
import { SpotifyApp } from "./spotifyApp";
import { answerQuestion, FALLBACK_ANSWER, TERMINAL_INTRO } from "./bio";

type AppId = "notes" | "spotify" | "photos" | "bear" | "safari" | "settings" | "terminal";

type WindowState = {
  id: AppId;
  x: number;
  y: number;
  z: number;
};

const APP_TITLES: Record<AppId, string> = {
  notes: "Notes",
  spotify: "Spotify",
  photos: "Photos",
  bear: "Projects",
  safari: "Safari",
  settings: "System Settings",
  terminal: "Terminal",
};

type Theme = "light" | "dark";

type Wallpaper = { id: string; name: string; value: string };
const WALLPAPERS: Wallpaper[] = [
  { id: "sonoma-horizon", name: "Sonoma Horizon", value: 'url("/wallpapers/sonoma-horizon.jpg")' },
  { id: "sonoma", name: "Sonoma", value: 'url("/wallpapers/sonoma.jpg")' },
  { id: "ventura", name: "Ventura", value: 'url("/wallpapers/ventura.jpg")' },
  { id: "monterey", name: "Monterey", value: 'url("/wallpapers/monterey.jpg")' },
  { id: "sierra", name: "Sierra", value: 'url("/wallpapers/sierra.jpg")' },
];

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
  const [wallpaper, setWallpaper] = useState<string>(() => {
    if (typeof window === "undefined") return WALLPAPERS[0].value;
    return window.localStorage.getItem("wallpaper") ?? WALLPAPERS[0].value;
  });

  const changeWallpaper = (value: string) => {
    setWallpaper(value);
    window.localStorage.setItem("wallpaper", value);
  };

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
    <div
      className={`wallpaper relative w-full h-full overflow-hidden select-none ${theme === "dark" ? "dark" : ""}`}
      style={{ backgroundImage: wallpaper }}
    >
      <MenuBar appName={APP_TITLES[activeApp]} now={now} theme={theme} onToggleTheme={toggleTheme} />

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
          {w.id === "spotify" && <SpotifyApp />}
          {w.id === "settings" && (
            <SettingsApp
              theme={theme}
              onToggleTheme={toggleTheme}
              wallpaper={wallpaper}
              onChangeWallpaper={changeWallpaper}
            />
          )}
          {w.id === "terminal" && <TerminalApp />}
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

  const isTerminal = state.id === "terminal";
  const title = isTerminal ? "fatimah — -zsh — 80×24" : APP_TITLES[state.id];

  return (
    <div
      className="window-open absolute window-shadow rounded-xl overflow-hidden"
      style={{ left: state.x, top: state.y, zIndex: state.z, width: 880, height: 580 }}
      onMouseDown={onFocus}
    >
      <div
        className="relative h-7 bg-[#e5e2e0]/95 dark:bg-[#2a2a2a]/95 flex items-center px-3 cursor-grab active:cursor-grabbing border-b border-black/10 dark:border-white/10"
        onMouseDown={onMouseDown}
      >
        <div className="flex gap-1.5 group z-10">
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
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5">
          {isTerminal && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#54a3ff" aria-hidden>
              <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.05c.4 0 .78.16 1.06.44L11 6.85h8.5A1.5 1.5 0 0 1 21 8.35v9.15A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z"/>
            </svg>
          )}
          <span className="text-[12px] font-semibold tracking-tight text-black/60 dark:text-white/70 select-none truncate max-w-[70%]">{title}</span>
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
    { id: "projects", emoji: "📚", title: "things i've worked on", date: shortDate, preview: "things i've built and shipped", group: "today", body: "projects" },
    { id: "press", emoji: "📰", title: "press", date: shortDate, preview: "features, articles, mentions", group: "today", body: "press" },
    { id: "brands", emoji: "🤝", title: "companies i've partnered up with", date: shortDate, preview: "tech, consumer goods, education", group: "today", body: "brands" },
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
  const link = "notes-link underline";

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
            className="w-60 aspect-square object-cover rounded-xl shadow-md"
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
          url="https://www.fastcompany.com/91539141/students-receive-10000-prizes-from-openai-for-innovative-use-of-ai"
          title="OpenAI awards students $10,000 prizes for innovative use of AI"
          description="Fast Company covered OpenAI's ChatGPT Futures program, highlighting the students and young builders receiving $10,000 grants for using AI to build ambitious projects."
          source="fastcompany.com"
          date="May 2026"
          image="/press-fastcompany-openai-prize.png"
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
          url="https://thewildcattribune.com/17839/news/learning-by-doing-how-fatimah-hussain-journeyed-through-her-1st-3d-printing-business/"
          title="Learning by Doing: How Fatimah Hussain Journeyed Through her 1st 3D Printing Business"
          description="Profile in The Wildcat Tribune on starting Unicorn Lock — a child-safe lock business — and the lessons of consistency, failure, and impact across four early ventures."
          source="thewildcattribune.com"
          date="Oct 10, 2023"
          image="/press-wildcat-tribune.jpg"
        />
        <LinkPreviewCard
          url="https://www.instagram.com/p/CnSzjKdPKtr/"
          title="2022 San Ramon Outstanding Teen Citizenship Award"
          description="Honored by the City of San Ramon Parks & Community Services with the Outstanding Teen Citizenship Award for community service and leadership."
          source="instagram.com"
          date="2022"
          image="/press-citizenship-award.png"
        />

      </>
    );
  }
  if (body === "projects") {
    const projects = [
      {
        name: "Finnie",
        description: "a scholarship search tool helping students afford college through simpler, less overwhelming discovery",
        url: "https://findmescholarships.com",
      },
      {
        name: "Workout Wizard",
        description: "a fitness companion that builds personalized workout plans",
        url: "#",
      },
      {
        name: "Blackjack Jackpot Cards",
        description: "an iOS card game shipped to the App Store, hand-coded pre-AI tools",
        url: "#",
      },
      {
        name: "Stan store",
        description: "templates + resources for students and creators",
        url: "https://stan.store/fatimahsguide",
      },
    ];

    return (
      <>
        <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📚</span>
          <h1 className="text-[22px] font-bold text-gray-900 leading-none">things i've worked on</h1>
        </div>
        <p className="text-gray-700 mb-6">things i've built and shipped</p>

        <ul className="space-y-2 text-gray-800 list-disc pl-6 leading-relaxed">
          {projects.map((project) => (
            <li key={project.name}>
              {project.url === "#" ? (
                <span className={link}>{project.name}</span>
              ) : (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={link}>
                  {project.name}
                </a>
              )}{" "}
              — {project.description}
            </li>
          ))}
          <li>
            <span className={link}>more coming soon...</span>
          </li>
        </ul>
      </>
    );
  }
  if (body === "brands") {
    const sections: { title: string; partners: PartnerId[] }[] = [
      { title: "Tech", partners: ["microsoft", "openai", "adobe", "notion", "lovable", "quillbot", "jobright", "soundcore", "whop"] },
      { title: "Consumer Goods", partners: ["clorox", "good-culture", "chiquita", "maruchan", "extra-gum", "zevo"] },
      { title: "Education", partners: ["five-star", "lumiere-education", "aceable", "calkids", "abe"] },
      { title: "Finance", partners: ["webull", "kraken"] },
    ];
    return (
      <>
        <div className="text-center text-[11px] text-gray-400 mb-5">{longDate}</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🤝</span>
          <h1 className="text-[22px] font-bold text-gray-900 leading-none">companies i've partnered up with</h1>
        </div>
        <p className="text-gray-700 mb-7">a running list, organized by category</p>

        <div className="space-y-7 max-w-lg">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em] mb-2.5">{s.title}</h2>
              <div className="flex flex-wrap gap-2">
                {s.partners.map((p) => (
                  <PartnerWordmark key={p} id={p} />
                ))}
              </div>
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
          <li><a href="https://www.instagram.com/fatimahs.guide" target="_blank" rel="noopener noreferrer" className={link}>instagram</a> (197k)</li>
          <li><a href="https://twitter.com/fatimahs_tech" target="_blank" rel="noopener noreferrer" className={link}>twitter</a></li>
          <li><a href="https://www.tiktok.com/@fatimahs.guide" target="_blank" rel="noopener noreferrer" className={link}>tiktok</a> (45k)</li>
          <li><a href="mailto:fatimahhussain@berkeley.edu" className={link}>email</a></li>
          <li><a href="https://www.linkedin.com/in/fatimah-hussain/" target="_blank" rel="noopener noreferrer" className={link}>linkedin</a> (20k)</li>
          <li><a href="https://www.instagram.com/fatim4hhussain" target="_blank" rel="noopener noreferrer" className={link}>personal instagram</a></li>
          <li><a href="https://stan.store/fatimahsguide" target="_blank" rel="noopener noreferrer" className={link}>stan store</a> — templates + resources for high school & college students, all in one hub</li>
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
          <li>currently in NYC — typically splitting my summers between SF and New York City</li>
          <li>building more edtech tools to help students, and working with some cool companies</li>
          <li>building out <a href="https://findmescholarships.com" target="_blank" rel="noopener noreferrer" className={link}>finnie</a>'s scholarship tool — recently won the <a href="https://chatgpt.com/futures/#finnie" target="_blank" rel="noopener noreferrer" className={link}>ChatGPT Futures grant</a></li>
          <li>building out a mentorship program through <a href="https://www.instagram.com/fatimahs.guide" target="_blank" rel="noopener noreferrer" className={link}>Fatimah's guide</a></li>
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
// Every photo lives in src/assets/photos/library/ (auto-discovered, sorted by
// filename). The Library tab shows them all; the Views & Travel and People tabs
// show subsets, tagged by filename below. Drop a new image into library/ to add
// it everywhere; add its name to a set below to tag it. See the README there.
type Photo = { name: string; url: string };

function loadPhotos(modules: Record<string, unknown>): Photo[] {
  return Object.entries(modules)
    .map(([path, url]) => ({ name: path.split("/").pop() ?? path, url: url as string }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const libraryPhotos = loadPhotos(
  import.meta.glob("./assets/photos/library/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

// Tags — which library photos appear under each album tab.
const TRAVEL_PHOTOS = new Set([
  "photo-02.jpg", "photo-03.jpg", "photo-05.jpg", "photo-13.jpg", "photo-21.jpg",
  "photo-23.jpg", "photo-24.jpg", "photo-26.jpg", "photo-28.jpg", "photo-29.jpg",
  "photo-30.jpg", "photo-31.jpg", "photo-34.jpg", "photo-35.jpg", "photo-39.jpg",
  "photo-42.jpg", "photo-45.jpg", "photo-52.jpg",
]);
const PEOPLE_PHOTOS = new Set([
  "photo-01.jpg", "photo-04.jpg", "photo-06.jpg", "photo-07.jpg", "photo-08.jpg",
  "photo-09.jpg", "photo-10.jpg", "photo-11.jpg", "photo-12.jpg", "photo-14.jpg",
  "photo-15.jpg", "photo-16.jpg", "photo-17.jpg", "photo-18.jpg", "photo-19.jpg",
  "photo-20.jpg", "photo-22.jpg", "photo-25.jpg", "photo-27.jpg", "photo-32.jpg",
  "photo-33.jpg", "photo-36.jpg", "photo-37.jpg", "photo-38.jpg", "photo-40.jpg",
  "photo-41.jpg", "photo-43.jpg", "photo-44.jpg", "photo-48.jpg", "photo-49.jpg",
  "photo-50.jpg", "photo-51.jpg", "photo-53.jpg",
]);
// A few favorites for the Favorites tab.
const FAVORITE_PHOTOS = new Set([
  "photo-05.jpg", "photo-21.jpg", "photo-24.jpg", "photo-31.jpg",
  "photo-28.jpg", "photo-17.jpg", "photo-26.jpg", "photo-35.jpg", "photo-37.jpg",
  "photo-45.jpg",
]);

const travelPhotos = libraryPhotos.filter((p) => TRAVEL_PHOTOS.has(p.name));
const peoplePhotos = libraryPhotos.filter((p) => PEOPLE_PHOTOS.has(p.name));

type PhotosView = "library" | "favorites" | "travel" | "people";

function PhotosApp() {
  const [view, setView] = useState<PhotosView>("library");
  // Which photo (index into the current view's list) is open in the detail view.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // Favorites are interactive — toggled from the detail view, reflected in the Favorites tab.
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(FAVORITE_PHOTOS));

  const isLibrary = view === "library";
  const isFavorites = view === "favorites";

  const albumTabs: { id: PhotosView; label: string }[] = [
    { id: "travel", label: "Views & Travel" },
    { id: "people", label: "People" },
  ];

  const photosByView: Record<PhotosView, Photo[]> = {
    library: libraryPhotos,
    favorites: libraryPhotos.filter((p) => favorites.has(p.name)),
    travel: travelPhotos,
    people: peoplePhotos,
  };
  const photos = photosByView[view];

  const TITLES: Record<PhotosView, string> = {
    library: "Library",
    favorites: "Favorites",
    travel: "Views & Travel",
    people: "People",
  };

  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const subtitle = isLibrary
    ? `Jan 2025 - ${todayLabel}`
    : `${photos.length} ${photos.length === 1 ? "Photo" : "Photos"}`;

  // Close the detail view whenever the tab changes (indices wouldn't line up).
  useEffect(() => {
    setSelectedIndex(null);
  }, [view]);

  const showPrev = () =>
    setSelectedIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  const showNext = () =>
    setSelectedIndex((i) => (i === null ? i : (i + 1) % photos.length));

  // Keyboard navigation while the detail view is open.
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      else if (e.key === "ArrowLeft")
        setSelectedIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
      else if (e.key === "ArrowRight")
        setSelectedIndex((i) => (i === null ? i : (i + 1) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, photos.length]);

  const toggleFavorite = (name: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const selected = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <div className="relative flex h-full bg-[#1c1c1e] text-gray-200 font-sans" style={{ fontSize: 13 }}>
      <aside className="w-56 bg-[#222224] border-r border-black/40 px-2.5 py-3 flex flex-col gap-0.5 flex-shrink-0">
        <div className="text-[11px] text-gray-500 px-2.5 mt-1 mb-1 font-semibold tracking-[0.08em]">LIBRARY</div>
        <SidebarRow active={isLibrary} onClick={() => setView("library")} label="Library">
          <PhotosLibraryIcon active={isLibrary} />
        </SidebarRow>
        <SidebarRow active={isFavorites} onClick={() => setView("favorites")} label="Favorites">
          <PhotosHeartIcon active={isFavorites} />
        </SidebarRow>

        <div className="text-[11px] text-gray-500 px-2.5 mt-4 mb-1 font-semibold tracking-[0.08em]">COLLECTIONS</div>
        {albumTabs.map((t) => {
          const active = view === t.id;
          return (
            <SidebarRow key={t.id} active={active} onClick={() => setView(t.id)} label={t.label}>
              <PhotosFolderIcon active={active} />
            </SidebarRow>
          );
        })}
      </aside>

      <div className="flex-1 flex flex-col bg-[#1c1c1e] overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <div>
            <h1 className="text-[22px] font-bold text-white leading-tight tracking-tight">
              {TITLES[view]}
            </h1>
            <p className="text-[11px] text-gray-400 mt-1">{subtitle}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {photos.length > 0 ? (
            <div className="grid grid-cols-5 gap-0.5">
              {photos.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedIndex(i)}
                  className="aspect-square overflow-hidden bg-black/30 group"
                >
                  <img
                    src={p.url}
                    alt={`${TITLES[view]} ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:opacity-90 transition cursor-pointer"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 text-gray-500">
              <p className="text-[14px] text-gray-300 font-medium">No photos yet</p>
              <p className="text-[12px] mt-1 max-w-xs">
                Add images to{" "}
                <code className="text-gray-400">src/assets/photos/library/</code>{" "}
                and they'll appear here automatically.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Single-photo detail view (macOS Photos style) */}
      {selected && selectedIndex !== null && (
        <div className="absolute inset-0 z-30 flex flex-col bg-[#1c1c1e]">
          <div className="flex items-center justify-between h-12 px-4 flex-shrink-0 text-white">
            <button
              onClick={() => setSelectedIndex(null)}
              aria-label="Back"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 1L1.5 9l8 8" />
              </svg>
            </button>
            <div className="text-center leading-tight">
              <div className="text-[13px] font-semibold text-white">{TITLES[view]}</div>
              <div className="text-[11px] text-gray-400">
                {selectedIndex + 1} of {photos.length}
              </div>
            </div>
            <button
              onClick={() => toggleFavorite(selected.name)}
              aria-label={favorites.has(selected.name) ? "Remove from Favorites" : "Add to Favorites"}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                width="21" height="21" viewBox="0 0 24 24" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                fill={favorites.has(selected.name) ? "#fff" : "none"}
                stroke={favorites.has(selected.name) ? "#fff" : "#d1d5db"}
              >
                <path d="M12 20.2c-.34 0-.67-.12-.93-.35-3.02-2.6-4.62-4.13-5.78-5.66C3.9 12.34 3.2 10.66 3.2 8.9 3.2 6.16 5.3 4.1 7.95 4.1c1.62 0 3.12.78 4.05 2.05.93-1.27 2.43-2.05 4.05-2.05 2.65 0 4.75 2.06 4.75 4.8 0 1.76-.7 3.44-2.09 5.29-1.16 1.53-2.76 3.06-5.78 5.66-.26.23-.59.35-.93.35z" />
              </svg>
            </button>
          </div>

          {/* Image area — click the backdrop to close */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden select-none"
            onClick={() => setSelectedIndex(null)}
          >
            {photos.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                aria-label="Previous"
                className="absolute left-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <svg width="10" height="16" viewBox="0 0 11 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 1L1.5 9l8 8" />
                </svg>
              </button>
            )}
            <img
              src={selected.url}
              alt={`${TITLES[view]} ${selectedIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain"
            />
            {photos.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                aria-label="Next"
                className="absolute right-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <svg width="10" height="16" viewBox="0 0 11 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 1l8 8-8 8" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarRow({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-2.5 py-[6px] rounded-lg flex items-center gap-2.5 text-left transition-colors ${
        active ? "bg-[#3a3a3d]" : "hover:bg-white/5"
      }`}
    >
      <span className="w-[18px] flex items-center justify-center flex-shrink-0">{children}</span>
      <span className={`text-[13px] ${active ? "text-[#0a84ff] font-medium" : "text-[#e8e8ea]"}`}>
        {label}
      </span>
    </button>
  );
}

const SIDEBAR_ACTIVE = "#0a84ff";
const SIDEBAR_INACTIVE = "#d6d6d8";

function PhotosLibraryIcon({ active }: { active: boolean }) {
  const c = active ? SIDEBAR_ACTIVE : SIDEBAR_INACTIVE;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 5.5h9a2 2 0 012 2v8" />
      <rect x="3.5" y="7.5" width="13" height="11" rx="2.5" />
      <circle cx="7.1" cy="11" r="1.05" />
      <path d="M4 16.9l2.8-2.4 2 1.7 3-2.6 4.2 3.6" />
    </svg>
  );
}

function PhotosHeartIcon({ active }: { active: boolean }) {
  const c = active ? SIDEBAR_ACTIVE : SIDEBAR_INACTIVE;
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.2c-.34 0-.67-.12-.93-.35-3.02-2.6-4.62-4.13-5.78-5.66C3.9 12.34 3.2 10.66 3.2 8.9 3.2 6.16 5.3 4.1 7.95 4.1c1.62 0 3.12.78 4.05 2.05.93-1.27 2.43-2.05 4.05-2.05 2.65 0 4.75 2.06 4.75 4.8 0 1.76-.7 3.44-2.09 5.29-1.16 1.53-2.76 3.06-5.78 5.66-.26.23-.59.35-.93.35z"/>
    </svg>
  );
}

function PhotosFolderIcon({ active }: { active: boolean }) {
  const c = active ? SIDEBAR_ACTIVE : SIDEBAR_INACTIVE;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {active ? (
        // open folder when selected
        <path d="M6 14l1.45-2.9A2 2 0 019.24 10H21a1 1 0 01.95 1.3l-1.9 5.7a2 2 0 01-1.9 1.4H4a2 2 0 01-2-2V5a2 2 0 012-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H18a2 2 0 012 2v2" />
      ) : (
        // closed folder
        <path d="M20 19.5H4a2 2 0 01-2-2V6a2 2 0 012-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H20a2 2 0 012 2v8.5a2 2 0 01-2 2z" />
      )}
    </svg>
  );
}

/* ==================== Settings ==================== */
type SettingsSection = "wifi" | "bluetooth" | "general" | "appearance" | "wallpaper";

type SidebarItem = { id: SettingsSection; label: string; color: string; glyph: ReactNode };

// Sidebar layout mirrors macOS System Settings. Groups are separated by dividers.
// `color` accepts a solid hex or a CSS gradient (for the multicolor icons).
const SETTINGS_GROUPS: SidebarItem[][] = [
  [
    { id: "wifi", label: "Wi-Fi", color: "#1e8bff", glyph: <WifiGlyph /> },
    { id: "bluetooth", label: "Bluetooth", color: "#1e8bff", glyph: <BluetoothGlyph /> },
  ],
  [
    { id: "general", label: "General", color: "#8e8e93", glyph: <GearGlyph /> },
    { id: "appearance", label: "Appearance", color: "#1c1c1e", glyph: <AppearanceGlyph /> },
    { id: "wallpaper", label: "Wallpaper", color: "linear-gradient(135deg,#34d3ff,#6c5ce7,#ff6bcb)", glyph: <WallpaperGlyph /> },
  ],
];

const SETTINGS_TITLES: Record<SettingsSection, string> = Object.fromEntries(
  SETTINGS_GROUPS.flat().map((i) => [i.id, i.label])
) as Record<SettingsSection, string>;

function SettingsApp({
  theme,
  onToggleTheme,
  wallpaper,
  onChangeWallpaper,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  wallpaper: string;
  onChangeWallpaper: (value: string) => void;
}) {
  const [section, setSection] = useState<SettingsSection>("wifi");

  return (
    <div className="flex h-full bg-[#ececec] dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans" style={{ fontSize: 13 }}>
      <aside className="w-[230px] bg-[#e3e3e6]/80 dark:bg-[#262629]/85 backdrop-blur-xl border-r border-black/10 dark:border-white/10 flex flex-col flex-shrink-0">
        {/* Search */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-2 px-2.5 py-[6px] rounded-[8px] bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 shadow-sm">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-gray-400 dark:text-gray-500">
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3.5 3.5" strokeLinecap="round" />
            </svg>
            <span className="text-[13px] text-gray-400 dark:text-gray-500">Search</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2.5 pb-3">
          {/* Profile */}
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left">
            <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#d9b8a0] to-[#b88a6a] flex items-center justify-center text-[20px] flex-shrink-0">
              🤙
            </div>
            <div className="leading-tight min-w-0">
              <div className="font-semibold text-[14px] truncate">Fatimah Hussain</div>
              <div className="text-[12px] text-gray-500 dark:text-gray-400">Apple ID</div>
            </div>
          </button>

          {/* Family */}
          <button className="w-full flex items-center gap-2.5 px-2 py-1.5 mb-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left">
            <div className="flex items-center -space-x-1.5 w-[40px] justify-center flex-shrink-0">
              {["MI", "GI", "KH"].map((m) => (
                <span key={m} className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#9a9aa2] to-[#6e6e78] ring-[1.5px] ring-[#e3e3e6] dark:ring-[#262629] text-white text-[7px] font-semibold flex items-center justify-center">{m}</span>
              ))}
            </div>
            <span className="text-[13px]">Family</span>
          </button>

          {/* Grouped rows */}
          {SETTINGS_GROUPS.map((group, gi) => (
            <div key={gi}>
              <div className="flex flex-col gap-[2px]">
                {group.map((item) => (
                  <SettingsRow
                    key={item.id}
                    active={section === item.id}
                    onClick={() => setSection(item.id)}
                    label={item.label}
                    color={item.color}
                  >
                    {item.glyph}
                  </SettingsRow>
                ))}
              </div>
              {gi < SETTINGS_GROUPS.length - 1 && <div className="h-px bg-black/[0.08] dark:bg-white/[0.08] mx-2 my-2.5" />}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto bg-[#ececec] dark:bg-[#1e1e1e]">
        <div className="sticky top-0 z-10 bg-[#ececec]/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl px-7 pt-4 pb-3 border-b border-black/5 dark:border-white/5">
          <h1 className="text-[15px] font-bold">{SETTINGS_TITLES[section]}</h1>
        </div>
        <div className="px-7 py-5 max-w-[640px]">
          {section === "wifi" && <WifiPanel />}
          {section === "bluetooth" && <BluetoothPanel />}
          {section === "general" && <GeneralPanel />}
          {section === "wallpaper" && <WallpaperPanel wallpaper={wallpaper} onChange={onChangeWallpaper} />}
          {section === "appearance" && <AppearancePanel theme={theme} onToggleTheme={onToggleTheme} />}
        </div>
      </div>
    </div>
  );
}

function SettingsRow({
  label,
  color,
  active,
  onClick,
  children,
}: {
  label: string;
  color: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2 py-[5px] rounded-[7px] text-left transition-colors ${
        active ? "bg-[#0a82ff] text-white" : "hover:bg-black/[0.06] dark:hover:bg-white/[0.07]"
      }`}
    >
      <span
        className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-white flex-shrink-0 shadow-sm"
        style={{ background: color }}
      >
        {children}
      </span>
      <span className={`text-[13px] ${active ? "font-medium" : ""}`}>{label}</span>
    </button>
  );
}

/* ---- macOS settings card primitives ---- */
function SettingsCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#2c2c2e] rounded-[10px] border border-black/[0.07] dark:border-white/[0.07] shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick?: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative w-[38px] h-[23px] rounded-full transition-colors flex-shrink-0 ${on ? "bg-[#34c759]" : "bg-black/15 dark:bg-white/20"}`}
    >
      <span className={`absolute top-[2px] left-[2px] w-[19px] h-[19px] rounded-full bg-white shadow transition-transform ${on ? "translate-x-[15px]" : ""}`} />
    </button>
  );
}

function Chevron() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
      <path d="M1 1l5 5-5 5" />
    </svg>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium px-1 mb-1.5 mt-5 first:mt-0">{children}</div>;
}

/* ---- Wi-Fi panel ---- */
function WifiPanel() {
  const [on, setOn] = useState(true);
  const others = [
    { name: "Berkeley-IoT", secure: true, bars: 3 },
    { name: "eduroam", secure: true, bars: 2 },
    { name: "CalVisitor", secure: false, bars: 2 },
    { name: "xfinitywifi", secure: false, bars: 1 },
  ];
  return (
    <>
      <SettingsCard>
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-[7px] bg-[#3478f6] flex items-center justify-center text-white"><WifiGlyph big /></span>
            <span className="text-[13px]">Wi-Fi</span>
          </div>
          <Toggle on={on} onClick={() => setOn(!on)} />
        </div>
      </SettingsCard>

      {on && (
        <>
          <GroupLabel>Known Network</GroupLabel>
          <SettingsCard>
            <div className="flex items-center gap-3 px-4 py-2.5">
              <span className="w-6 h-6 rounded-[6px] bg-[#3478f6] flex items-center justify-center text-white"><WifiGlyph /></span>
              <div className="flex-1">
                <div className="text-[13px] font-medium">Fatimah's Network</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Connected</div>
              </div>
              <CheckIcon />
              <LockIcon />
              <WifiBars bars={3} />
              <InfoButton />
            </div>
          </SettingsCard>

          <GroupLabel>Other Networks</GroupLabel>
          <SettingsCard>
            <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
              {others.map((n) => (
                <div key={n.name} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-[13px] flex-1">{n.name}</span>
                  {n.secure && <LockIcon />}
                  <WifiBars bars={n.bars} />
                </div>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard>
            <div className="flex items-center justify-between px-4 py-2.5 mt-4">
              <span className="text-[13px]">Ask to join networks</span>
              <span className="text-[12px] text-gray-500 dark:text-gray-400 flex items-center gap-1">Notify <Chevron /></span>
            </div>
          </SettingsCard>
        </>
      )}
    </>
  );
}

/* ---- Bluetooth panel ---- */
function BluetoothPanel() {
  const [on, setOn] = useState(true);
  const mine = [
    { name: "Fatimah's AirPods Pro", status: "Connected", icon: "airpods" as const },
  ];
  return (
    <>
      <SettingsCard>
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-[7px] bg-[#3478f6] flex items-center justify-center text-white"><BluetoothGlyph big /></span>
            <span className="text-[13px]">Bluetooth</span>
          </div>
          <Toggle on={on} onClick={() => setOn(!on)} />
        </div>
        {on && (
          <div className="px-4 py-2.5 border-t border-black/[0.06] dark:border-white/[0.06] text-[12px] text-gray-500 dark:text-gray-400">
            This Mac is discoverable as “Fatimah's MacBook Pro” while Bluetooth Settings is open.
          </div>
        )}
      </SettingsCard>

      {on && (
        <>
          <GroupLabel>My Devices</GroupLabel>
          <SettingsCard>
            <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
              {mine.map((d) => (
                <div key={d.name} className="flex items-center gap-3 px-4 py-2.5">
                  <DeviceIcon kind={d.icon} />
                  <span className="text-[13px] flex-1">{d.name}</span>
                  <span className={`text-[12px] ${d.status === "Connected" ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>{d.status}</span>
                  <InfoButton />
                </div>
              ))}
            </div>
          </SettingsCard>
        </>
      )}
    </>
  );
}

/* ---- General panel ---- */
function GeneralPanel() {
  const rows: { label: string; color: string; glyph: ReactNode }[] = [
    { label: "About", color: "#8e8e93", glyph: <InfoGlyph /> },
    { label: "Software Update", color: "#34c759", glyph: <UpdateGlyph /> },
    { label: "Storage", color: "#34c759", glyph: <StorageGlyph /> },
    { label: "AirDrop & Handoff", color: "#3478f6", glyph: <AirdropGlyph /> },
    { label: "Login Items & Extensions", color: "#8e8e93", glyph: <GearGlyph /> },
    { label: "Language & Region", color: "#3478f6", glyph: <GlobeGlyph /> },
    { label: "Date & Time", color: "#ff453a", glyph: <ClockGlyph /> },
    { label: "Sharing", color: "#3478f6", glyph: <ShareGlyph /> },
    { label: "Time Machine", color: "#34c759", glyph: <ClockGlyph /> },
    { label: "Transfer or Reset", color: "#8e8e93", glyph: <ResetGlyph /> },
  ];
  return (
    <SettingsCard>
      <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
        {rows.map((r) => (
          <button key={r.label} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors">
            <span className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: r.color }}>
              {r.glyph}
            </span>
            <span className="text-[13px] flex-1">{r.label}</span>
            <Chevron />
          </button>
        ))}
      </div>
    </SettingsCard>
  );
}

/* ---- Wallpaper panel ---- */
function WallpaperPanel({ wallpaper, onChange }: { wallpaper: string; onChange: (value: string) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [screenSaver, setScreenSaver] = useState(true);
  const [allSpaces, setAllSpaces] = useState(true);

  const current = WALLPAPERS.find((w) => w.value === wallpaper);
  const currentName = current?.name ?? "Custom Photo";

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(`url("${url}")`);
    e.target.value = "";
  };

  return (
    <>
      {/* Selected wallpaper + options */}
      <div className="flex gap-4">
        <div
          className="w-[210px] h-[128px] rounded-[8px] bg-cover bg-center ring-1 ring-black/15 dark:ring-white/15 shadow-md flex-shrink-0"
          style={{ backgroundImage: wallpaper, backgroundColor: "#3a6ea5" }}
        />
        <div className="flex-1 flex flex-col gap-3">
          <SettingsCard>
            <div className="px-4 py-3 text-[13px] font-medium">{currentName}</div>
          </SettingsCard>
          <SettingsCard>
            <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[13px]">Show as screen saver</span>
                <Toggle on={screenSaver} onClick={() => setScreenSaver(!screenSaver)} />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[13px]">Show on all Spaces</span>
                <Toggle on={allSpaces} onClick={() => setAllSpaces(!allSpaces)} />
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>

      {/* Add buttons */}
      <div className="flex justify-end gap-2.5 mt-4">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
        <button
          onClick={() => fileRef.current?.click()}
          className="px-3.5 py-[5px] rounded-[7px] bg-white dark:bg-[#3a3a3c] border border-black/10 dark:border-white/10 shadow-sm text-[13px] flex items-center gap-1.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.06]"
        >
          Add Photo <Chevron />
        </button>
        <button className="px-3.5 py-[5px] rounded-[7px] bg-white dark:bg-[#3a3a3c] border border-black/10 dark:border-white/10 shadow-sm text-[13px] flex items-center gap-1.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.06]">
          Add Folder or Album <Chevron />
        </button>
      </div>

      <div className="h-px bg-black/10 dark:bg-white/10 my-5" />

      {/* Presets */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold">Wallpapers</h2>
        <span className="text-[12px] text-[#0a82ff]">Show All ({WALLPAPERS.length})</span>
      </div>
      <div className="grid grid-cols-4 gap-x-4 gap-y-3">
        {WALLPAPERS.map((w) => {
          const selected = w.value === wallpaper;
          return (
            <button key={w.id} onClick={() => onChange(w.value)} className="flex flex-col items-center gap-1.5 group">
              <div
                className={`w-full aspect-[16/10] rounded-[7px] bg-cover bg-center shadow-sm ${
                  selected ? "ring-2 ring-[#0a82ff] ring-offset-2 ring-offset-[#ececec] dark:ring-offset-[#1e1e1e]" : "ring-1 ring-black/10 dark:ring-white/10 group-hover:ring-black/25 dark:group-hover:ring-white/25"
                }`}
                style={{ backgroundImage: w.value, backgroundColor: "#3a6ea5" }}
              />
              <span className={`text-[11px] ${selected ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-600 dark:text-gray-400"}`}>{w.name}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ---- Appearance panel ---- */
function AppearancePanel({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const isDark = theme === "dark";
  const modes: { id: "light" | "dark"; label: string }[] = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ];
  const accents = [
    { name: "Multicolor", color: "linear-gradient(135deg,#ff5f57,#ffbd2e,#28c840,#0a82ff,#af52de)" },
    { name: "Blue", color: "#0a82ff" },
    { name: "Purple", color: "#af52de" },
    { name: "Pink", color: "#ff2d55" },
    { name: "Red", color: "#ff3b30" },
    { name: "Orange", color: "#ff9500" },
    { name: "Yellow", color: "#ffcc00" },
    { name: "Green", color: "#34c759" },
    { name: "Graphite", color: "#8e8e93" },
  ];
  const [accent, setAccent] = useState(1);

  return (
    <>
      <SettingsCard>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium">Appearance</span>
            <div className="flex gap-4">
              {modes.map((m) => {
                const selected = m.id === (isDark ? "dark" : "light");
                return (
                  <button
                    key={m.id}
                    onClick={() => { if (m.id !== (isDark ? "dark" : "light")) onToggleTheme(); }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <AppearanceThumb mode={m.id} selected={selected} />
                    <span className={`text-[11px] ${selected ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500 dark:text-gray-400"}`}>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SettingsCard>

      <div className="mt-4">
        <SettingsCard>
          <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px]">Accent color</span>
              <div className="flex items-center gap-2">
                {accents.map((a, i) => (
                  <button
                    key={a.name}
                    aria-label={a.name}
                    onClick={() => setAccent(i)}
                    className={`w-[18px] h-[18px] rounded-full border ${accent === i ? "ring-2 ring-offset-1 ring-[#0a82ff] dark:ring-offset-[#2c2c2e] border-transparent" : "border-black/10 dark:border-white/15"}`}
                    style={{ background: a.color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px]">Highlight color</span>
              <span className="text-[12px] text-gray-500 dark:text-gray-400 flex items-center gap-1">Accent Color <Chevron /></span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px]">Sidebar icon size</span>
              <span className="text-[12px] text-gray-500 dark:text-gray-400 flex items-center gap-1">Medium <Chevron /></span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-[13px]">Allow wallpaper tinting in windows</div>
              </div>
              <Toggle on={true} />
            </div>
          </div>
        </SettingsCard>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2.5 px-1">
        Dark mode changes the appearance of the entire desktop. This setting is synced with the menu bar toggle.
      </p>
    </>
  );
}

function AppearanceThumb({ mode, selected }: { mode: "light" | "dark"; selected: boolean }) {
  const light = mode === "light";
  return (
    <div
      className={`w-[64px] h-[42px] rounded-[6px] overflow-hidden ${selected ? "ring-2 ring-[#0a82ff] ring-offset-2 ring-offset-white dark:ring-offset-[#2c2c2e]" : "ring-1 ring-black/10 dark:ring-white/15"}`}
      style={{ background: light ? "#dfe7f2" : "#2a2c33" }}
    >
      <div className="h-1.5 w-full flex items-center px-1 gap-[2px]" style={{ background: light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.12)" }}>
        <span className="w-[3px] h-[3px] rounded-full bg-[#ff5f57]" />
        <span className="w-[3px] h-[3px] rounded-full bg-[#ffbd2e]" />
        <span className="w-[3px] h-[3px] rounded-full bg-[#28c840]" />
      </div>
      <div className="p-1.5">
        <div className="rounded-[3px] h-full p-1 flex flex-col gap-1" style={{ background: light ? "#fff" : "#1c1d22" }}>
          <div className="h-1 w-9 rounded-full" style={{ background: light ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)" }} />
          <div className="h-1 w-7 rounded-full" style={{ background: light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.13)" }} />
        </div>
      </div>
    </div>
  );
}

/* ---- shared small icons ---- */
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#0a82ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3.5 3.5 6.5-8" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 14 16" fill="currentColor" className="text-gray-500 dark:text-gray-400">
      <path d="M4 7V5a3 3 0 016 0v2h.5A1.5 1.5 0 0112 8.5v5A1.5 1.5 0 0110.5 15h-7A1.5 1.5 0 012 13.5v-5A1.5 1.5 0 013.5 7H4zm1.4 0h3.2V5a1.6 1.6 0 00-3.2 0v2z" />
    </svg>
  );
}
function WifiBars({ bars }: { bars: number }) {
  return (
    <svg width="17" height="13" viewBox="0 0 18 14" fill="none" className="text-gray-700 dark:text-gray-300">
      <path d="M9 12.5l1.8-2.3a3 3 0 00-3.6 0L9 12.5z" fill="currentColor" opacity={bars >= 1 ? 1 : 0.25} />
      <path d="M9 8.2c1.4 0 2.7.5 3.7 1.4l1.3-1.5A7.6 7.6 0 009 6a7.6 7.6 0 00-5 2.1l1.3 1.5A5.5 5.5 0 019 8.2z" fill="currentColor" opacity={bars >= 2 ? 1 : 0.25} />
      <path d="M9 3.9c2.5 0 4.8 1 6.5 2.6L16.8 5A11.4 11.4 0 009 1.7 11.4 11.4 0 001.2 5l1.3 1.5A9.3 9.3 0 019 3.9z" fill="currentColor" opacity={bars >= 3 ? 1 : 0.25} />
    </svg>
  );
}
function InfoButton() {
  return (
    <button className="text-[#0a82ff] flex-shrink-0" aria-label="Info">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.2v3.5M8 5.1v.1" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    </button>
  );
}
function DeviceIcon({ kind }: { kind: "airpods" | "keyboard" | "mouse" }) {
  const glyph =
    kind === "airpods" ? (
      <path d="M6 3c-1.4 0-2.5 1.4-2.5 3.5S4.6 10 6 10s2.5-1.4 2.5-3.5S7.4 3 6 3zm-.3 7v3M10 3c1.4 0 2.5 1.4 2.5 3.5S11.4 10 10 10s-2.5-1.4-2.5-3.5S8.6 3 10 3zm.3 7v3" />
    ) : kind === "keyboard" ? (
      <path d="M2 4.5h12v7H2zM4 7h.01M6.5 7h.01M9 7h.01M11.5 7h.01M4.5 9.5h7" />
    ) : (
      <path d="M8 2.5a3.5 3.5 0 00-3.5 3.5v4A3.5 3.5 0 0011.5 10V6A3.5 3.5 0 008 2.5zM8 4v3" />
    );
  return (
    <span className="w-[26px] h-[26px] rounded-[7px] bg-[#5e5ce6] flex items-center justify-center text-white flex-shrink-0">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {glyph}
      </svg>
    </span>
  );
}

/* ---- sidebar / row glyphs (white strokes on colored boxes) ---- */
function WifiGlyph({ big }: { big?: boolean }) {
  const s = big ? 16 : 13;
  return (
    <svg width={s} height={s} viewBox="0 0 18 14" fill="currentColor">
      <path d="M9 12.5l1.8-2.3a3 3 0 00-3.6 0L9 12.5z" />
      <path d="M9 8.2c1.4 0 2.7.5 3.7 1.4l1.3-1.5A7.6 7.6 0 009 6a7.6 7.6 0 00-5 2.1l1.3 1.5A5.5 5.5 0 019 8.2z" />
      <path d="M9 3.9c2.5 0 4.8 1 6.5 2.6L16.8 5A11.4 11.4 0 009 1.7 11.4 11.4 0 001.2 5l1.3 1.5A9.3 9.3 0 019 3.9z" />
    </svg>
  );
}
function BluetoothGlyph({ big }: { big?: boolean }) {
  const s = big ? 16 : 12;
  return (
    <svg width={s} height={s} viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5l8 8-4 3.5V1.5l4 3.5-8 8" />
    </svg>
  );
}
function GearGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 5.2A2.8 2.8 0 108 10.8 2.8 2.8 0 008 5.2zm0 1.6a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
      <path d="M7 1h2l.3 1.6a5.6 5.6 0 011.3.55l1.4-.85 1.4 1.4-.85 1.4c.24.4.43.84.55 1.3L15 6.7v2l-1.6.3c-.12.46-.31.9-.55 1.3l.85 1.4-1.4 1.4-1.4-.85c-.4.24-.84.43-1.3.55L9 14.3H7l-.3-1.6a5.6 5.6 0 01-1.3-.55l-1.4.85-1.4-1.4.85-1.4a5.6 5.6 0 01-.55-1.3L1 8.7v-2l1.6-.3c.12-.46.31-.9.55-1.3l-.85-1.4 1.4-1.4 1.4.85c.4-.24.84-.43 1.3-.55L7 1z" fillOpacity="0.55" />
    </svg>
  );
}
function WallpaperGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5" cy="6" r="1.2" fill="currentColor" />
      <path d="M2.5 12l3.5-3.5 2.5 2.5 2-2 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AppearanceGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="#fff" />
      <path d="M8 2a6 6 0 000 12V2z" fill="#000" fillOpacity="0.001" />
      <path d="M8 2a6 6 0 010 12V2z" fill="#9b9b9f" />
    </svg>
  );
}
function InfoGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.2a1 1 0 110 2 1 1 0 010-2zM7 7.5h1.6v4.3H7z" />
    </svg>
  );
}
function UpdateGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 8a5 5 0 11-1.5-3.5M13 2v3h-3" />
    </svg>
  );
}
function StorageGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2" y="4" width="12" height="8" rx="1.5" />
      <path d="M5 8h.01M7 8h3" strokeLinecap="round" />
    </svg>
  );
}
function AirdropGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9a4 4 0 016 0M3 6.5a7.5 7.5 0 0110 0M8 11.5l.01.01" />
    </svg>
  );
}
function GlobeGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8" cy="8" r="6.3" />
      <path d="M2 8h12M8 1.7c1.8 2 1.8 10.6 0 12.6M8 1.7c-1.8 2-1.8 10.6 0 12.6" />
    </svg>
  );
}
function ClockGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.3" />
      <path d="M8 4.5V8l2.5 1.8" />
    </svg>
  );
}
function ShareGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v8M5.5 4.2L8 2l2.5 2.2" />
      <path d="M4 8H3v6h10V8h-1" />
    </svg>
  );
}
function ResetGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 8a5.5 5.5 0 109-4.2M2.5 3.5V6H5" />
    </svg>
  );
}

/* ==================== Terminal App ====================
 * Interactive "ask me about Fatimah" chatbot. Questions are answered from the
 * local knowledge base in bio.ts (no backend) — see answerQuestion(). */
type TermLine = { role: "user" | "bot"; text: string };

const TerminalPrompt = () => (
  <span className="whitespace-pre">
    <span className="text-[#6cc26c]">fatimah</span>
    <span className="text-[#5aa9f0]"> ~</span>
    <span className="text-[#e0e0e0]"> % </span>
  </span>
);

// Render plain text, turning URLs and emails into clickable links.
function linkify(text: string): ReactNode[] {
  return text.split(/(\s+)/).map((tok, i) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tok))
      return <a key={i} href={`mailto:${tok}`} className="text-[#5fb0e8] hover:underline">{tok}</a>;
    if (/^(https?:\/\/[^\s]+|[a-z0-9-]+(\.[a-z0-9-]+)*\.(com|org|edu|so|inc|dev|store|net|gg|co)(\/[^\s]*)?)$/i.test(tok)) {
      const href = tok.startsWith("http") ? tok : `https://${tok}`;
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-[#5fb0e8] hover:underline">{tok}</a>;
    }
    return <span key={i}>{tok}</span>;
  });
}

function TerminalApp() {
  const [history, setHistory] = useState<TermLine[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastLogin] = useState(() => {
    // Mimic the "Last login: Day Mon DD HH:MM:SS on ttysNNN" header Terminal.app prints.
    const p = new Date().toString().split(" ");
    return `Last login: ${p[0]} ${p[1]} ${p[2]} ${p[4]} on ttys001`;
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, busy]);

  // Ask the Claude-backed endpoint for a freeform answer (used only when the local
  // matcher has no confident answer). Falls back to the contact message on any error.
  const askApi = async (question: string, priorTurns: TermLine[]): Promise<string> => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history: priorTurns.map((t) => ({
            role: t.role === "user" ? "user" : "assistant",
            content: t.text,
          })),
        }),
      });
      if (!res.ok) return FALLBACK_ANSWER;
      const data = (await res.json()) as { answer?: string };
      return data.answer?.trim() || FALLBACK_ANSWER;
    } catch {
      return FALLBACK_ANSWER;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || busy) return;
    if (cmd.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const priorTurns = history;
    setHistory((h) => [...h, { role: "user", text: cmd }]);
    setInput("");

    // 1) Try the free, instant local matcher.
    const local = answerQuestion(cmd);
    if (local !== null) {
      setHistory((h) => [...h, { role: "bot", text: local }]);
      return;
    }

    // 2) Fall through to Claude for anything it can't confidently answer.
    setBusy(true);
    const reply = await askApi(cmd, priorTurns);
    setHistory((h) => [...h, { role: "bot", text: reply }]);
    setBusy(false);
  };

  return (
    <div
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
      className="h-full w-full overflow-y-auto bg-[#1e1e1e] text-[13px] leading-[1.45] px-3.5 py-2 text-gray-300 selection:bg-white/20 cursor-text"
      style={{ fontFamily: '"SF Mono", "Menlo", "Monaco", "Courier New", monospace' }}
    >
      <div className="text-gray-500 whitespace-pre-wrap">{lastLogin}</div>
      <div className="text-gray-400 whitespace-pre-wrap mt-1">{linkify(TERMINAL_INTRO)}</div>

      {history.map((line, i) =>
        line.role === "user" ? (
          <div key={i} className="mt-2">
            <TerminalPrompt />
            <span className="text-gray-100">{line.text}</span>
          </div>
        ) : (
          <div key={i} className="mt-1 whitespace-pre-wrap text-gray-300">{linkify(line.text)}</div>
        )
      )}

      {busy && (
        <div className="mt-1 text-gray-500 flex items-center gap-1">
          thinking<span className="terminal-cursor">▋</span>
        </div>
      )}

      {!busy && (
        <form onSubmit={submit} className="mt-2 flex items-center">
          <TerminalPrompt />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Ask the terminal a question about Fatimah"
            className="flex-1 bg-transparent outline-none border-none text-gray-100 caret-gray-200 placeholder:text-gray-600"
            placeholder="ask me anything about fatimah…"
            style={{ fontFamily: "inherit", fontSize: "inherit" }}
          />
        </form>
      )}
    </div>
  );
}

/* ==================== Dock ==================== */
function Dock({ onOpen, openIds }: { onOpen: (id: AppId) => void; openIds: AppId[] }) {
  const apps: { id: AppId; Icon: React.FC }[] = [
    { id: "notes", Icon: NotesIcon },
    { id: "photos", Icon: PhotosIcon },
    { id: "terminal", Icon: TerminalIcon },
    { id: "settings", Icon: SettingsIcon },
  ];

  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const BASE_SIZE = 68;
  const MAX_SCALE = 1.6;
  const FALLOFF_PX = 110;

  const getScale = (i: number) => {
    if (mouseX === null) return 1;
    const el = iconRefs.current[i];
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - center);
    if (dist > FALLOFF_PX) return 1;
    const t = dist / FALLOFF_PX;
    return 1 + (MAX_SCALE - 1) * Math.cos((t * Math.PI) / 2);
  };

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40">
      <div
        className="glass-dock rounded-2xl px-3 flex items-end justify-center gap-3 border border-white/40 shadow-2xl overflow-visible"
        style={{ height: BASE_SIZE + 24, paddingBottom: 12, paddingTop: 12 }}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {apps.map(({ id, Icon }, i) => {
          const isOpen = openIds.includes(id);
          const scale = getScale(i);
          const size = BASE_SIZE * scale;
          return (
            <button
              key={id}
              onClick={() => onOpen(id)}
              className="group relative flex flex-col items-center"
              aria-label={APP_TITLES[id]}
            >
              <span
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#e8e8e8]/95 px-3 py-1 text-[13px] font-medium text-black shadow-lg opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 z-10"
                style={{ bottom: size + 14 }}
              >
                {APP_TITLES[id]}
              </span>
              <div
                ref={(el) => { iconRefs.current[i] = el; }}
                className="icon-shadow transition-[width,height] duration-200 ease-out"
                style={{ width: size, height: size }}
              >
                <Icon />
              </div>
              <div className={`absolute left-1/2 -translate-x-1/2 -bottom-2 w-1 h-1 rounded-full ${isOpen ? "bg-white/80" : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NotesIcon() {
  return <img src="/icons/notes.webp" alt="Notes" className="w-full h-full" draggable={false} />;
}

function PhotosIcon() {
  return <img src="/icons/photos.webp" alt="Photos" className="w-full h-full" draggable={false} />;
}

function SettingsIcon() {
  return <img src="/icons/settings.webp" alt="System Settings" className="w-full h-full" draggable={false} />;
}

function TerminalIcon() {
  return <img src="/icons/terminal.webp" alt="Terminal" className="w-full h-full" draggable={false} />;
}
