import BottomNav from "@/components/BottomNav";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Siloam Inventory",
  description: "Inventory, profit, and tax tracker for reseller businesses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}
            <BottomNav />
</body>
    </html>
  );
}
