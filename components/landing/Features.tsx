import Image from "next/image";
import { SectionShell } from "./SectionShell";

const pillLabels = [
  "Smart storage",
  "File verification",
  "Secure & encrypted",
];

export function Features() {
  return (
    <section
      id="features"
      className="relative bg-surface-ink text-white"
      aria-labelledby="features-heading"
    >
      <div className="relative mx-auto max-w-[1440px] py-[80px]">
        <SectionShell gutter="64">
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <h2
              id="features-heading"
              className="max-w-[1100px] font-medium leading-[1.05] text-white text-[clamp(40px,7vw,88px)]"
            >
              Everything you need, less
              <br />
              of what you don&rsquo;t
            </h2>
            <Image
              src="/landing/mailbox-illustration.svg"
              alt=""
              aria-hidden
              width={128}
              height={113}
              className="h-[113px] w-[128px] shrink-0 -rotate-[8deg] max-lg:mx-auto min-[1440px]:block"
            />
          </div>

          <div className="mt-[60px] flex flex-wrap gap-x-[80px] gap-y-[24px]">
            {pillLabels.map((label) => (
              <div key={label} className="flex items-center gap-[11px]">
                <span
                  aria-hidden
                  className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white"
                >
                  <span className="h-[14px] w-[14px] rounded-full bg-pign-black" />
                </span>
                <span className="text-[24px] font-medium tracking-[-0.01em] text-white">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </SectionShell>

        <div className="relative mx-auto mt-[60px] min-h-[480px] w-full max-w-[1295px] overflow-hidden px-6 min-[1440px]:h-[647px] min-[1440px]:px-0">
          <Image
            src="/landing/features-wave-bg.svg"
            alt=""
            aria-hidden
            width={1295}
            height={597}
            className="pointer-events-none absolute inset-x-0 top-0 h-auto w-full select-none"
          />

          <div
            aria-hidden
            className="pointer-events-none relative mx-auto mb-8 flex justify-center min-[1440px]:absolute min-[1440px]:left-[110px] min-[1440px]:top-[125px] min-[1440px]:mx-0 min-[1440px]:mb-0 min-[1440px]:block"
          >
            <div className="relative h-[320px] w-[280px] min-[1440px]:h-auto min-[1440px]:w-auto">
              <Image
                src="/landing/features-folder.svg"
                alt=""
                width={105}
                height={114}
                className="absolute left-0 top-0 h-[120px] w-[120px] rotate-[12deg] min-[1440px]:-left-2 min-[1440px]:h-[173px] min-[1440px]:w-[170px]"
              />
              <Image
                src="/landing/features-document.svg"
                alt=""
                width={105}
                height={114}
                className="absolute bottom-0 right-0 h-[100px] w-[100px] -rotate-[6deg] min-[1440px]:left-[40px] min-[1440px]:top-[240px] min-[1440px]:h-[150px] min-[1440px]:w-[150px]"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-8 px-2 min-[1440px]:absolute min-[1440px]:left-[580px] min-[1440px]:top-[142px] min-[1440px]:max-w-[660px] min-[1440px]:px-0">
            <h3 className="text-[clamp(36px,5vw,60px)] font-medium leading-none tracking-[-0.01em]">
              Smart storage
            </h3>
            <p className="text-[clamp(20px,2.5vw,32px)] font-light leading-[1.43] text-white">
              Smart file management system for saving important files,
              efficient organization and easy access to items, saving time
              and reducing clutter.
            </p>
          </div>

          <Image
            src="/landing/curved-arrow.svg"
            alt=""
            aria-hidden
            width={195}
            height={67}
            className="pointer-events-none absolute left-1/2 top-[360px] hidden h-[67px] w-[195px] -translate-x-1/2 -rotate-[6deg] min-[1440px]:left-[330px] min-[1440px]:top-[440px] min-[1440px]:block min-[1440px]:translate-x-0"
          />

          <div className="relative z-10 mt-8 px-2 min-[1440px]:absolute min-[1440px]:left-[580px] min-[1440px]:top-[540px] min-[1440px]:mt-0 min-[1440px]:w-[634px] min-[1440px]:px-0">
            <p className="text-[clamp(28px,4vw,48px)] font-medium leading-none tracking-[-0.01em] text-white/40">
              File verification
            </p>
            <p className="mt-[23px] text-[clamp(18px,2.2vw,32px)] font-light leading-[1.43] text-white/10">
              Junk filtering for the efficient and effective removal of
              unwanted or spam messages from your inbox.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
