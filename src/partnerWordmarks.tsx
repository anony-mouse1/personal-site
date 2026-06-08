import type { ReactNode } from "react";

export type PartnerId =
  // Tech
  | "microsoft"
  | "openai"
  | "codex"
  | "chatgpt"
  | "adobe"
  | "notion"
  | "lovable"
  | "quillbot"
  | "jobright"
  | "soundcore"
  | "whop"
  // Consumer goods
  | "clorox"
  | "good-culture"
  | "chiquita"
  | "maruchan"
  | "extra-gum"
  | "zevo"
  // Education
  | "five-star"
  | "lumiere-education"
  | "aceable"
  | "calkids"
  | "abe"
  // Finance
  | "webull"
  | "kraken";

function Chip({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 h-12 px-4 py-2 rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
        dark
          ? "bg-[#0c0c0c] border-[#0c0c0c]"
          : "bg-white dark:bg-[#2a2a2c] border-gray-200/90 dark:border-white/[0.08] dark:shadow-none"
      }`}
    >
      {children}
    </span>
  );
}

function LogoImg({ src, alt, h }: { src: string; alt: string; h: number }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ height: h }}
      className="block w-auto max-w-[160px] object-contain"
      draggable={false}
    />
  );
}

function IconAndName({
  src,
  name,
  iconSize = 22,
  font = "system-ui, sans-serif",
  weight = 600,
  fontSize = 15,
  color = "#0d0d0d",
  letterSpacing,
}: {
  src: string;
  name: string;
  iconSize?: number;
  font?: string;
  weight?: number;
  fontSize?: number;
  color?: string;
  letterSpacing?: string;
}) {
  return (
    <>
      <img
        src={src}
        alt=""
        style={{ height: iconSize, width: iconSize }}
        className="block object-contain flex-shrink-0"
        draggable={false}
      />
      <span
        style={{ fontFamily: font, fontWeight: weight, fontSize, color, letterSpacing }}
        className="dark:!text-gray-100 whitespace-nowrap"
      >
        {name}
      </span>
    </>
  );
}

export function PartnerWordmark({ id }: { id: PartnerId }) {
  switch (id) {
    /* ===== Tech ===== */
    case "microsoft":
      return <Chip><LogoImg src="/logos/microsoft.svg" alt="Microsoft" h={22} /></Chip>;
    case "openai":
      return <Chip><LogoImg src="/logos/openai.png" alt="OpenAI" h={20} /></Chip>;
    case "chatgpt":
      return (
        <Chip>
          <IconAndName src="/logos/chatgpt.svg" name="ChatGPT" iconSize={22} />
        </Chip>
      );
    case "codex":
      return (
        <Chip>
          <IconAndName
            src="/logos/openai.svg"
            name="Codex"
            iconSize={18}
            font="ui-monospace, SFMono-Regular, Menlo, monospace"
            weight={700}
            color="#10A37F"
          />
        </Chip>
      );
    case "adobe":
      return (
        <Chip>
          <img src="/logos/adobe.svg" alt="" style={{ height: 28 }} className="block w-auto object-contain" draggable={false} />
          <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 700, fontSize: 16, color: "#2D2D2D" }} className="dark:!text-gray-100">
            Adobe
          </span>
        </Chip>
      );
    case "notion":
      return (
        <Chip>
          <IconAndName
            src="/logos/notion.svg"
            name="Notion"
            iconSize={24}
            font="ui-serif, Georgia, 'Times New Roman', serif"
            fontSize={17}
            color="#191918"
            letterSpacing="-0.02em"
          />
        </Chip>
      );
    case "lovable":
      return (
        <Chip>
          <IconAndName
            src="/logos/lovable.svg"
            name="Lovable"
            iconSize={22}
            font="ui-serif, Georgia, serif"
            fontSize={16}
            color="#F25C54"
          />
        </Chip>
      );
    case "quillbot":
      return (
        <Chip>
          <IconAndName
            src="/logos/quillbot.png"
            name="QuillBot"
            iconSize={22}
            fontSize={15}
            color="#39855a"
          />
        </Chip>
      );
    case "jobright":
      return (
        <Chip>
          <IconAndName
            src="/logos/jobright.png"
            name="Jobright"
            iconSize={22}
            fontSize={15}
            color="#1f1f1f"
          />
        </Chip>
      );
    case "soundcore":
      return (
        <Chip>
          <IconAndName
            src="/logos/soundcore.png"
            name="soundcore"
            iconSize={22}
            weight={700}
            fontSize={15}
            color="#000"
            letterSpacing="-0.02em"
          />
        </Chip>
      );
    case "whop":
      return (
        <Chip>
          <IconAndName
            src="/logos/whop.png"
            name="Whop"
            iconSize={22}
            weight={700}
            fontSize={15}
            color="#FF6B2C"
          />
        </Chip>
      );

    /* ===== Consumer goods ===== */
    case "clorox":
      return <Chip><LogoImg src="/logos/clorox.svg" alt="Clorox" h={20} /></Chip>;
    case "chiquita":
      return <Chip><LogoImg src="/logos/chiquita.svg" alt="Chiquita" h={34} /></Chip>;
    case "good-culture":
      return (
        <Chip>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 600, fontSize: 18, color: "#1a1a1a", letterSpacing: "-0.01em" }} className="dark:!text-gray-100">
            good culture
          </span>
        </Chip>
      );
    case "maruchan":
      return (
        <Chip>
          <IconAndName
            src="/logos/maruchan.svg"
            name="Maruchan"
            iconSize={26}
            font="ui-serif, Georgia, serif"
            weight={700}
            fontSize={16}
            color="#E4002B"
          />
        </Chip>
      );
    case "extra-gum":
      return (
        <Chip>
          <IconAndName
            src="/logos/extra-gum.svg"
            name="EXTRA"
            iconSize={24}
            weight={900}
            fontSize={15}
            color="#005CAB"
            letterSpacing="0.02em"
          />
        </Chip>
      );
    case "zevo":
      return (
        <Chip>
          <IconAndName
            src="/logos/zevo.png"
            name="Zevo"
            iconSize={22}
            weight={700}
            fontSize={15}
            color="#00873E"
          />
        </Chip>
      );

    /* ===== Education ===== */
    case "five-star":
      return (
        <span className="inline-flex flex-col items-center justify-center h-12 px-3 py-1 rounded-xl bg-[#0c0c0c] border border-[#0c0c0c] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          <span style={{ fontFamily: "ui-serif, 'Times New Roman', Georgia, serif", fontWeight: 700, fontSize: 12, color: "white", letterSpacing: "0.14em", lineHeight: 1 }}>
            FIVE STAR
          </span>
          <span style={{ display: "flex", gap: 1, marginTop: 2 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="6" height="6" viewBox="0 0 12 12" aria-hidden>
                <path fill="#fff" d="M6 1l1.5 3.5 3.5.4-2.7 2.4.9 3.7L6 9.1 2.8 11l.9-3.7L1 4.9l3.5-.4z" />
              </svg>
            ))}
          </span>
          <span style={{ width: 38, height: 1.5, backgroundColor: "#d4a017", marginTop: 2 }} />
        </span>
      );
    case "lumiere-education":
      return (
        <Chip>
          <IconAndName
            src="/logos/lumiere-education.png"
            name="Lumiere Education"
            iconSize={22}
            font="ui-serif, Georgia, serif"
            weight={600}
            fontSize={14}
            color="#1a1a1a"
          />
        </Chip>
      );
    case "aceable":
      return (
        <Chip>
          <IconAndName
            src="/logos/aceable.png"
            name="Aceable"
            iconSize={22}
            weight={700}
            fontSize={15}
            color="#F26522"
          />
        </Chip>
      );
    case "calkids":
      return (
        <Chip>
          <IconAndName
            src="/logos/calkids.png"
            name="CalKIDS"
            iconSize={22}
            weight={700}
            fontSize={15}
            color="#1B3A6B"
          />
        </Chip>
      );
    case "abe":
      return (
        <Chip>
          <IconAndName
            src="/logos/abe.png"
            name="Abe"
            iconSize={22}
            weight={700}
            fontSize={16}
            color="#2C5282"
          />
        </Chip>
      );

    /* ===== Finance ===== */
    case "webull":
      return (
        <Chip>
          <IconAndName
            src="/logos/webull.png"
            name="Webull"
            iconSize={22}
            weight={700}
            fontSize={15}
            color="#0E6FFF"
          />
        </Chip>
      );
    case "kraken":
      return <Chip><LogoImg src="/logos/kraken.svg" alt="Kraken" h={22} /></Chip>;

    default:
      return null;
  }
}
