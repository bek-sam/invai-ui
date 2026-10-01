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

  it("groups a 3-digit es amount the same as before (no separator needed)", () => {
    expect(formatMoney(12345, "USD", "es")).toBe("123,45 US$");
  });

  it("groups a 4-digit es amount with the thousands separator CLDR drops (T-P3-3 AC1)", () => {
    expect(formatMoney(123456, "USD", "es")).toBe("1.234,56 US$");
  });

  it("leaves a 4-digit en amount unchanged (en never had the gap)", () => {
    expect(formatMoney(123456, "USD", "en")).toBe("$1,234.56");
  });

  it("groups a 7-digit es amount, which already grouped correctly", () => {
    expect(formatMoney(123456789, "USD", "es")).toBe("1.234.567,89 US$");
  });

  it("groups a negative 4-digit es amount", () => {
    expect(formatMoney(-123456, "USD", "es")).toBe("-1.234,56 US$");
  });

  it("keeps the formatter cache keyed by locale and currency (AC3)", () => {
    expect(formatMoney(123456, "USD", "es")).toBe("1.234,56 US$");
    expect(formatMoney(123456, "EUR", "es")).toBe("1.234,56 €");
    expect(formatMoney(123456, "USD", "en")).toBe("$1,234.56");
  });
});
