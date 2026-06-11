import type { VercelRequest, VercelResponse } from "@vercel/node";

// Lightweight diagnostics for the Terminal chatbot backend. Hitting this route
// tells you whether the serverless function boots at all and whether the
// ANTHROPIC_API_KEY env var is present — without ever exposing the key itself.
// A 200 here + a 500 from /api/ask means a code problem; a missing key here
// means a config problem in Vercel project settings.
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const key = process.env.ANTHROPIC_API_KEY;
  res.status(200).json({
    ok: true,
    keyPresent: typeof key === "string" && key.length > 0,
    keyLooksValid: typeof key === "string" && key.startsWith("sk-ant-"),
  });
}
