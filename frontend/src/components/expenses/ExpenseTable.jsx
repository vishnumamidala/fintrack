import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmModal } from "../common/ConfirmModal";
import { EmptyState } from "../common/EmptyState";
import { formatCurrency, formatDate } from "../../utils/format";

export const ExpenseTable = ({ expenses, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setDraft({
      ...expense,
      date: expense.date.slice(0, 10),
    });
  };

  const saveEdit = async () => {
    await onUpdate(editingId, { ...draft, amount: Number(draft.amount) });
    setEditingId(null);
    setDraft(null);
  };

  if (!expenses.length) {
    return <EmptyState title="No entries found" description="Try adjusting your filters or add your first transaction." />;
  }

  return (
    <>
      <div className="card table-card">
        <div className="card-head">
          <h3>Recent Transactions</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const isEditing = editingId === expense._id;
                return (
                  <tr key={expense._id}>
                    <td>
                      {isEditing ? (
                        <input value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} />
                      ) : (
                        expense.title
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          value={draft.category}
                          onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
                        />
                      ) : (
                        expense.category
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select value={draft.type} onChange={(event) => setDraft((prev) => ({ ...prev, type: event.target.value }))}>
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      ) : (
                        <span className={`pill ${expense.type}`}>{expense.type}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input type="date" value={draft.date} onChange={(event) => setDraft((prev) => ({ ...prev, date: event.target.value }))} />
                      ) : (
                        formatDate(expense.date)
                      )}
                    </td>
                    <td className={expense.type === "income" ? "income-text" : "expense-text"}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.amount}
                          onChange={(event) => setDraft((prev) => ({ ...prev, amount: event.target.value }))}
                        />
                      ) : (
                        formatCurrency(expense.amount)
                      )}
                    </td>
                    <td>
                      <div className="action-row">
                        {isEditing ? (
                          <>
                            <button className="button ghost" onClick={saveEdit}>
                              Save
                            </button>
                            <button className="button ghost" onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="icon-button" onClick={() => startEdit(expense)}>
                              <Pencil size={16} />
                            </button>
                            <button className="icon-button danger" onClick={() => setDeleteId(expense._id)}>
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete transaction?"
        description="This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          await onDelete(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
};

