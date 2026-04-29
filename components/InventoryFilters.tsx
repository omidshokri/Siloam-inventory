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
    const unique = new Set(items.map((item) => item.category).filter(Boolean));
    return ["all", ...Array.from(unique)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !q ||
        String(item.name || "").toLowerCase().includes(q) ||
        String(item.category || "").toLowerCase().includes(q) ||
        String(item.vendor || "").toLowerCase().includes(q) ||
        String(item.serial_number || "").toLowerCase().includes(q) ||
        String(item.inventory_number || "").toLowerCase().includes(q) ||
        String(item.id || "").toLowerCase().includes(q);

      const matchesCategory = category === "all" || item.category === category;
      const matchesStatus = status === "all" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, category, status]);

  function cleanScannedText(text: string) {
    let scanned = text.trim();

    try {
      if (scanned.startsWith("http")) {
        const url = new URL(scanned);
        const parts = url.pathname.split("/").filter(Boolean);

        // QR مثل:
        // https://siloam-inventory.vercel.app/lookup/INV-20260429-9023
        if (parts[0] === "lookup" && parts[1]) {
          return decodeURIComponent(parts[1]).trim();
        }

        // QR مستقیم به محصول:
        // https://siloam-inventory.vercel.app/items/f111bd3e...
        if (parts[0] === "items" && parts[1]) {
          return decodeURIComponent(parts[1]).trim();
        }
      }
    } catch {
      // اگر URL نبود، همان متن اسکن‌شده را نگه می‌داریم
    }

    return scanned;
  }

  function handleScan(text: string) {
    setShowScanner(false);

    const scanned = cleanScannedText(text);
    const scannedLower = scanned.toLowerCase();

    console.log("SCANNED:", scanned);

    const found = items.find((item) => {
      const id = String(item.id || "").trim().toLowerCase();
      const inventoryNumber = String(item.inventory_number || "")
        .trim()
        .toLowerCase();
      const serialNumber = String(item.serial_number || "")
        .trim()
        .toLowerCase();

      return (
        id === scannedLower ||
        inventoryNumber === scannedLower ||
        serialNumber === scannedLower ||
        (inventoryNumber && inventoryNumber.includes(scannedLower)) ||
        (inventoryNumber && scannedLower.includes(inventoryNumber)) ||
        (serialNumber && serialNumber.includes(scannedLower)) ||
        (serialNumber && scannedLower.includes(serialNumber))
      );
    });

    if (found) {
      router.push(`/items/${found.id}`);
      return;
    }

    setSearch(scanned);
    alert(`Item not found. Scanned: ${scanned}`);
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
            aria-label="Scan QR code"
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
