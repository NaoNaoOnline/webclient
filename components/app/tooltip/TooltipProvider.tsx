import { ReactNode } from "react";

import * as Tooltip from "@radix-ui/react-tooltip";

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Tooltip.Provider
      delayDuration={200}
    >
      {children}
    </Tooltip.Provider>
  );
};
