import { describe, expect, it } from "vitest";
import { formatMoney } from "./money";

describe("formatMoney", () => {
  it("formats integer cents as USD", () => {
    expect(formatMoney(1234)).toBe("$12.34");
  });

  it("formats zero", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });

  it("formats whole dollars without dangling cents mismatch", () => {
    expect(formatMoney(500)).toBe("$5.00");
  });

  it("formats large amounts with thousands separators", () => {
    expect(formatMoney(123456789)).toBe("$1,234,567.89");
  });

  it("formats a single cent", () => {
    expect(formatMoney(1)).toBe("$0.01");
  });

  it("formats in the app locale when given one (AC3)", () => {
    expect(formatMoney(1234, "USD", "es")).toBe("12,34 US$");
  });
});
