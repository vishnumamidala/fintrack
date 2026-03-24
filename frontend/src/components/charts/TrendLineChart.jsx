import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../utils/format";

export const TrendLineChart = ({ data }) => (
  <div className="chart-card">
    <div className="card-head">
      <h3>Expense Trend</h3>
    </div>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey="label" stroke="var(--text-muted)" />
        <YAxis stroke="var(--text-muted)" />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Line type="monotone" dataKey="total" stroke="var(--accent-warning)" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

