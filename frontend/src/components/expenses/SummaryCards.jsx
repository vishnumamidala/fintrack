import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/format";

export const SummaryCards = ({ totals, insights }) => {
  const changeTone = insights?.difference > 0 ? "warning" : "success";

  return (
    <div className="summary-grid">
      <article className="metric-card">
        <div className="metric-icon">
          <Wallet size={18} />
        </div>
        <span>Total Balance</span>
        <h2>{formatCurrency(totals.balance)}</h2>
      </article>
      <article className="metric-card">
        <div className="metric-icon income">
          <ArrowUpRight size={18} />
        </div>
        <span>Income</span>
        <h2>{formatCurrency(totals.income)}</h2>
      </article>
      <article className="metric-card">
        <div className="metric-icon expense">
          <ArrowDownRight size={18} />
        </div>
        <span>Expenses</span>
        <h2>{formatCurrency(totals.expense)}</h2>
        <p className={`metric-note ${changeTone}`}>
          {insights?.changePercentage === null
            ? "No previous month data yet"
            : `${insights.changePercentage}% vs previous month`}
        </p>
      </article>
    </div>
  );
};

