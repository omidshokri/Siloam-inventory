"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const supabase = createBrowserSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/";
  }

  async function resetPassword() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password reset email sent.");
  }

  return (
    <main className="app-shell">
      <div className="apple-container">
        <section
          className="hero-card"
          style={{
            maxWidth: "520px",
            margin: "80px auto",
            padding: "42px",
          }}
        >
          <p className="eyebrow">Private access</p>
          <h1>Siloam Inventory</h1>
          <p className="muted">Login to continue.</p>

          <form onSubmit={login} style={{ marginTop: 28 }}>
            <label className="field" style={{ marginBottom: 14 }}>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="field" style={{ marginBottom: 20 }}>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <div style={{ marginTop: 32 }}>
            <p className="muted">Forgot password?</p>

            <label className="field" style={{ marginBottom: 14 }}>
              <span>Email for recovery</span>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </label>

            <button
              className="secondary-btn"
              type="button"
              onClick={resetPassword}
              disabled={loading || !resetEmail}
            >
              Send reset email
            </button>
          </div>

          {message && (
            <p className="muted" style={{ marginTop: 20 }}>
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
