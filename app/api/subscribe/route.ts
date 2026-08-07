import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Kit (formerly ConvertKit) is the newsletter itself: if KIT_API_KEY +
// KIT_FORM_ID are set, a signup here adds the address to that form and Kit
// takes over from there (confirmation email, sequences, broadcasts).
const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_FORM_ID = process.env.KIT_FORM_ID;

// A second copy of the list, kept under your own control, in priority order:
//   1. Supabase, if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set
//   2. otherwise a local JSONL file at data/subscribers.jsonl
// The file fallback only works where the filesystem is writable and durable:
// `next dev` locally, or `next start` on a real server. On Vercel and other
// serverless hosts writes either fail or vanish on the next cold start, so set
// the Supabase env vars before deploying.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_SUBSCRIBERS_TABLE ?? "subscribers";

const LOCAL_FILE = path.join(process.cwd(), "data", "subscribers.jsonl");

// Deliberately loose; real validation is the confirmation email Kit sends.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Subscriber = { email: string; source: string; created_at: string };

function kitHeaders() {
  return {
    "X-Kit-Api-Key": KIT_API_KEY!,
    "Content-Type": "application/json",
  };
}

// Kit's error bodies echo the request, never the key, so they are safe to log.
// The key itself lives only in the header and is never included in a message.
async function kitPost(url: string, body: unknown, label: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: kitHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Kit ${label} responded ${res.status}: ${await res.text()}`);
  }
  return res;
}

// Two calls, not one: `POST /forms/{id}/subscribers` 404s unless the address is
// already a subscriber on the account, so it cannot be used on its own to sign
// somebody up. Step 1 creates (201) or matches an existing (200) subscriber;
// step 2 is what actually attaches them to the form and runs its automations.
async function subscribeToKit(row: Subscriber) {
  await kitPost("https://api.kit.com/v4/subscribers", { email_address: row.email }, "create-subscriber");

  await kitPost(
    `https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`,
    { email_address: row.email },
    "add-to-form",
  );
}

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

// Your own copy of the list. Best effort: once Kit has the address the signup
// has succeeded, so a Supabase or disk problem is logged, not surfaced.
async function archive(row: Subscriber): Promise<"supabase" | "file" | "none"> {
  try {
    if (SUPABASE_URL && SUPABASE_KEY) {
      await saveToSupabase(row);
      return "supabase";
    }
    await saveToFile(row);
    return "file";
  } catch (err) {
    console.error("Newsletter archive failed (signup itself was fine):", err);
    return "none";
  }
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
    if (KIT_API_KEY && KIT_FORM_ID) {
      await subscribeToKit(row);
      return Response.json({ ok: true, storage: "kit", archived: await archive(row) });
    }

    // No Kit credentials yet: still capture the address so nobody is lost.
    const archived = await archiveOrThrow(row);
    return Response.json({ ok: true, storage: archived });
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return Response.json({ error: "Could not save your email. Please try again." }, { status: 500 });
  }
}

// Same destinations as archive(), but failures propagate: without Kit this is
// the only place the address lands, so a failure here has to reach the visitor.
async function archiveOrThrow(row: Subscriber): Promise<"supabase" | "file"> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    await saveToSupabase(row);
    return "supabase";
  }
  await saveToFile(row);
  return "file";
}
