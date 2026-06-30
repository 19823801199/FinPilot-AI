"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-[10px] border border-rule bg-surface text-ink transition-all duration-200",
  {
    variants: {
      variant: {
        default: "shadow-sm",
        highlighted: "shadow-md border-accent/30 ring-1 ring-accent/20",
        bordered: "border-rule bg-transparent shadow-none",
      },
      hover: {
        true: "hover:border-muted/50 hover:shadow-md hover:-translate-y-0.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: false,
    },
  },
);

export interface CardProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof cardVariants> {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      hover,
      title,
      footer,
      headerAction,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover }), className)}
        {...props}
      >
        {(title || headerAction) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-rule/60">
            {title && (
              <h3 className="text-base font-semibold text-ink">{title}</h3>
            )}
            {headerAction && <div>{headerAction}</div>}
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-rule/60 bg-surface2/30 rounded-b-[10px]">
            {footer}
          </div>
        )}
      </div>
    );
  },
);
Card.displayName = "Card";

export { Card, cardVariants };
