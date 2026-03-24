import { formatCurrency } from "../../utils/format";

export const InsightsPanel = ({ insights, recommendations }) => (
  <div className="card insights-card reveal-up">
    <div className="card-head">
      <h3>Smart Insights</h3>
    </div>
    <div className="insight-grid">
      <article>
        <span>Current vs Previous Month</span>
        <strong>{formatCurrency(insights.currentMonth - insights.previousMonth)}</strong>
        <p>
          {insights.changePercentage === null
            ? "Add one more month of data to unlock comparison."
            : `${insights.changePercentage}% change in monthly expenses.`}
        </p>
      </article>
      <article>
        <span>Top Spending Category</span>
        <strong>{insights.topSpendingCategory || "Not enough data yet"}</strong>
        <p>This highlights where most expense volume is currently going.</p>
      </article>
      <article>
        <span>Suggested Monthly Budget</span>
        <strong>{formatCurrency(recommendations.suggestedBudget)}</strong>
        <p>Generated from your recent spend trend with a small efficiency target.</p>
      </article>
      <article>
        <span>Top Category Watchlist</span>
        <strong>{recommendations.topCategories[0]?.category || "Not enough data yet"}</strong>
        <p>Review your top categories weekly to keep spending concentration under control.</p>
      </article>
    </div>
  </div>
);
