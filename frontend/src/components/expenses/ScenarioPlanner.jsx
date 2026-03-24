import { useState } from "react";
import { formatCurrency } from "../../utils/format";

export const ScenarioPlanner = ({ categories, scenarioResult, onRunScenario }) => {
  const [form, setForm] = useState({
    category: "",
    adjustmentPercent: -10,
    fixedAmountDelta: 0,
  });

  return (
    <section className="card scenario-card reveal-up">
      <div className="card-head">
        <h3>Scenario Planner</h3>
      </div>
      <div className="scenario-grid">
        <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}>
          <option value="">All expenses</option>
          {categories.map((item) => (
            <option key={item.category} value={item.category}>
              {item.category}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Adjustment %"
          value={form.adjustmentPercent}
          onChange={(event) => setForm((prev) => ({ ...prev, adjustmentPercent: event.target.value }))}
        />
        <input
          type="number"
          placeholder="Fixed amount delta"
          value={form.fixedAmountDelta}
          onChange={(event) => setForm((prev) => ({ ...prev, fixedAmountDelta: event.target.value }))}
        />
        <button
          className="button primary"
          onClick={() =>
            onRunScenario({
              category: form.category,
              adjustmentPercent: Number(form.adjustmentPercent),
              fixedAmountDelta: Number(form.fixedAmountDelta),
            })
          }
        >
          Simulate
        </button>
      </div>

      {scenarioResult ? (
        <div className="forecast-grid">
          <article>
            <span>Expense Delta</span>
            <strong>{formatCurrency(scenarioResult.impact.monthlyExpenseDelta)}</strong>
          </article>
          <article>
            <span>Projected Expense</span>
            <strong>{formatCurrency(scenarioResult.impact.projectedExpense)}</strong>
          </article>
          <article>
            <span>Projected Balance</span>
            <strong>{formatCurrency(scenarioResult.impact.projectedBalance)}</strong>
          </article>
        </div>
      ) : (
        <p className="panel-copy">Try “Food -15%” or “Shopping -5000” to preview your month-end impact.</p>
      )}
    </section>
  );
};
