import Image from "next/image";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  initials?: string;
}

const sizeStyles: Record<AvatarSize, { wrap: string; text: string; px: number }> = {
  sm: { wrap: "h-6 w-6", text: "text-[10px] font-medium", px: 24 },
  md: { wrap: "h-8 w-8", text: "text-xs font-medium",     px: 32 },
  lg: { wrap: "h-12 w-12", text: "text-sm font-medium",   px: 48 },
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = "md", src, alt = "", initials, className, ...props }, ref) => {
    const styles = sizeStyles[size];
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-pign-black text-white",
          styles.wrap,
          styles.text,
          className
        )}
        {...props}
      >
        {src ? (
          <Image src={src} alt={alt} width={styles.px} height={styles.px} className="h-full w-full object-cover" />
        ) : (
          <span>{initials ?? "?"}</span>
        )}
      </span>
    );
  }
);
Avatar.displayName = "Avatar";
