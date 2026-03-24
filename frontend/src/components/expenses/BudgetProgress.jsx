import { formatCurrency } from "../../utils/format";

export const BudgetProgress = ({ spent, budgetOverride }) => {
  const budget = Number(budgetOverride || import.meta.env.VITE_MONTHLY_BUDGET || 50000);
  const percentage = Math.min((spent / budget) * 100, 100);
  const tone = percentage >= 90 ? "danger" : percentage >= 70 ? "warning" : "success";

  return (
    <div className="card budget-card">
      <div className="card-head">
        <h3>Monthly Budget</h3>
        <span>{formatCurrency(budget)}</span>
      </div>
      <div className="budget-bar">
        <div className={`budget-fill ${tone}`} style={{ width: `${percentage}%` }} />
      </div>
      <p>
        {formatCurrency(spent)} used this month • {Math.round(percentage)}% utilized
      </p>
    </div>
  );
};
