import type { InventoryItem } from "./types";

export function money(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function itemCost(item: Pick<InventoryItem, "purchase_price" | "purchase_tax_paid" | "repair_cost" | "shipping_cost" | "platform_fees">) {
  return (
    Number(item.purchase_price ?? 0) +
    Number(item.purchase_tax_paid ?? 0) +
    Number(item.repair_cost ?? 0) +
    Number(item.shipping_cost ?? 0) +
    Number(item.platform_fees ?? 0)
  );
}

export function netProfit(item: InventoryItem) {
  if (item.status !== "sold") return 0;
  return Number(item.sale_price ?? 0) - itemCost(item) - Number(item.selling_fees ?? 0);
}
