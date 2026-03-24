import { describe, expect, it } from "vitest";
import { buildExpenseFilters, getSortOption } from "../utils/expenseQuery.js";

describe("expenseQuery helpers", () => {
  it("builds search-aware filters", () => {
    const filters = buildExpenseFilters("user-1", {
      category: "Food",
      type: "expense",
      search: "fresh",
    });

    expect(filters.user).toBe("user-1");
    expect(filters.category).toBe("Food");
    expect(filters.type).toBe("expense");
    expect(filters.$or).toHaveLength(5);
  });

  it("returns amount descending sort config", () => {
    expect(getSortOption("amount_desc")).toEqual({ amount: -1 });
  });
});

