import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { Button, type buttonVariants } from "../components/button";
import { cn } from "../lib/cn";

export interface BigButtonProps extends React.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: LucideIcon;
}

/** Floor-station button: the `floor` size preset (80px tall, 2xl type) for gloved thumbs on a tablet. */
export function BigButton({
  variant = "default",
  icon: Icon,
  className,
  children,
  ...props
}: BigButtonProps) {
  return (
    <Button variant={variant} size="floor" className={cn("w-full", className)} {...props}>
      {Icon && <Icon className="size-8" aria-hidden />}
      {children}
    </Button>
  );
}
