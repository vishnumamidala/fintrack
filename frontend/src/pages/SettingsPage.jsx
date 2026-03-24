import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const defaultBudgetRow = { category: "", limit: "" };

export const SettingsPage = () => {
  const { user, updatePreferences } = useAuth();
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || 50000);
  const [categoryBudgets, setCategoryBudgets] = useState(
    user?.categoryBudgets?.length
      ? user.categoryBudgets.map((item) => ({ category: item.category, limit: item.limit }))
      : [defaultBudgetRow]
  );

  const savePreferences = async (event) => {
    event.preventDefault();
    await updatePreferences({
      monthlyBudget: Number(monthlyBudget),
      categoryBudgets: categoryBudgets
        .filter((item) => item.category && item.limit !== "")
        .map((item) => ({ category: item.category, limit: Number(item.limit) })),
    });
  };

  return (
    <div className="dashboard">
      <section className="card reveal-up">
        <div className="card-head">
          <div>
            <h3>Budget Settings</h3>
            <p className="panel-copy">Set product-grade budget controls that power your dashboard recommendations.</p>
          </div>
        </div>
        <form className="settings-form" onSubmit={savePreferences}>
          <label>
            <span>Monthly Budget</span>
            <input
              type="number"
              min="0"
              value={monthlyBudget}
              onChange={(event) => setMonthlyBudget(event.target.value)}
            />
          </label>

          <div className="category-budget-list">
            <div className="card-head">
              <h4>Category Budgets</h4>
              <button
                type="button"
                className="button ghost"
                onClick={() => setCategoryBudgets((prev) => [...prev, defaultBudgetRow])}
              >
                Add Category
              </button>
            </div>

            {categoryBudgets.map((item, index) => (
              <div key={`${item.category}-${index}`} className="category-budget-row">
                <input
                  placeholder="Category"
                  value={item.category}
                  onChange={(event) =>
                    setCategoryBudgets((prev) =>
                      prev.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, category: event.target.value } : row
                      )
                    )
                  }
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Limit"
                  value={item.limit}
                  onChange={(event) =>
                    setCategoryBudgets((prev) =>
                      prev.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, limit: event.target.value } : row
                      )
                    )
                  }
                />
                <button
                  type="button"
                  className="button ghost"
                  onClick={() =>
                    setCategoryBudgets((prev) =>
                      prev.length > 1 ? prev.filter((_, rowIndex) => rowIndex !== index) : [defaultBudgetRow]
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button className="button primary" type="submit">
            Save Preferences
          </button>
        </form>
      </section>
    </div>
  );
};
