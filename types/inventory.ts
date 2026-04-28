export type InventoryItem = {
  id: string;
  name: string;
  category?: string | null;
  serial_number?: string | null;
  inventory_number?: string | null;
  status?: string | null;

  purchase_price?: number | null;
  purchase_tax_paid?: number | null;
  repair_cost?: number | null;
  shipping_cost?: number | null;
  platform_fees?: number | null;

  sale_price?: number | null;
  sales_tax_collected?: number | null;
  selling_fees?: number | null;
  sale_date?: string | null;

  created_at?: string | null;
};
