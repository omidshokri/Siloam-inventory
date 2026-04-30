type FormulaItem = Record<string, number | string | null | undefined>;

const allowedFields = [
  "purchase_price",
  "purchase_tax_paid",
  "repair_cost",
  "shipping_cost",
  "platform_fees",
  "sale_price",
  "sales_tax_collected",
  "selling_fees",
];

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

export function calculateFormula(formula: string, item: FormulaItem) {
  let expression = formula;

  for (const field of allowedFields) {
    const value = toNumber(item[field]);
    expression = expression.replaceAll(field, String(value));
  }

  const safeExpression = expression.replace(/[^0-9+\-*/().\s]/g, "");

  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${safeExpression})`)();

    if (typeof result !== "number" || Number.isNaN(result)) {
      return 0;
    }

    return result;
  } catch {
    return 0;
  }
}

export function formatFormulaValue(value: number, format: string) {
  if (format === "money") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  if (format === "percent") {
    return `${value.toFixed(2)}%`;
  }

  return String(value);
}
