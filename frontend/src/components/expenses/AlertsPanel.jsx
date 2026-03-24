import { formatCurrency, formatDate } from "../../utils/format";

export const AlertsPanel = ({ anomalies, recurring }) => (
  <div className="alerts-grid">
    <section className="card alerts-card">
      <div className="card-head">
        <h3>Anomaly Alerts</h3>
      </div>
      {anomalies.length ? (
        <div className="stack-list">
          {anomalies.map((item) => (
            <article key={item.id} className="signal-item">
              <div>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
              </div>
              <span>{formatCurrency(item.amount)}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="panel-copy">No unusual transactions detected in your recent expense history.</p>
      )}
    </section>

    <section className="card alerts-card">
      <div className="card-head">
        <h3>Recurring Payments</h3>
      </div>
      {recurring.length ? (
        <div className="stack-list">
          {recurring.map((item) => (
            <article key={`${item.title}-${item.amount}`} className="signal-item">
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.category} • every {item.averageIntervalDays || "?"} days
                </p>
              </div>
              <span>{item.nextExpectedDate ? formatDate(item.nextExpectedDate) : "Monitoring"}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="panel-copy">No recurring payment pattern detected yet. Add more transaction history to unlock this.</p>
      )}
    </section>
  </div>
);
