"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "avatar" | "list" | "circle";
  lines?: number;
  className?: string;
}

const SkeletonBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-[8px] bg-surface2/60", className)}
      {...props}
    />
  );
});
SkeletonBase.displayName = "SkeletonBase";

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "text", lines = 3, className, ...props }, ref) => {
    if (variant === "text") {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col gap-2", className)}
          {...props}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonBase
              key={i}
              className={cn(
                "h-4",
                i === lines - 1 && lines > 1 ? "w-3/4" : "w-full",
              )}
            />
          ))}
        </div>
      );
    }

    if (variant === "card") {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-[10px] border border-rule/40 p-5 space-y-4",
            className,
          )}
          {...props}
        >
          <SkeletonBase className="h-5 w-1/3" />
          <SkeletonBase className="h-24 w-full" />
          <div className="flex gap-2">
            <SkeletonBase className="h-8 w-20" />
            <SkeletonBase className="h-8 w-20" />
          </div>
        </div>
      );
    }

    if (variant === "avatar") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-3", className)}
          {...props}
        >
          <SkeletonBase className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <SkeletonBase className="h-4 w-24" />
            <SkeletonBase className="h-3 w-16" />
          </div>
        </div>
      );
    }

    if (variant === "circle") {
      return (
        <SkeletonBase
          ref={ref}
          className={cn("h-10 w-10 rounded-full", className)}
          {...props}
        />
      );
    }

    if (variant === "list") {
      return (
        <div ref={ref} className={cn("space-y-3", className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBase className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonBase className="h-4 w-full" />
                <SkeletonBase className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <SkeletonBase ref={ref} className={className} {...props} />;
  },
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
