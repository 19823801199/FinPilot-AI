"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotificationStore,
  type NotificationType,
} from "@/store/notification-store";

const iconMap: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-success" />,
  error: <AlertCircle className="h-5 w-5 text-danger" />,
  warning: <AlertTriangle className="h-5 w-5 text-accent3" />,
  info: <Info className="h-5 w-5 text-accent2" />,
};

const borderColors: Record<NotificationType, string> = {
  success: "border-success/30",
  error: "border-danger/30",
  warning: "border-accent3/30",
  info: "border-accent2/30",
};

const bgColors: Record<NotificationType, string> = {
  success: "bg-success/5",
  error: "bg-danger/5",
  warning: "bg-accent3/5",
  info: "bg-accent2/5",
};

export interface ToastItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  onClose?: (id: string) => void;
}

const TOAST_DURATION_MS = 3000;
const TOAST_PROGRESS_INTERVAL_MS = 30;

function ToastItem({ id, type, title, message, onClose }: ToastItemProps) {
  const [progress, setProgress] = React.useState(100);
  const duration = TOAST_DURATION_MS;

  React.useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, TOAST_PROGRESS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className={cn(
        "relative w-[360px] rounded-[10px] border shadow-lg overflow-hidden",
        "animate-in slide-in-from-right-full fade-in duration-300",
        borderColors[type],
        bgColors[type],
        "bg-surface",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 shrink-0">{iconMap[type]}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-ink">{title}</h4>
          {message && (
            <p className="mt-0.5 text-xs text-muted leading-relaxed">
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={() => onClose(id)}
            className="shrink-0 text-muted hover:text-ink transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-rule/30">
        <div
          className={cn("h-full transition-all duration-100 ease-linear", {
            "bg-success": type === "success",
            "bg-danger": type === "error",
            "bg-accent3": type === "warning",
            "bg-accent2": type === "info",
          })}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

export function ToastContainer({
  position = "top-right",
  className,
}: ToastContainerProps) {
  const { notifications, removeNotification } = useNotificationStore();

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (notifications.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-[100] flex flex-col gap-2",
        positionClasses[position],
        className,
      )}
    >
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}

export { ToastItem };
