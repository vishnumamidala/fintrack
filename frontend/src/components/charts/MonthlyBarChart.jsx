import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../utils/format";

export const MonthlyBarChart = ({ data }) => (
  <div className="chart-card">
    <div className="card-head">
      <h3>Monthly Expenses</h3>
    </div>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey="label" stroke="var(--text-muted)" />
        <YAxis stroke="var(--text-muted)" />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Bar dataKey="total" fill="var(--accent-primary)" radius={[12, 12, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

