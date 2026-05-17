import type { ReactNode } from "react";

export type PartnerId =
  | "microsoft"
  | "openai"
  | "codex"
  | "chatgpt"
  | "adobe"
  | "notion"
  | "clorox"
  | "good-culture"
  | "chiquita"
  | "five-star";

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center min-h-10 px-3.5 py-2 rounded-xl bg-white dark:bg-[#2a2a2c] border border-gray-200/90 dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none">
      {children}
    </span>
  );
}

export function PartnerWordmark({ id }: { id: PartnerId }) {
  const h = "block h-[18px] w-auto max-w-[148px] shrink-0";

  switch (id) {
    case "microsoft":
      return (
        <Chip>
          <svg className={h} viewBox="0 0 152 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="10.5" height="10.5" fill="#F65314" rx="0.5" />
            <rect x="11.7" width="10.5" height="10.5" fill="#7FBA00" rx="0.5" />
            <rect y="11.7" width="10.5" height="10.5" fill="#00A4EF" rx="0.5" />
            <rect x="11.7" y="11.7" width="10.5" height="10.5" fill="#FFB900" rx="0.5" />
            <text
              x="29"
              y="15.5"
              fill="#737373"
              className="dark:fill-[#c8c8cc]"
              style={{ fontFamily: "Segoe UI, system-ui, sans-serif", fontSize: "13.5px", fontWeight: 600 }}
            >
              Microsoft
            </text>
          </svg>
        </Chip>
      );
    case "openai":
      return (
        <Chip>
          <svg className={h} viewBox="0 0 72 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <text
              x="0"
              y="13.5"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "system-ui, sans-serif", fontSize: "14px", fontWeight: 650, letterSpacing: "-0.045em" }}
            >
              OpenAI
            </text>
          </svg>
        </Chip>
      );
    case "codex":
      return (
        <Chip>
          <svg className={h} viewBox="0 0 54 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <text
              x="0"
              y="12.5"
              fill="#12a37c"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "13px", fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              Codex
            </text>
          </svg>
        </Chip>
      );
    case "chatgpt":
      return (
        <Chip>
          <svg className={`${h} max-w-[132px]`} viewBox="0 0 108 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="10" cy="10" r="7.5" fill="#10A37F" opacity="0.2" />
            <circle cx="10" cy="10" r="4.5" fill="#10A37F" />
            <text x="21" y="14.5" fill="#10A37F" style={{ fontFamily: "system-ui, sans-serif", fontSize: "13px", fontWeight: 650, letterSpacing: "-0.02em" }}>
              ChatGPT
            </text>
          </svg>
        </Chip>
      );
    case "adobe":
      return (
        <Chip>
          <svg className={h} viewBox="0 0 78 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="22" height="22" rx="3" fill="#FA0F00" />
            <text x="11" y="16.5" textAnchor="middle" fill="#fff" style={{ fontFamily: "system-ui, sans-serif", fontSize: "13px", fontWeight: 800 }}>
              A
            </text>
            <text x="26" y="15.8" fill="#2D2D2D" className="dark:fill-[#e8e8ea]" style={{ fontFamily: "system-ui, sans-serif", fontSize: "14px", fontWeight: 700 }}>
              Adobe
            </text>
          </svg>
        </Chip>
      );
    case "notion":
      return (
        <Chip>
          <svg className={`${h} max-w-[132px]`} viewBox="0 0 116 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path fill="currentColor" className="text-gray-900 dark:text-gray-100" d="M4 4h6v6H4V4Zm8 0h6v6h-6V4ZM4 12h6v6H4v-6Zm8 0h6v6h-6v-6Z" opacity="0.95" />
            <text x="22" y="15.5" fill="currentColor" className="text-gray-900 dark:text-gray-100" style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: "14px", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Notion
            </text>
          </svg>
        </Chip>
      );
    case "clorox":
      return (
        <Chip>
          <svg className={h} viewBox="0 0 96 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <text
              x="0"
              y="14"
              fill="#0066B3"
              style={{ fontFamily: "Arial Black, Helvetica Neue, sans-serif", fontSize: "14px", fontWeight: 900, letterSpacing: "0.02em" }}
            >
              CLOROX
            </text>
          </svg>
        </Chip>
      );
    case "good-culture":
      return (
        <Chip>
          <svg className={`${h} max-w-[148px]`} viewBox="0 0 132 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <text
              x="2"
              y="15"
              fill="#1a1a1a"
              className="dark:fill-[#f0f0f2]"
              style={{ fontFamily: "Georgia, Times New Roman, serif", fontSize: "13px", fontStyle: "italic", fontWeight: 600 }}
            >
              good culture
            </text>
          </svg>
        </Chip>
      );
    case "chiquita":
      return (
        <Chip>
          <svg className={`${h} max-w-[132px]`} viewBox="0 0 118 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path fill="#FFE135" d="M4 14c8-6 28-10 36-4 2 2 3 5 2 8-10 3-24 2-34-2l-4-2z" opacity="0.95" />
            <text x="8" y="17" fill="#003DA5" style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: "15px", fontStyle: "italic", fontWeight: 700 }}>
              Chiquita
            </text>
          </svg>
        </Chip>
      );
    case "five-star":
      return (
        <Chip>
          <svg className={`${h} max-w-[176px]`} viewBox="0 0 178 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path fill="#E31837" d="m11 2.5 2.4 5 5.5.8-4 4 1 5.5L11 15.8 6.1 18l1-5.5-4-4 5.5-.8L11 2.5Z" />
            <text x="22" y="15" fill="#231F20" className="dark:fill-[#e8e8ea]" style={{ fontFamily: "Arial Black, Helvetica Neue, sans-serif", fontSize: "11px", fontWeight: 900 }}>
              Five Star
            </text>
            <text x="76" y="15" fill="#E31837" style={{ fontFamily: "system-ui, sans-serif", fontSize: "11px", fontWeight: 700 }}>
              ®
            </text>
            <text x="84" y="14.5" fill="#555" className="dark:fill-[#aaa]" style={{ fontFamily: "system-ui, sans-serif", fontSize: "9.5px", fontWeight: 600 }}>
              notebooks
            </text>
          </svg>
        </Chip>
      );
    default:
      return null;
  }
}
