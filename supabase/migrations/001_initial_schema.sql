create extension if not exists "pgcrypto";

create type item_status as enum ('in_stock', 'sold', 'returned');

create sequence if not exists inventory_sku_seq start 1;

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique default ('ST-' || lpad(nextval('inventory_sku_seq')::text, 4, '0')),
  name text not null,
  category text,
  serial_number text,
  vendor text,
  purchase_date date,
  purchase_price numeric(12,2) not null default 0,
  purchase_tax_paid numeric(12,2) not null default 0,
  repair_cost numeric(12,2) not null default 0,
  shipping_cost numeric(12,2) not null default 0,
  platform_fees numeric(12,2) not null default 0,
  receipt_image_url text,
  status item_status not null default 'in_stock',
  sale_price numeric(12,2),
  sales_tax_collected numeric(12,2),
  selling_fees numeric(12,2),
  sale_date date,
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists inventory_items_updated_at on inventory_items;
create trigger inventory_items_updated_at
before update on inventory_items
for each row execute function set_updated_at();

alter table inventory_items enable row level security;

-- Simple starter policy. For a production multi-user app, add user_id and owner-based policies.
create policy "Allow all authenticated reads" on inventory_items
for select to authenticated using (true);

create policy "Allow all authenticated inserts" on inventory_items
for insert to authenticated with check (true);

create policy "Allow all authenticated updates" on inventory_items
for update to authenticated using (true) with check (true);

create policy "Allow all authenticated deletes" on inventory_items
for delete to authenticated using (true);
