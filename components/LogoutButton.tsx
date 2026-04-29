"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 16px",
        borderRadius: "12px",
        border: "none",
        background: "#ef4444",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
