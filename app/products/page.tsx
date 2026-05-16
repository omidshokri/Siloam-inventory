"use client";

import { createBrowserSupabase } from "@/lib/supabase-browser";
import {
  Plus,
  Search,
  ScanLine,
  Boxes,
  Tag,
  CheckCircle2,
  Laptop,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type InventoryItem = {
  id: string;
  title?: string;
  name?: string;
  inventory_number?: string;
  purchase_price?: number;
  sale_price?: number;
  sold?: boolean;
};

export default function ProductsPage() {
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadInventory() {
    setLoading(true);

    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Inventory load error:", error.message);
      alert(error.message);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  loadInventory();
}, [supabase]);
  const totalValue = items.reduce((sum, item) => {
    return sum + (item.purchase_price || 0);
  }, 0);

  const soldCount = items.filter((item) => item.sold).length;

  return (
    <main className="siloam-page">
      <div className="siloam-shell">
        <section style={{ padding: "48px 0 24px" }}>
          <p className="siloam-eyebrow">Products</p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(42px, 7vw, 72px)",
                  lineHeight: "0.95",
                  letterSpacing: "-0.06em",
                  margin: "14px 0",
                }}
              >
                Product inventory
              </h1>

              <p
                className="siloam-muted"
                style={{
                  fontSize: 18,
                  lineHeight: 1.7,
                  maxWidth: 650,
                  margin: 0,
                }}
              >
                Manage active items, sold products, receipts, QR labels, and
                marketplace-ready product details.
              </p>
            </div>

            <button className="siloam-button siloam-button-primary">
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </section>

        <section
          className="siloam-card"
          style={{
            padding: 18,
            marginBottom: 18,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted)",
              }}
            />

            <input
              className="siloam-input"
              placeholder="Search inventory..."
              style={{ paddingLeft: 42 }}
            />
          </div>

          <button className="siloam-button siloam-button-secondary">
            <ScanLine size={18} />
            Scan
          </button>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div className="siloam-card" style={{ padding: 22 }}>
            <Boxes size={22} />

            <p className="siloam-eyebrow" style={{ marginTop: 16 }}>
              Active
            </p>

            <h2 style={{ fontSize: 34, margin: "8px 0 0" }}>
              {items.length}
            </h2>

            <p className="siloam-muted">
              Active tracked inventory items
            </p>
          </div>

          <div className="siloam-card" style={{ padding: 22 }}>
            <Tag size={22} />

            <p className="siloam-eyebrow" style={{ marginTop: 16 }}>
              Value
            </p>

            <h2 style={{ fontSize: 34, margin: "8px 0 0" }}>
              ${totalValue.toFixed(0)}
            </h2>

            <p className="siloam-muted">
              Estimated inventory value
            </p>
          </div>

          <div className="siloam-card" style={{ padding: 22 }}>
            <CheckCircle2 size={22} />

            <p className="siloam-eyebrow" style={{ marginTop: 16 }}>
              Sold
            </p>

            <h2 style={{ fontSize: 34, margin: "8px 0 0" }}>
              {soldCount}
            </h2>

            <p className="siloam-muted">
              Completed sales
            </p>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            paddingBottom: 120,
          }}
        >
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="siloam-card"
                style={{
                  padding: 22,
                  minHeight: 180,
                }}
              />
            ))}

          {!loading &&
            items.map((item) => (
              <div
                key={item.id}
                className="siloam-card siloam-card-hover"
                style={{
                  padding: 22,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    display: "grid",
                    placeItems: "center",
                    marginBottom: 18,
                    border: "1px solid var(--line)",
                    background:
                      "linear-gradient(180deg, rgba(124,58,237,.2), rgba(255,255,255,.04))",
                  }}
                >
                  <Laptop size={22} />
                </div>

                <p className="siloam-eyebrow">
                  {item.inventory_number || "Inventory Item"}
                </p>

                <h3
                  style={{
                    fontSize: 24,
                    letterSpacing: "-0.04em",
                    margin: "8px 0",
                  }}
                >
                  {item.title || item.name || "Unnamed Product"}
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 18,
                  }}
                >
                  <div
                    className="siloam-glass"
                    style={{
                      borderRadius: 999,
                      padding: "8px 12px",
                      fontSize: 13,
                    }}
                  >
                    Purchase: $
                    {(item.purchase_price || 0).toFixed(0)}
                  </div>

                  {item.sale_price && (
                    <div
                      className="siloam-glass"
                      style={{
                        borderRadius: 999,
                        padding: "8px 12px",
                        fontSize: 13,
                      }}
                    >
                      Sale: ${item.sale_price.toFixed(0)}
                    </div>
                  )}

                  <div
                    style={{
                      borderRadius: 999,
                      padding: "8px 12px",
                      fontSize: 13,
                      border: "1px solid var(--line)",
                      background: item.sold
                        ? "rgba(34,197,94,.14)"
                        : "rgba(255,255,255,.04)",
                    }}
                  >
                    {item.sold ? "Sold" : "In Stock"}
                  </div>
                </div>
              </div>
            ))}
        </section>
      </div>
    </main>
  );
}
