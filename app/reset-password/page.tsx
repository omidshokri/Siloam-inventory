"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated successfully.");
    router.push("/");
    router.refresh();
  }

  return (
    <main className="app-shell">
      <div className="apple-container">
        <section className="hero-card" style={{ maxWidth: 520, margin: "80px auto" }}>
          <p className="eyebrow">Password recovery</p>
          <h1>Set New Password</h1>

          <form onSubmit={updatePassword} className="form-grid">
            <label className="field">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Password"}
            </button>
          </form>

          {message && <p className="muted" style={{ marginTop: 20 }}>{message}</p>}
        </section>
      </div>
    </main>
  );
}
