import { formatCurrency } from "../../utils/format";

export const ForecastPanel = ({ forecast, suggestedBudget }) => (
  <div className="card forecast-card reveal-up">
    <div className="card-head">
      <h3>Month-End Forecast</h3>
      <span className={`score-pill ${forecast.projectedBalance >= 0 ? "success" : "danger"}`}>
        {forecast.confidence} confidence
      </span>
    </div>
    <div className="forecast-grid">
      <article>
        <span>Projected Expenses</span>
        <strong>{formatCurrency(forecast.projectedExpense)}</strong>
      </article>
      <article>
        <span>Projected Balance</span>
        <strong>{formatCurrency(forecast.projectedBalance)}</strong>
      </article>
      <article>
        <span>Suggested Budget</span>
        <strong>{formatCurrency(suggestedBudget)}</strong>
      </article>
    </div>
    <p className="panel-copy">
      Based on day {forecast.currentDay} of {forecast.daysInMonth} and your recent monthly expense pattern.
    </p>
  </div>
);
