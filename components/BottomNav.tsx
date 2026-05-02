"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/dashboard/builder",
      label: "Builder",
      icon: LayoutDashboard,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
