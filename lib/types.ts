export type ItemStatus = "in_stock" | "sold" | "returned";

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  serial_number: string | null;
  vendor: string | null;
  purchase_date: string | null;
  purchase_price: number;
  purchase_tax_paid: number;
  repair_cost: number;
  shipping_cost: number;
  platform_fees: number;
  receipt_image_url: string | null;
  status: ItemStatus;
  sale_price: number | null;
  sales_tax_collected: number | null;
  selling_fees: number | null;
  sale_date: string | null;
  payment_method: string | null;
  created_at: string;
};

export type DashboardTotals = {
  inventoryValue: number;
  totalSales: number;
  totalProfit: number;
  salesTaxCollected: number;
};
