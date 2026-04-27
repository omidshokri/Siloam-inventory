"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function BarChartProfit({
  data,
}: {
  data: {
    name: string;
    purchase: number;
    profit: number;
    estimatedProfitTax: number;
    salesTaxCollected: number;
  }[];
}) {
  if (!data.length) {
    return <p className="text-sm text-slate-500">No data for bar chart.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <BarChart width={520} height={320} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="purchase" name="Purchase Price" fill="#2563eb" />
        <Bar dataKey="profit" name="Profit" fill="#16a34a" />
        <Bar
          dataKey="estimatedProfitTax"
          name="Estimated Profit Tax"
          fill="#f97316"
        />
        <Bar
          dataKey="salesTaxCollected"
          name="Sales Tax Collected"
          fill="#dc2626"
        />
      </BarChart>
    </div>
  );
}
