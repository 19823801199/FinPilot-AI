"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface2 text-ink border border-rule",
        accent: "bg-accent/15 text-accent border border-accent/20",
        accent2: "bg-accent2/15 text-accent2 border border-accent2/20",
        accent3: "bg-accent3/15 text-accent3 border border-accent3/20",
        success: "bg-success/15 text-success border border-success/20",
        danger: "bg-danger/15 text-danger border border-danger/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot, children, ...props }, ref) => {
    const dotColors: Record<string, string> = {
      default: "bg-muted",
      accent: "bg-accent",
      accent2: "bg-accent2",
      accent3: "bg-accent3",
      success: "bg-success",
      danger: "bg-danger",
    };

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              dotColors[variant ?? "default"],
            )}
          />
        )}
        {children}
      </span>
    );
  },
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
