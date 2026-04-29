"use client";

import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function LabelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [supabase] = useState(() => createBrowserSupabase());
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    async function loadItem() {
      const { data } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("id", id)
        .single();

      setItem(data);
    }

    loadItem();
  }, [id, supabase]);

  function encodePrice(value: number) {
    const map: Record<string, string> = {
      "0": "Z",
      "1": "Q",
      "2": "R",
      "3": "M",
      "4": "X",
      "5": "L",
      "6": "P",
      "7": "T",
      "8": "V",
      "9": "K",
      ".": "?",
    };

    return value.toFixed(2).split("").map((ch) => map[ch] || ch).join("");
  }

  if (!item) return null;

  const purchaseDate = item.purchase_date || "";
const inventoryNumber = item.inventory_number || item.serial_number || item.id;
  const serialTail = item.serial_number
    ? item.serial_number.slice(-4).toUpperCase()
    : "NOSN";

  const codedPrice = encodePrice(Number(item.purchase_price || 0));

  return (
    <main className="label-page">
      <div className="label-actions no-print">
        <Link href={`/items/${id}`} className="back-link">
          ← Back to Item
        </Link>

        <button onClick={() => window.print()} className="primary-btn">
          Print Label
        </button>
      </div>

<section className="inventory-label">
  <div className="label-left">
    <div className="label-top">
      <span>{purchaseDate}</span>
      <span>{inventoryNumber}</span>
    </div>

    <div className="label-name">
      {item.name}
    </div>

    <div className="label-small">
      SN: {serialTail}
    </div>

    <div className="label-price">
      C: {codedPrice}
    </div>
  </div>

  <div className="label-qr">
    <QRCodeCanvas
value={`https://siloam-inventory.vercel.app/lookup/${encodeURIComponent(inventoryNumber)}`}
      size={52}
      level="M"
    />
  </div>
</section>
    </main>
  );
}
