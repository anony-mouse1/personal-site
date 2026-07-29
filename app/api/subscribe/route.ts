import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Where subscribers go, in priority order:
//   1. Supabase, if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set
//   2. otherwise a local JSONL file at data/subscribers.jsonl
// The file fallback only works where the filesystem is writable and durable —
// `next dev` locally, or `next start` on a real server. On Vercel and other
// serverless hosts writes either fail or vanish on the next cold start, so set
// the Supabase env vars before deploying.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_SUBSCRIBERS_TABLE ?? "subscribers";

const LOCAL_FILE = path.join(process.cwd(), "data", "subscribers.jsonl");

// Deliberately loose — real validation is the confirmation email you send later.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Subscriber = { email: string; source: string; created_at: string };

async function saveToSupabase(row: Subscriber) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      // Ignore a repeat signup instead of erroring on the unique email index.
      Prefer: "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
  }
}

async function saveToFile(row: Subscriber) {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await appendFile(LOCAL_FILE, `${JSON.stringify(row)}\n`, "utf8");
}

export async function POST(request: Request) {
  let email: unknown;
  let source: unknown;

  try {
    ({ email, source } = await request.json());
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const row: Subscriber = {
    email: email.trim().toLowerCase(),
    source: typeof source === "string" ? source : "home",
    created_at: new Date().toISOString(),
  };

  try {
    if (SUPABASE_URL && SUPABASE_KEY) {
      await saveToSupabase(row);
      return Response.json({ ok: true, storage: "supabase" });
    }

    await saveToFile(row);
    return Response.json({ ok: true, storage: "file" });
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return Response.json({ error: "Could not save your email. Please try again." }, { status: 500 });
  }
}
