"use client";

import { useState } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Package,
  LayoutDashboard,
  Settings,
  Search,
  Camera,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";

const QrScanner = dynamic(() => import("./QrScanner"), { ssr: false });

export default function BottomNav() {
const [scannerOpen, setScannerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function submitSearch() {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      closeSearch();
      return;
    }

    router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
    closeSearch();
  }

  function openScanner() {
    router.push("/search?scanner=true");
    closeSearch();
  }

  if (searchOpen) {
    return (
      <div className="bottom-nav-wrap bottom-search-wrap">
        <div className="bottom-search">
          <input
            autoFocus
            value={query}
            placeholder="Search inventory..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
              if (e.key === "Escape") closeSearch();
            }}
          />

          <button type="button" onClick={openScanner} aria-label="Scan QR">
            <Camera size={22} />
          </button>

          <button type="button" onClick={closeSearch} aria-label="Close search">
            <X size={24} />
          </button>
        </div>

      </div>
    );
  }

return (
  <>
    <div className="bottom-nav-wrap">
      <nav className="bottom-nav">
        {/* Home */}
        <Link href="/" className={`bottom-nav-item ${pathname === "/" ? "active" : ""}`}>
          <Home size={24} />
          <span>Home</span>
        </Link>

        {/* Products */}
        <Link href="/products" className={`bottom-nav-item ${pathname.startsWith("/products") ? "active" : ""}`}>
          <Package size={24} />
          <span>Products</span>
        </Link>

        {/* Builder */}
        <Link
          href="/dashboard/builder"
          className={`bottom-nav-item ${pathname.startsWith("/dashboard/builder") ? "active" : ""}`}
        >
          <LayoutDashboard size={24} />
          <span>Builder</span>
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className={`bottom-nav-item ${pathname.startsWith("/settings") ? "active" : ""}`}
        >
          <Settings size={24} />
          <span>Settings</span>
        </Link>

        {/* Search */}
        <button
          className="bottom-nav-search"
          onClick={() => setSearchOpen(true)}
        >
          <Search size={28} />
        </button>
      </nav>
    </div>

    {/* 👇 اینجا باید باشه */}
    {scannerOpen && (
      <QrScanner onClose={() => setScannerOpen(false)} />
    )}
  </>
);
