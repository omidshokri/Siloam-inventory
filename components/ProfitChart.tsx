"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function ProfitChart({ data }: any) {
  if (!data || data.length === 0) return <p>No data</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="purchase" fill="#2563eb" />
        <Bar dataKey="profit" fill="#16a34a" />
        <Bar dataKey="tax" fill="#f97316" />
      </BarChart>
    </div>
  );
}
