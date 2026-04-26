# Siloam Inventory

A mobile-first reseller inventory and profit tracker for a small used electronics business.

## Features

- Add purchased items with receipt/screenshot upload
- AI receipt parsing endpoint ready for OpenAI Vision
- Auto SKU support through database sequence
- Track purchase price, purchase tax paid, repair cost, shipping, platform fees
- Mark items as sold and calculate net profit
- Track sales tax collected separately
- Dashboard totals for inventory, sales, profit, and tax collected

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
```

3. Run the SQL in `supabase/migrations/001_initial_schema.sql` inside Supabase SQL editor.

4. Start the app:

```bash
npm run dev
```

## Profit formula

```text
net_profit = sale_price - purchase_price - purchase_tax_paid - repair_cost - shipping_cost - platform_fees - selling_fees
```

Sales tax collected is tracked separately because it is usually money collected on behalf of the state/local tax authority.
