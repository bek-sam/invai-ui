import type { ConfidenceBand } from "@invai/contracts";
import type { VariantProps } from "class-variance-authority";
import { CircleHelp, FlaskConical, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge, type badgeVariants } from "../components/badge";
import { cn } from "../lib/cn";

type Tone = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

/**
 * Tone and icon per confidence band. Never color alone: the icon and the band's text always ride
 * together, so a colorblind or screen-reader user still gets the meaning.
 */
const BAND_VARIANT: Record<ConfidenceBand, Tone> = {
  high: "success",
  medium: "warning",
  low: "outline",
};

const BAND_ICON: Record<ConfidenceBand, typeof ShieldCheck> = {
  high: ShieldCheck,
  medium: FlaskConical,
  low: CircleHelp,
};

export interface ConfidenceBadgeProps {
  band: ConfidenceBand;
  /** Overrides the translated band text (the icon and tone still come from `band`). */
  label?: string;
  className?: string;
}

/**
 * Badge for a market-signal confidence band (`@invai/contracts` `ConfidenceBand`): high -> success
 * + shield-check, medium -> warning + flask, low -> outline + question mark. The icon is
 * `aria-hidden`; the text is always shown and is the accessible name.
 */
export function ConfidenceBadge({ band, label, className }: ConfidenceBadgeProps) {
  const { t } = useTranslation();
  const Icon = BAND_ICON[band];
  const text =
    label ??
    t(
      `confidenceBand.${band}`,
      {
        high: "High confidence",
        medium: "Medium confidence: test it",
        low: "Not enough data",
      }[band],
    );
  return (
    <Badge variant={BAND_VARIANT[band]} className={cn(className)}>
      <Icon className="size-3" aria-hidden />
      {text}
    </Badge>
  );
}
