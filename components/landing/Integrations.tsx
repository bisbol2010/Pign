import {
  Slack,
  Cloud,
  Boxes,
  FileText,
  Mail,
  MessageSquare,
  Zap,
  Activity,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

/**
 * Integrations section — Figma node `1240:473` (1440 × 1046).
 *
 * 9 brand cards in a 4 + 3 + 2 layout separated by hairline white rules:
 *
 *   Row 1 (4 small cards): Slack, Google Drive, Dropbox, Notion
 *   Row 2 (3 small cards): Gmail, Microsoft Teams, Zapier
 *   Row 3 (2 wide cards): Linear, Asana
 *
 * Per open decision #1 the placeholder "Slack × 9" content from Figma is
 * replaced with the agreed brand list. Icons use lucide-react monochrome
 * marks to match Figma's white silhouette treatment.
 */

type Integration = {
  name: string;
  description: string;
  icon: LucideIcon;
};

type IntegrationRow = {
  cards: Integration[];
  variant: "small" | "wide";
};

const rows: IntegrationRow[] = [
  {
    variant: "small",
    cards: [
      {
        name: "Slack",
        description: "Drop incoming letters into the right channel automatically.",
        icon: Slack,
      },
      {
        name: "Google Drive",
        description: "Mirror selected folders both ways with end-to-end checks.",
        icon: Cloud,
      },
      {
        name: "Dropbox",
        description: "Sync important documents from any Dropbox folder.",
        icon: Boxes,
      },
      {
        name: "Notion",
        description: "Embed verified documents in your pages and tables.",
        icon: FileText,
      },
    ],
  },
  {
    variant: "small",
    cards: [
      {
        name: "Gmail",
        description: "Forward attachments straight from your inbox to Pign.",
        icon: Mail,
      },
      {
        name: "Microsoft Teams",
        description: "Share verified files inside a Teams channel in one tap.",
        icon: MessageSquare,
      },
      {
        name: "Zapier",
        description: "Wire any app to Pign with no-code automation flows.",
        icon: Zap,
      },
    ],
  },
  {
    variant: "wide",
    cards: [
      {
        name: "Linear",
        description:
          "Attach decision letters and approvals directly to the issues they unblock.",
        icon: Activity,
      },
      {
        name: "Asana",
        description:
          "Tie every project task to the documents that prove it was done.",
        icon: CheckCircle2,
      },
    ],
  },
];

function SmallCard({ name, description, icon: Icon }: Integration) {
  return (
    <article className="flex flex-col items-start gap-[32px] px-[56px] py-[40px]">
      <div className="flex flex-col items-center gap-[23px]">
        <span className="flex h-[48px] w-[48px] items-center justify-center text-white">
          <Icon size={32} strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="text-[24px] font-medium leading-[1] tracking-[-0.01em] text-white">
          {name}
        </h3>
      </div>
      <p className="w-[300px] max-w-full text-[clamp(16px,1.6vw,24px)] font-medium leading-[1.25] text-white">
        {description}
      </p>
    </article>
  );
}

function WideCard({ name, description, icon: Icon }: Integration) {
  return (
    <article className="flex items-center gap-[64px] px-[56px] py-[40px]">
      <div className="flex shrink-0 flex-col items-center gap-[23px]">
        <span className="flex h-[48px] w-[48px] items-center justify-center text-white">
          <Icon size={32} strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="text-[24px] font-medium leading-[1] tracking-[-0.01em] text-white">
          {name}
        </h3>
      </div>
      <p className="w-[505px] max-w-full text-[clamp(16px,1.6vw,24px)] font-medium leading-[1.3] text-white">
        {description}
      </p>
    </article>
  );
}

export function Integrations() {
  return (
    <section
      className="relative bg-surface-ink text-white"
      aria-labelledby="integrations-heading"
    >
      <div className="mx-auto max-w-[1440px] pt-[80px]">
        <h2
          id="integrations-heading"
          className="px-[56px] text-[clamp(32px,5vw,56px)] font-medium leading-[1.1] text-[#F7F8F9]"
        >
          <span className="block max-w-[992px]">
            Integrate Pign with your favourite tools to get the most out of it
          </span>
        </h2>

        {/* Grid with hairline separators between rows + between cards */}
        <div className="mt-[176px] border-t border-white/30">
          {rows.map((row, rIdx) => (
            <div
              key={rIdx}
              className={[
                "grid divide-x divide-white/30",
                row.variant === "small" && row.cards.length === 4
                  ? "grid-cols-4"
                  : "",
                row.variant === "small" && row.cards.length === 3
                  ? "grid-cols-3"
                  : "",
                row.variant === "wide" ? "grid-cols-2" : "",
                rIdx < rows.length - 1 ? "border-b border-white/30" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {row.cards.map((card) =>
                row.variant === "wide" ? (
                  <WideCard key={card.name} {...card} />
                ) : (
                  <SmallCard key={card.name} {...card} />
                )
              )}
            </div>
          ))}
          {/* Closing rule below last row */}
          <div className="h-px w-full border-b border-white/30" />
        </div>
      </div>
    </section>
  );
}
