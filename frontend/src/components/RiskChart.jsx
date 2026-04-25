import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#e74c3c", "#f39c12", "#2ecc71"];

function RiskChart({ high, medium, low }) {

  const data = [
    { name: "High Risk", value: high },
    { name: "Medium Risk", value: medium },
    { name: "Low Risk", value: low }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />

      </PieChart>
    </ResponsiveContainer>
  );
}

export default RiskChart;