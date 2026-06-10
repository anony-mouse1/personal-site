import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { BIO_CONTEXT, CONTACT_EMAIL } from "../src/bio";

// Server-side Claude proxy for the Terminal "ask me about Fatimah" chatbot.
// The local keyword matcher (src/bio.ts) answers common questions for free; only
// questions it can't confidently handle fall through to this endpoint. The API key
// lives in the ANTHROPIC_API_KEY env var (set in Vercel project settings) and never
// reaches the browser.

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

const SYSTEM = `You are the assistant inside a macOS-style terminal on Fatimah Hussain's personal website. Visitors talk to you to learn about Fatimah and, especially, how she can help them — many are students, creators, or aspiring founders.

Answer ONLY using the facts below. Do not invent details, numbers, dates, links, or offerings that aren't stated. If the answer isn't covered by the facts, say you're not sure and point them to Fatimah directly at ${CONTACT_EMAIL}.

Style: warm, friendly, and concise (usually 1–4 short sentences). Plain text only — this is a terminal, so no markdown headings, bold, or bullet symbols beyond simple "- " dashes. When relevant, point people toward the right resource or link from the facts (e.g. finnie, her Stan store, her socials, or her email). Refer to Fatimah in the third person ("Fatimah", "she").

FACTS ABOUT FATIMAH:
${BIO_CONTEXT}`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "Server is not configured with an API key." });
    return;
  }

  try {
    const body = (req.body ?? {}) as { question?: unknown; history?: unknown };
    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (!question) {
      res.status(400).json({ error: "Missing question." });
      return;
    }

    // Sanitize the optional conversation history: keep the last few well-formed,
    // alternating turns and make sure the sequence starts with a user message.
    const rawHistory = Array.isArray(body.history) ? (body.history as unknown[]) : [];
    let history: ChatMessage[] = rawHistory
      .filter(
        (m): m is ChatMessage =>
          !!m &&
          typeof m === "object" &&
          ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
          typeof (m as ChatMessage).content === "string" &&
          (m as ChatMessage).content.trim().length > 0
      )
      .slice(-6);
    while (history.length && history[0].role !== "user") history = history.slice(1);

    const messages = [...history, { role: "user" as const, content: question }];

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: SYSTEM,
      messages,
    });

    const answer = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    res.status(200).json({ answer });
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status ?? 502 : 500;
    console.error("ask handler error:", err);
    res.status(status).json({ error: "Could not reach the assistant right now." });
  }
}
