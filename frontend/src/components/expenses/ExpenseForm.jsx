import { useState } from "react";

const initialForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
  type: "expense",
  merchant: "",
  paymentMethod: "",
  notes: "",
};

export const ExpenseForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ ...form, amount: Number(form.amount) });
    setForm(initialForm);
  };

  return (
    <form className="expense-form card" onSubmit={handleSubmit}>
      <div className="card-head">
        <h3>Add New Entry</h3>
      </div>
      <div className="form-grid">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
          required
        />
        <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Health</option>
          <option>Utilities</option>
          <option>Salary</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
        <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          placeholder="Merchant"
          value={form.merchant}
          onChange={(event) => setForm((prev) => ({ ...prev, merchant: event.target.value }))}
        />
        <input
          placeholder="Payment Method"
          value={form.paymentMethod}
          onChange={(event) => setForm((prev) => ({ ...prev, paymentMethod: event.target.value }))}
        />
        <input
          type="date"
          value={form.date}
          onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          required
        />
        <textarea
          rows="2"
          placeholder="Notes"
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
        />
        <button className="button primary" type="submit">
          Save Entry
        </button>
      </div>
    </form>
  );
};
