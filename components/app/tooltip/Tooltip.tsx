import { ReactNode } from "react";

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps {
  children: ReactNode;
  desc: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side: "top" | "right" | "bottom" | "left" | undefined;
}

export function Tooltip({
  children,
  desc,
  open,
  defaultOpen,
  onOpenChange,
  side,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger
        className="flex items-center"
      >

        {children}

      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        className={`
          max-w-[250px] px-2 py-1 text-xs font-medium font-mono rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900
          data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade
          data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade
          data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade
          data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade
        `}
        align="center"
        side={side}
        sideOffset={5}
      >

        {desc}

        <TooltipPrimitive.Arrow
          className="w-3 h-1 fill-gray-800 dark:fill-gray-200"
        />

      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
