import { useState } from "react";
import { formatCurrency, formatDate } from "../../utils/format";

export const GoalsPanel = ({ goals, onCreateGoal, onDeleteGoal }) => {
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
  });

  return (
    <section className="card goals-card">
      <div className="card-head">
        <h3>Savings Goals</h3>
      </div>

      <form
        className="goal-form"
        onSubmit={async (event) => {
          event.preventDefault();
          await onCreateGoal({
            ...form,
            targetAmount: Number(form.targetAmount),
            currentAmount: Number(form.currentAmount || 0),
          });
          setForm({ title: "", targetAmount: "", currentAmount: "", targetDate: "" });
        }}
      >
        <input placeholder="Goal name" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
        <input type="number" min="1" placeholder="Target amount" value={form.targetAmount} onChange={(event) => setForm((prev) => ({ ...prev, targetAmount: event.target.value }))} required />
        <input type="number" min="0" placeholder="Already saved" value={form.currentAmount} onChange={(event) => setForm((prev) => ({ ...prev, currentAmount: event.target.value }))} />
        <input type="date" value={form.targetDate} onChange={(event) => setForm((prev) => ({ ...prev, targetDate: event.target.value }))} required />
        <button className="button primary" type="submit">Add Goal</button>
      </form>

      <div className="stack-list">
        {goals.length ? (
          goals.map((goal) => (
            <article key={goal._id} className="goal-item">
              <div>
                <strong>{goal.title}</strong>
                <p>
                  {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} by {formatDate(goal.targetDate)}
                </p>
                <p>Need {formatCurrency(goal.requiredMonthlySavings)}/month</p>
              </div>
              <div className="goal-side">
                <span className="score-pill info">{goal.progress}%</span>
                <button className="button ghost" onClick={() => onDeleteGoal(goal._id)}>Remove</button>
              </div>
            </article>
          ))
        ) : (
          <p className="panel-copy">Create your first goal to track how much you need to save each month.</p>
        )}
      </div>
    </section>
  );
};

