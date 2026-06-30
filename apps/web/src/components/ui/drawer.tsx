"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  placement?: "left" | "right";
  width?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  placement = "right",
  width = "380px",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: DrawerProps) {
  // ESC to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const placementClasses =
    placement === "left" ? "left-0 h-full border-r" : "right-0 h-full border-l";

  const slideAnimation =
    placement === "left"
      ? "animate-in slide-in-from-left duration-300"
      : "animate-in slide-in-from-right duration-300";

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      {/* Drawer Content */}
      <div
        className={cn(
          "absolute top-0 bg-surface shadow-2xl flex flex-col border-rule",
          placementClasses,
          slideAnimation,
          className,
        )}
        style={{ width }}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-rule/60 shrink-0">
            {title && (
              <h2 className="text-lg font-semibold text-ink">{title}</h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="shrink-0 px-5 py-4 border-t border-rule/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
