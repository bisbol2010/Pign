type SectionDividerProps = {
  className?: string;
};

export function SectionDivider({ className = "" }: SectionDividerProps) {
  return (
    <div
      aria-hidden
      className={`relative left-1/2 w-screen -translate-x-1/2 border-t border-white/30 ${className}`}
    />
  );
}
