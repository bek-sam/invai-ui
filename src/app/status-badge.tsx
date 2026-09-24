import type { OrderItemState } from "@invai/contracts";
import { ORDER_ITEM_STATES } from "@invai/contracts";
import type { VariantProps } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { Badge, type badgeVariants } from "../components/badge";
import { cn } from "../lib/cn";

type Tone = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

/** Color coding for every `OrderItemState`, shared across the web dashboard and the floor app. */
const STATE_TONE: Record<OrderItemState, Tone> = {
  imported: "secondary",
  needs_mapping: "warning",
  ready: "info",
  needs_artwork: "warning",
  on_sheet: "info",
  transfer_in: "info",
  pressed: "info",
  packed: "secondary",
  shipped: "success",
  delivered: "success",
  on_hold: "danger",
  cancelled: "outline",
};

export interface StatusBadgeProps {
  state: OrderItemState;
  className?: string;
}

/** Badge for an order item's production state (`invai-contracts/src/states.ts`), color-coded and translated. */
export function StatusBadge({ state, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  return (
    <Badge variant={STATE_TONE[state]} className={cn(className)}>
      {t(`orderState.${state}`, { defaultValue: state })}
    </Badge>
  );
}

/** All order-item states, for building filters/legends without importing `@invai/contracts` directly. */
export const ORDER_ITEM_STATE_LIST = ORDER_ITEM_STATES;
