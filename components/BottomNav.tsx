"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Package, BarChart3, Settings, Search, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [query, setQuery] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!query.trim()) return;

    router.push(`/?search=${encodeURIComponent(query.trim())}`);
    setOpenSearch(false);
  }

  return (
    <div className="bottom-nav-wrap">
      {openSearch ? (
        <form className="bottom-search" onSubmit={submitSearch}>
          <input
            autoFocus
            placeholder="Search inventory..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="button" onClick={() => router.push("/?scan=true")}>
            <Camera size={22} />
          </button>

          <button type="submit">
            <Search size={22} />
          </button>
        </form>
      ) : (
        <div className="bottom-nav">
          <Link href="/" className="bottom-nav-item">
            <Home size={26} />
            <span>Home</span>
          </Link>

          <Link href="/#inventory" className="bottom-nav-item">
            <Package size={26} />
            <span>Products</span>
          </Link>

          <Link href="/dashboard" className="bottom-nav-item">
            <BarChart3 size={26} />
            <span>Dashboard</span>
          </Link>

          <Link href="/settings" className="bottom-nav-item">
            <Settings size={26} />
            <span>Settings</span>
          </Link>

          <button
            type="button"
            className="bottom-nav-search"
            onClick={() => setOpenSearch(true)}
          >
            <Search size={34} />
          </button>
        </div>
      )}
    </div>
  );
}
