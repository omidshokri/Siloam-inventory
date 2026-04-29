"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { money, netProfit, itemCost } from "@/lib/calculations";

export default function InventoryFilters({ items }: { items: any[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  // استخراج دسته‌بندی‌ها از دیتابیس
  const categories = useMemo(() => {
    const unique = new Set(items.map((i) => i.category).filter(Boolean));
    return ["all", ...Array.from(unique)];
  }, [items]);

  // فیلتر نهایی
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.serial_number?.toLowerCase().includes(search.toLowerCase()) ||
        item.inventory_number?.toLowerCase().includes(search.toLowerCase()) ||
        item.vendor?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || item.category === category;

      const matchesStatus =
        status === "all" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, category, status]);

  return (
    <section className="section-card">
      <h2>Inventory Items</h2>

      {/* 🔍 فیلترها */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* 📦 لیست آیتم‌ها */}
      <div className="item-list">
        {filteredItems.length === 0 ? (
          <p className="empty-state">No items found.</p>
        ) : (
          filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="item-row"
            >
              <div>
                <p className="serial">
                  {item.inventory_number || "No inventory number"}
                </p>

                <h3>{item.name || "Item"}</h3>

                <p className="muted">
                  {item.category} · {item.status}
                </p>
              </div>

              <strong>{money(netProfit(item))}</strong>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
