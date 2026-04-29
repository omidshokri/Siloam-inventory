"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRScanner from "./QRScanner";
import { money, netProfit } from "@/lib/calculations";

export default function InventoryFilters({ items }: { items: any[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [showScanner, setShowScanner] = useState(false);

  const categories = useMemo(() => {
    const unique = new Set(items.map((i) => i.category).filter(Boolean));
    return ["all", ...Array.from(unique)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.vendor?.toLowerCase().includes(q) ||
        item.serial_number?.toLowerCase().includes(q) ||
        item.inventory_number?.toLowerCase().includes(q);

      const matchesCategory =
        category === "all" || item.category === category;

      const matchesStatus =
        status === "all" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, category, status]);

  function handleScan(text: string) {
    setShowScanner(false);

    const scanned = text.trim();

    const found = items.find(
      (item) =>
        item.id === scanned ||
        item.inventory_number === scanned ||
        item.serial_number === scanned
    );

    if (found) {
      router.push(`/items/${found.id}`);
    } else {
      setSearch(scanned);
      alert("Item not found. I added the scanned text to search.");
    }
  }

  return (
    <section className="section-card">
      <div className="hero-top">
        <div>
          <h2>Inventory Items</h2>
          <p className="muted">Search, filter, or scan an item.</p>
        </div>
      </div>

      <div className="filters">
        <div className="search-with-camera">
          <input
            type="text"
            placeholder="Search name, serial, vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            className="secondary-btn camera-btn"
            onClick={() => setShowScanner(true)}
          >
            📷
          </button>
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat: any) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {showScanner && (
        <div className="scanner-card">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setShowScanner(false)}
          >
            Close Scanner
          </button>

          <QRScanner onScan={handleScan} />
        </div>
      )}

      <div className="item-list">
        {filteredItems.length === 0 ? (
          <p className="empty-state">No items found.</p>
        ) : (
          filteredItems.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`} className="item-row">
              <div>
                <p className="serial">
                  {item.inventory_number ||
                    item.serial_number ||
                    "No inventory number"}
                </p>

                <h3>{item.name || "Item"}</h3>

                <p className="muted">
                  {item.category || "No category"} · {item.status || "in_stock"}
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
