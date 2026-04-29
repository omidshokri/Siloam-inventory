type MoneyValue = number | string | null | undefined;

type CalculationItem = {
  purchase_price?: MoneyValue;
  purchase_tax_paid?: MoneyValue;
  repair_cost?: MoneyValue;
  shipping_cost?: MoneyValue;
  platform_fees?: MoneyValue;
  sale_price?: MoneyValue;
  selling_fees?: MoneyValue;
  status?: string | null;
};

function toNumber(value: MoneyValue) {
  return Number(value ?? 0);
}

export function money(value: MoneyValue) {
  const amount = toNumber(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function itemCost(item: CalculationItem) {
  return (
    toNumber(item.purchase_price) +
    toNumber(item.purchase_tax_paid) +
    toNumber(item.repair_cost) +
    toNumber(item.shipping_cost) +
    toNumber(item.platform_fees)
  );
}

export function netProfit(item: CalculationItem) {
  if (item.status !== "sold") return 0;

  return (
    toNumber(item.sale_price) -
    itemCost(item) -
    toNumber(item.selling_fees)
  );
}
