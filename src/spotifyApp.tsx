import { useState, useEffect } from "react";

/* ==================== Spotify App ====================
 * Self-contained Spotify clone. Currently not mounted in the dock — kept here
 * so it can be re-added later. To bring it back:
 *   1. import { SpotifyApp, SpotifyIcon } from "./spotifyApp" in App.tsx
 *   2. render <SpotifyApp /> for the "spotify" window (already wired in App.tsx)
 *   3. add { id: "spotify", Icon: SpotifyIcon } to the Dock's apps list
 */
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

export function SpotifyApp() {
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

export function SpotifyIcon() {
  return <img src="/icons/spotify.png" alt="Spotify" className="w-full h-full" draggable={false} />;
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
