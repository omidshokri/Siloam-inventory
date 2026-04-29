"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  }

  async function handleReset() {
    if (!email) {
      alert("Enter your email first");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      alert(error.message);
    } else {
      alert("Reset email sent");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border">

        <h1 className="text-xl font-semibold mb-6 text-center">
          Siloam Inventory
        </h1>

        <input
          className="w-full h-11 px-3 mb-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full h-11 px-3 mb-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-11 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          onClick={handleReset}
          className="w-full mt-3 text-xs text-gray-500 hover:underline"
        >
          Forgot password?
        </button>

      </div>
    </div>
  );
}
