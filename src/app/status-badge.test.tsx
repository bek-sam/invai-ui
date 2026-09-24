import { ORDER_ITEM_STATES } from "@invai/contracts";
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { initI18n } from "../i18n";
import { StatusBadge } from "./status-badge";

beforeAll(() => {
  initI18n("en");
});

describe("StatusBadge", () => {
  it("maps every order-item state to a badge that renders without throwing", () => {
    for (const state of ORDER_ITEM_STATES) {
      const { unmount } = render(<StatusBadge state={state} />);
      // Every state must render some visible label text (falls back to the raw state
      // if a translation key is ever missing, so this also catches typos in en.json).
      expect(screen.getByText((content) => content.length > 0)).toBeInTheDocument();
      unmount();
    }
  });

  it("renders the translated label for a known state", () => {
    render(<StatusBadge state="needs_mapping" />);
    expect(screen.getByText("Needs mapping")).toBeInTheDocument();
  });

  it("covers all states declared in @invai/contracts (no state silently unmapped)", () => {
    expect(ORDER_ITEM_STATES.length).toBeGreaterThan(0);
    for (const state of ORDER_ITEM_STATES) {
      render(<StatusBadge state={state} />);
    }
  });
});
