export const ExpenseFilters = ({ filters, onChange, onReset, onExport }) => (
  <div className="card filters reveal-up">
    <div className="card-head">
      <h3>Filters & Sorting</h3>
      <button className="button ghost" onClick={onReset}>
        Reset
      </button>
    </div>
    <div className="filter-grid">
      <input
        placeholder="Search title, merchant, notes..."
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
      />
      <select value={filters.category} onChange={(event) => onChange({ category: event.target.value, page: 1 })}>
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Shopping">Shopping</option>
        <option value="Health">Health</option>
        <option value="Utilities">Utilities</option>
        <option value="Salary">Salary</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Other</option>
      </select>
      <select value={filters.type} onChange={(event) => onChange({ type: event.target.value, page: 1 })}>
        <option value="">All Types</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input type="date" value={filters.dateFrom} onChange={(event) => onChange({ dateFrom: event.target.value, page: 1 })} />
      <input type="date" value={filters.dateTo} onChange={(event) => onChange({ dateTo: event.target.value, page: 1 })} />
      <select value={filters.sort} onChange={(event) => onChange({ sort: event.target.value, page: 1 })}>
        <option value="date_desc">Latest first</option>
        <option value="date_asc">Oldest first</option>
        <option value="amount_desc">Highest amount</option>
        <option value="amount_asc">Lowest amount</option>
      </select>
      <button className="button secondary" onClick={onExport}>
        Export CSV
      </button>
    </div>
  </div>
);
