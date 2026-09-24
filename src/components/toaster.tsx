import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Wraps sonner's Toaster with InvAI theme tokens. Mount once near the app root
 * (inside `AppShell` or the router's root route) and call `toast(...)` from "sonner"
 * anywhere below it.
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
