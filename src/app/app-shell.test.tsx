import { render, screen } from "@testing-library/react";
import { Home } from "lucide-react";
import { beforeAll, describe, expect, it } from "vitest";
import { initI18n } from "../i18n";
import { AppShell } from "./app-shell";

beforeAll(() => {
  initI18n("en");
});

const groups = [{ items: [{ key: "home", label: "Today", href: "/", icon: Home }] }];

describe("AppShell nav links", () => {
  it("keeps the label as the link name when the sidebar is collapsed", () => {
    render(
      <AppShell navGroups={groups} collapsed>
        <p>content</p>
      </AppShell>,
    );
    const link = screen.getByRole("link", { name: "Today" });
    const label = screen.getByText("Today", { selector: "a span span" });
    expect(label).toHaveClass("sr-only");
    expect(link).toBeInTheDocument();
  });

  it("shows the visible label when expanded", () => {
    render(
      <AppShell navGroups={groups} collapsed={false}>
        <p>content</p>
      </AppShell>,
    );
    const label = screen.getByText("Today", { selector: "a span span" });
    expect(label).not.toHaveClass("sr-only");
  });
});
