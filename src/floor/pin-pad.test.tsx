import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { PinPad } from "./pin-pad";

/** A thin controlled wrapper so tests can drive `value` like a real consumer would. */
function ControlledPinPad(props: { length?: 4 | 5 | 6; onComplete?: (v: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <PinPad length={props.length} value={value} onChange={setValue} onComplete={props.onComplete} />
  );
}

describe("PinPad", () => {
  it("appends a digit per press and stops accepting input once full", () => {
    const onComplete = vi.fn();
    render(<ControlledPinPad length={4} onComplete={onComplete} />);

    for (const digit of ["1", "2", "3", "4"]) {
      fireEvent.click(screen.getByRole("button", { name: digit }));
    }

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith("1234");

    // A 5th press must not extend past `length`.
    fireEvent.click(screen.getByRole("button", { name: "5" }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("removes the last digit on backspace", () => {
    const onChange = vi.fn();
    render(<PinPad length={4} value="12" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Backspace" }));
    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("ignores backspace when already empty", () => {
    const onChange = vi.fn();
    render(<PinPad length={4} value="" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Backspace" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clears the whole value", () => {
    const onChange = vi.fn();
    render(<PinPad length={4} value="12" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("renders one progress dot per digit of length", () => {
    const { container } = render(<PinPad length={6} value="123" onChange={() => {}} />);
    const dots = container.querySelectorAll("span.rounded-full");
    expect(dots).toHaveLength(6);
  });

  it("does not accept input while disabled", () => {
    const onChange = vi.fn();
    render(<PinPad length={4} value="" onChange={onChange} disabled />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
