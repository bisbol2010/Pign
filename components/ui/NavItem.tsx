import Link from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface NavItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  icon: ReactNode;
  label: ReactNode;
  active?: boolean;
  badge?: ReactNode;
}

export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ href, icon, label, active = false, badge, className, ...props }, ref) => (
    <Link
      ref={ref}
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-grey-7 font-medium text-pign-black"
          : "text-grey-3 hover:bg-grey-7 hover:text-pign-black",
        className
      )}
      {...props}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-pign-black"
        />
      )}
      <span className="flex shrink-0 items-center">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="ml-auto rounded-full bg-pign-black px-1.5 py-0.5 text-[10px] font-medium text-white">
          {badge}
        </span>
      )}
    </Link>
  )
);
NavItem.displayName = "NavItem";
