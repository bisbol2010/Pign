import type { ReactNode } from "react";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  /** Horizontal padding at desktop (Figma gutter). */
  gutter?: "56" | "64" | "benefits";
};

const gutterClass: Record<NonNullable<SectionShellProps["gutter"]>, string> = {
  "56": "px-[24px] md:px-[40px] min-[1440px]:px-[56px]",
  "64": "px-[24px] md:px-[40px] min-[1440px]:px-[64px]",
  benefits:
    "px-[24px] md:px-[40px] lg:px-[80px] min-[1440px]:px-[167px]",
};

export function SectionShell({
  children,
  className = "",
  gutter = "56",
}: SectionShellProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] ${gutterClass[gutter]} ${className}`}
    >
      {children}
    </div>
  );
}
