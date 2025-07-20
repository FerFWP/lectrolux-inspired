
import * as React from "react";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count?: number;
  status?: "success" | "warning" | "error" | "info";
  pulse?: boolean;
  className?: string;
}

export function NotificationBadge({ 
  count, 
  status = "info", 
  pulse = false, 
  className 
}: NotificationBadgeProps) {
  if (!count || count === 0) return null;

  const statusColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500", 
    error: "bg-red-500",
    info: "bg-blue-500"
  };

  return (
    <span 
      className={cn(
        "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white",
        statusColors[status],
        pulse && "animate-pulse",
        count > 99 ? "px-1" : "",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
