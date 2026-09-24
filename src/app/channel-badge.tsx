import type { Channel } from "@invai/contracts";
import type { LucideIcon } from "lucide-react";
import {
  Globe,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Table as TableIcon,
  Truck,
} from "lucide-react";
import { cn } from "../lib/cn";

/** Neutral icon per sales channel. No brand logos. */
const CHANNEL_ICON: Record<Channel, LucideIcon> = {
  etsy: Sparkles,
  amazon: ShoppingCart,
  shopify: ShoppingBag,
  // lucide-react has no channel-neutral icon that reads well for TikTok; Globe avoids implying a brand mark.
  tiktok: Globe,
  walmart: Store,
  ebay: TableIcon,
  csv: Truck,
};

const CHANNEL_LABEL: Record<Channel, string> = {
  etsy: "Etsy",
  amazon: "Amazon",
  shopify: "Shopify",
  tiktok: "TikTok",
  walmart: "Walmart",
  ebay: "eBay",
  csv: "CSV",
};

export interface ChannelBadgeProps {
  channel: Channel;
  className?: string;
}

/** Neutral text+icon badge for a sales channel (etsy, amazon, shopify, tiktok, walmart, ebay, csv). */
export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  const Icon = CHANNEL_ICON[channel];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {CHANNEL_LABEL[channel]}
    </span>
  );
}
