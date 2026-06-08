import type { ReactNode } from "react";

type EmptyStateLayoutProps = {
  illustration: ReactNode;
  title: string;
  subtitle: string;
  hint?: string;
  action: ReactNode;
};

/** Centered empty-state block — spacing/type from Figma frames 2390:2350 / 2390:2584. */
export function EmptyStateLayout({
  illustration,
  title,
  subtitle,
  hint,
  action,
}: EmptyStateLayoutProps) {
  return (
    <div className="flex flex-col items-center px-[30px] pb-[48px] pt-[20px]">
      <div className="flex h-[360px] w-full max-w-[540px] items-center justify-center text-pign-black">
        {illustration}
      </div>
      <div className="flex flex-col items-center gap-[26px] text-center">
        <p className="text-[18px] font-medium text-pign-black/90">{title}</p>
        <p className="text-[18px] font-medium text-pign-black/90">{subtitle}</p>
      </div>
      {hint ? (
        <p className="mt-[24px] text-center text-[14px] text-pign-black/60">
          {hint}
        </p>
      ) : null}
      <div className="mt-[30px]">{action}</div>
    </div>
  );
}
