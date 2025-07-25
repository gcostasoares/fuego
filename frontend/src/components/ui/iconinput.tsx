import * as React from "react";

import { cn } from "@/lib/utils";

const IconInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { left: any }
>(({ className, left, type, ...props }, ref) => {
  return (
    <div className="relative h-10 w-full">
      {left}
      {/*  */}
      <input
        type={type}
        className={cn(
          className,
          "flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
IconInput.displayName = "Input";

export { IconInput };
