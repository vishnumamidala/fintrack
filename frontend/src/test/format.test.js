import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "../utils/format";

describe("format utils", () => {
  it("formats INR currency values", () => {
    expect(formatCurrency(50000)).toContain("50,000");
  });

  it("formats dates for en-IN", () => {
    expect(formatDate("2026-03-24T00:00:00.000Z")).toContain("2026");
  });
});

