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
import { SectionShell } from "./SectionShell";

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

function gridColsClass(row: IntegrationRow): string {
  if (row.variant === "wide") {
    return "grid-cols-1 md:grid-cols-2";
  }
  if (row.cards.length === 4) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  }
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

function SmallCard({ name, description, icon: Icon }: Integration) {
  return (
    <article className="flex flex-col items-start gap-[32px] px-8 py-10 min-[1440px]:px-[56px] min-[1440px]:py-[40px]">
      <div className="flex flex-col items-center gap-[23px]">
        <span className="flex h-[48px] w-[48px] items-center justify-center text-white">
          <Icon size={32} strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="text-[24px] font-medium leading-none tracking-[-0.01em] text-white">
          {name}
        </h3>
      </div>
      <p className="max-w-full text-[clamp(16px,1.6vw,24px)] font-medium leading-[1.25] text-white min-[1440px]:w-[300px]">
        {description}
      </p>
    </article>
  );
}

function WideCard({ name, description, icon: Icon }: Integration) {
  return (
    <article className="flex flex-col gap-8 px-8 py-10 min-[1440px]:flex-row min-[1440px]:items-center min-[1440px]:gap-[64px] min-[1440px]:px-[56px] min-[1440px]:py-[40px]">
      <div className="flex shrink-0 flex-col items-center gap-[23px]">
        <span className="flex h-[48px] w-[48px] items-center justify-center text-white">
          <Icon size={32} strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="text-[24px] font-medium leading-none tracking-[-0.01em] text-white">
          {name}
        </h3>
      </div>
      <p className="max-w-full text-[clamp(16px,1.6vw,24px)] font-medium leading-[1.3] text-white min-[1440px]:w-[505px]">
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
        <SectionShell gutter="56">
          <h2
            id="integrations-heading"
            className="text-[clamp(32px,5vw,56px)] font-medium leading-[1.1] text-[#F7F8F9]"
          >
            <span className="block max-w-[992px]">
              Integrate Pign with your favourite tools to get the most out of it
            </span>
          </h2>
        </SectionShell>

        <div className="mt-16 border-t border-white/30 min-[1440px]:mt-[176px]">
          {rows.map((row, rIdx) => (
            <div
              key={rIdx}
              className={[
                "grid divide-y divide-white/30 lg:divide-x lg:divide-y-0",
                gridColsClass(row),
                rIdx < rows.length - 1 ? "border-b border-white/30" : "",
              ].join(" ")}
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
          <div className="h-px w-full border-b border-white/30" />
        </div>
      </div>
    </section>
  );
}
