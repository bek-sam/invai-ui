import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relative-time";

describe("formatRelativeTime", () => {
  const now = new Date("2026-09-26T00:00:00Z");

  it("formats a past timestamp in English by default", () => {
    const fourWeeksAgo = new Date(now.getTime() - 28 * 86_400_000).toISOString();
    expect(formatRelativeTime(fourWeeksAgo, now)).toBe("4 weeks ago");
  });

  it("formats the same timestamp in Spanish when given the app locale (AC3)", () => {
    const fourWeeksAgo = new Date(now.getTime() - 28 * 86_400_000).toISOString();
    expect(formatRelativeTime(fourWeeksAgo, now, "es")).toBe("hace 4 semanas");
  });

  it("formats a future timestamp", () => {
    const in3Hours = new Date(now.getTime() + 3 * 3_600_000).toISOString();
    expect(formatRelativeTime(in3Hours, now)).toBe("in 3 hours");
    expect(formatRelativeTime(in3Hours, now, "es")).toBe("dentro de 3 horas");
  });
});
