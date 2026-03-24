export const FinanceHealthCard = ({ health }) => {
  const tone = health.score >= 80 ? "success" : health.score >= 65 ? "info" : health.score >= 45 ? "warning" : "danger";

  return (
    <div className="card health-card reveal-up">
      <div className="card-head">
        <h3>Spend Health Score</h3>
        <span className={`score-pill ${tone}`}>{health.label}</span>
      </div>
      <div className="health-score-wrap">
        <div className="health-ring" style={{ "--health-score": `${health.score}%` }}>
          <div>
            <strong>{health.score}</strong>
            <span>/100</span>
          </div>
        </div>
        <div className="health-factors">
          <p>Savings rate: {health.factors.savingsRate}%</p>
          <p>Top category share: {health.factors.topCategoryShare}%</p>
          <p>Projected balance: {health.factors.projectedBalance.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
};
