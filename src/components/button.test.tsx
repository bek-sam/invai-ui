import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies the default variant and md size classes", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button", { name: "Default" });
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("h-9");
  });

  it("applies the floor size for tablet stations", () => {
    render(<Button size="floor">Press</Button>);
    expect(screen.getByRole("button", { name: "Press" }).className).toContain("h-20");
  });

  it("applies the destructive and success variants", () => {
    render(<Button variant="destructive">Cancel order</Button>);
    expect(screen.getByRole("button", { name: "Cancel order" }).className).toContain(
      "bg-destructive",
    );

    render(<Button variant="success">Mark shipped</Button>);
    expect(screen.getByRole("button", { name: "Mark shipped" }).className).toContain("bg-success");
  });

  it("calls onClick when pressed and not disabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
