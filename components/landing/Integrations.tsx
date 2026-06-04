import { SectionShell } from "./SectionShell";
import { INTEGRATION_ROWS, type IntegrationItem } from "./integrations-data";

function IntegrationCard({
  name,
  description,
  logoSrc,
  logoAlt,
  comingSoon,
}: IntegrationItem) {
  return (
    <article className="flex h-full flex-col items-start gap-6 border border-white/20 bg-white/[0.02] p-6 md:p-7">
      <div className="flex min-h-[44px] items-center">
        <img src={logoSrc} alt={logoAlt} className="h-7 w-auto opacity-95" />
      </div>
      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[22px] font-medium leading-tight text-white">{name}</h3>
          {comingSoon && (
            <span className="rounded-full border border-white/30 px-2 py-0.5 text-[12px] font-medium text-white/85">
              Coming soon
            </span>
          )}
        </div>
        <p className="text-[16px] leading-relaxed text-white/80">{description}</p>
      </div>
    </article>
  );
}

export function Integrations() {
  return (
    <section
      className="relative bg-surface-ink text-white"
      aria-labelledby="integrations-heading"
    >
      <SectionShell
        gutter="56"
        className="pb-[80px] pt-[80px] min-[1440px]:pb-[112px] min-[1440px]:pt-[96px]"
      >
        <header className="flex flex-col items-start gap-6">
          <img
            src="/landing/mailbox-illustration.svg"
            alt=""
            aria-hidden
            className="h-[96px] w-[108px] -rotate-[8deg]"
          />
          <h2
            id="integrations-heading"
            className="max-w-[920px] text-left text-[clamp(32px,5vw,56px)] font-medium leading-[1.1] text-[#F7F8F9]"
          >
            Connect Pign to the tools you already use
          </h2>
          <p className="max-w-[860px] text-left text-[clamp(16px,1.8vw,22px)] leading-[1.4] text-white/80">
            Route incoming letters to the right channel, attach verified documents
            to your work, and automate it all — with native integrations and an
            open API.
          </p>
        </header>

        <div className="mt-10 flex flex-col gap-4 md:mt-12 min-[1440px]:mt-16">
          {INTEGRATION_ROWS.map((row, rowIndex) => (
            <div
              key={`integration-row-${rowIndex}`}
              className={
                row.length === 4
                  ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
                  : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              }
            >
              {row.map((item) => (
                <IntegrationCard key={item.id} {...item} />
              ))}
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
