import { Delete } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";

export interface PinPadProps {
  /** PIN length; station PINs are 4-6 digits (see architecture.md 5.3). */
  length?: 4 | 5 | 6;
  value: string;
  onChange: (value: string) => void;
  /** Fired once when `value` reaches `length` digits after a keypress. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Numeric keypad for floor-station PIN login: big touch targets, dot progress, backspace. */
export function PinPad({
  length = 4,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className,
}: PinPadProps) {
  const { t } = useTranslation();
  function press(digit: string) {
    if (disabled || value.length >= length) return;
    const next = value + digit;
    onChange(next);
    if (next.length === length) onComplete?.(next);
  }

  function backspace() {
    if (disabled || value.length === 0) return;
    onChange(value.slice(0, -1));
  }

  function clear() {
    if (disabled) return;
    onChange("");
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="flex gap-3" aria-live="polite">
        {Array.from({ length }).map((_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length dot row, positional by design
            key={i}
            className={cn(
              "size-5 rounded-full border-2",
              error
                ? "border-danger"
                : i < value.length
                  ? "border-primary bg-primary"
                  : "border-input",
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => press(digit)}
            className={cn(
              "flex size-20 items-center justify-center rounded-xl border border-input bg-background text-3xl font-semibold text-foreground transition-colors",
              "hover:bg-accent active:bg-accent",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={clear}
          className="flex size-20 items-center justify-center rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
        >
          {t("pinPad.clear", "Clear")}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => press("0")}
          className={cn(
            "flex size-20 items-center justify-center rounded-xl border border-input bg-background text-3xl font-semibold text-foreground transition-colors",
            "hover:bg-accent active:bg-accent",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          0
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={backspace}
          aria-label={t("pinPad.backspace", "Backspace")}
          className="flex size-20 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
        >
          <Delete className="size-7" />
        </button>
      </div>
    </div>
  );
}
