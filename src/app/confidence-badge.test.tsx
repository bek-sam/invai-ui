import { CONFIDENCE_BANDS } from "@invai/contracts";
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { initI18n } from "../i18n";
import { ConfidenceBadge } from "./confidence-badge";

beforeAll(() => {
  initI18n("en");
});

describe("ConfidenceBadge", () => {
  it("renders every band with its translated text", () => {
    for (const band of CONFIDENCE_BANDS) {
      const { unmount } = render(<ConfidenceBadge band={band} />);
      expect(
        screen.getByText(
          {
            high: "High confidence",
            medium: "Medium confidence: test it",
            low: "Not enough data",
          }[band],
        ),
      ).toBeInTheDocument();
      unmount();
    }
  });

  it("hides the icon from screen readers so the text is the accessible name", () => {
    render(<ConfidenceBadge band="high" />);
    const badge = screen.getByText("High confidence").closest("span");
    const icon = badge?.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden");
  });

  it("lets a caller override the text while keeping the icon and tone from `band`", () => {
    render(<ConfidenceBadge band="low" label="Custom label" />);
    expect(screen.getByText("Custom label")).toBeInTheDocument();
    expect(screen.queryByText("Not enough data")).not.toBeInTheDocument();
  });
});
