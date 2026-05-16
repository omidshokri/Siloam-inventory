"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Boxes,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const items = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/products",
    label: "Products",
    icon: Boxes,
  },
  {
    href: "/builder",
    label: "Builder",
    icon: LayoutDashboard,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function SiloamDock() {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 20,
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 720,
        zIndex: 100,
      }}
    >
      <div
        className="siloam-glass"
        style={{
          borderRadius: 999,
          padding: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {items.map((item) => {
          const active = pathname === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  minWidth: 74,
                  borderRadius: 999,
                  padding: "10px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all .2s ease",
                  background: active
                    ? "rgba(255,255,255,.08)"
                    : "transparent",
                  color: active
                    ? "var(--text)"
                    : "var(--muted)",
                }}
              >
                <Icon size={20} strokeWidth={1.8} />

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
