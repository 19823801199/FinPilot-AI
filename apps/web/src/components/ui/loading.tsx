import { Loader2 } from "lucide-react";

export interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export function Loading({
  fullScreen = true,
  text = "加载中...",
}: LoadingProps) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen items-center justify-center bg-bg"
          : "flex items-center justify-center py-12"
      }
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        {text && <span className="text-sm text-muted">{text}</span>}
      </div>
    </div>
  );
}
