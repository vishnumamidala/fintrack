import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetProgress } from "../components/expenses/BudgetProgress";

describe("BudgetProgress", () => {
  it("renders spent amount and utilization", () => {
    render(<BudgetProgress spent={25000} budgetOverride={50000} />);

    expect(screen.getByText("Monthly Budget")).toBeInTheDocument();
    expect(screen.getByText(/50% utilized/i)).toBeInTheDocument();
  });
});

