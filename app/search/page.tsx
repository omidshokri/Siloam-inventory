export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { money, netProfit } from "@/lib/calculations";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = data || [];

  const results = items.filter((item) => {
    const text = [
      item.name,
      item.category,
      item.vendor,
      item.serial_number,
      item.inventory_number,
      item.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(query.toLowerCase());
  });

  const closest = items.slice(0, 8);

  return (
    <main className="app-shell">
      <div className="apple-container">
        <section className="section-card">
          <p className="eyebrow">Search</p>
          <h1>Search Results</h1>
          <p className="muted">
            Results for: <strong>{query || "Empty search"}</strong>
          </p>

          <div className="item-list" style={{ marginTop: 24 }}>
            {results.length > 0 ? (
              results.map((item) => (
                <Link key={item.id} href={`/items/${item.id}`} className="item-row">
                  <div>
                    <p className="serial">
                      {item.inventory_number || item.serial_number || "No inventory number"}
                    </p>
                    <h3>{item.name || "Item"}</h3>
                    <p className="muted">
                      {item.category || "No category"} · {item.status || "in_stock"}
                    </p>
                  </div>

                  <strong>{money(netProfit(item))}</strong>
                </Link>
              ))
            ) : (
              <>
                <p className="empty-state">
                  I couldn’t find an exact match. Here are some recent items:
                </p>

                {closest.map((item) => (
                  <Link key={item.id} href={`/items/${item.id}`} className="item-row">
                    <div>
                      <p className="serial">
                        {item.inventory_number || item.serial_number || "No inventory number"}
                      </p>
                      <h3>{item.name || "Item"}</h3>
                      <p className="muted">
                        {item.category || "No category"} · {item.status || "in_stock"}
                      </p>
                    </div>

                    <strong>{money(netProfit(item))}</strong>
                  </Link>
                ))}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
