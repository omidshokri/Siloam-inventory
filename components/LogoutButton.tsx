"use client";

import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function LogoutButton() {
  const supabase = createBrowserSupabase();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button type="button" onClick={logout} className="secondary-btn">
      Logout
    </button>
  );
}
