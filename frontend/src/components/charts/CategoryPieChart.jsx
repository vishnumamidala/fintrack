import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartPalette, formatCurrency } from "../../utils/format";

export const CategoryPieChart = ({ data }) => (
  <div className="chart-card">
    <div className="card-head">
      <h3>Category Breakdown</h3>
    </div>
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={entry.category} fill={chartPalette[index % chartPalette.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

