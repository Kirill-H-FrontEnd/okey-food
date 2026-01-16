import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content bg-white min-h-[120px] max-h-[200px] w-full rounded-md border  px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-greySecondary/60 focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

        className
      )}
      {...props}
    />
  );
}

export { Textarea };
