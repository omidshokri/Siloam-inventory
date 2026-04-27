"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

export default function PieChartBreakdown({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const filteredData = data.filter((item) => item.value > 0);

  if (!filteredData.length) {
    return <p className="text-sm text-slate-500">No data for pie chart.</p>;
  }

  return (
    <div className="flex justify-center">
      <PieChart width={420} height={320}>
        <Pie
          data={filteredData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={105}
          paddingAngle={3}
          label
        >
          {filteredData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
