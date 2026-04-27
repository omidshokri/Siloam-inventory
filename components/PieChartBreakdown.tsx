"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

export default function PieChartBreakdown({ data }: any) {
  if (!data || data.length === 0) {
    return <p>No data</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {data.map((entry: any, index: number) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
