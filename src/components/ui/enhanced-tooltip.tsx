
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  description?: string;
  shortcut?: string;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
}

export function EnhancedTooltip({ 
  children, 
  content, 
  description, 
  shortcut, 
  side = "right", 
  delay = 300 
}: EnhancedTooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={delay}>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={8}
        className={cn(
          "z-[220] max-w-xs rounded-lg border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        )}
      >
        <div className="space-y-1">
          <p className="font-medium text-sm">{content}</p>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          )}
          {shortcut && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Atalho:</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {shortcut}
              </kbd>
            </div>
          )}
        </div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
