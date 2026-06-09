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
      return (
        <span className="relative inline-flex group">
          <Chip><LogoImg src="/logos/openai.png" alt="OpenAI" h={20} /></Chip>
          {/* Hover to reveal OpenAI's products */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-30 hidden group-hover:flex">
            <span className="flex flex-col gap-2 p-2 rounded-xl bg-white dark:bg-[#1f1f21] border border-gray-200 dark:border-white/10 shadow-xl">
              <PartnerWordmark id="chatgpt" />
              <PartnerWordmark id="codex" />
            </span>
          </span>
        </span>
      );
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
      return <Chip><LogoImg src="/logos/lovable-wordmark.png" alt="Lovable" h={18} /></Chip>;
    case "quillbot":
      return <Chip><LogoImg src="/logos/quillbot-wordmark.png" alt="QuillBot" h={24} /></Chip>;
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
      return <Chip><LogoImg src="/logos/soundcore.webp" alt="soundcore" h={18} /></Chip>;
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
      return <Chip><LogoImg src="/logos/extra-gum.svg" alt="Extra" h={26} /></Chip>;
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
        <Chip>
          <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 700, fontSize: 15, color: "#0d0d0d", letterSpacing: "-0.01em" }} className="dark:!text-gray-100">
            Five Star
          </span>
        </Chip>
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
      return <Chip><LogoImg src="/logos/kraken.webp" alt="Kraken" h={20} /></Chip>;

    default:
      return null;
  }
}
