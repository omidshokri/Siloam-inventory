"use client";
import { BarChart3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Home,
  Package,
  LayoutDashboard,
  Settings,
  Search,
  Camera,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import QRScanner from "./QRScanner";

export default function BottomNav() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const [openSearch, setOpenSearch] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpenSearch(false);
      }
    }

    if (openSearch) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openSearch]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();

    const q = query.trim();
    if (!q) return;

    setOpenSearch(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleScan(text: string) {
    setOpenScanner(false);
    setOpenSearch(false);

    const scanned = text.trim();

    if (scanned.startsWith("http")) {
      window.location.href = scanned;
      return;
    }

    router.push(`/search?q=${encodeURIComponent(scanned)}`);
  }

  return (
    <>
      <div className="bottom-nav-wrap">
        {openSearch ? (
          <div ref={searchRef} className="bottom-search-panel">
            <form className="bottom-search" onSubmit={submitSearch}>
              <input
                autoFocus
                placeholder="Search inventory..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ flex: 1, minWidth: 0 }}
              />

              <button
                type="button"
                onClick={() => setOpenScanner(true)}
                aria-label="Scan QR"
                style={{ flexShrink: 0 }}
              >
                <Camera size={20} />
              </button>

              <button
                type="submit"
                aria-label="Search"
                style={{ flexShrink: 0 }}
              >
                <Search size={20} />
              </button>

              <button
                type="button"
                onClick={() => setOpenSearch(false)}
                aria-label="Close search"
                style={{ flexShrink: 0 }}
              >
                <X size={20} />
              </button>
            </form>
          </div>
        ) : (
          <div className="bottom-nav">
            <Link href="/" className="bottom-nav-item">
              <Home size={24} />
              <span>Home</span>
            </Link>

            <Link href="/products" className="bottom-nav-item">
              <Package size={24} />
              <span>Products</span>
            </Link>

              <span>Dashboard</span><LayoutDashboard size={24} />
  <span>Buiilder</span>
            <Link href="/settings" className="bottom-nav-item">
              <Settings size={24} />
              <span>Settings</span>
            </Link>

            <button
              type="button"
              className="bottom-nav-search"
              onClick={() => setOpenSearch(true)}
              aria-label="Open search"
            >
              <Search size={30} />
            </button>
          </div>
        )}
      </div>

      {openScanner && (
        <div className="scanner-overlay">
          <div className="scanner-modal">
            <div className="scanner-modal-header">
              <div>
                <p className="eyebrow">QR Scanner</p>
                <h2>Scan Product Code</h2>
              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => setOpenScanner(false)}
              >
                Close
              </button>
            </div>

            <QRScanner onScan={handleScan} />
          </div>
        </div>
      )}
    </>
  );
}
