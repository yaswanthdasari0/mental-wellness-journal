"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, saveToken, saveUser } from "@/services/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ email, password });

      // Store token and user in localStorage
      saveToken(result.token);
      document.cookie = `mindspace_token=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      saveUser(result.user);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-form { width: 100%; max-width: 380px; }
        .field-group { margin-bottom: 1.3rem; }
        .field-label {
          display: block; font-size: 0.78rem; color: #6b7280;
          letter-spacing: 0.04em; margin-bottom: 0.5rem;
        }
        .field-input {
          width: 100%; background: #0d1117; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px; padding: 0.75rem 0.95rem; font-size: 0.9rem;
          color: #e2e8f0; font-family: 'Inter', sans-serif; transition: border-color 0.2s;
        }
        .field-input::placeholder { color: #374151; }
        .field-input:focus { outline: none; border-color: rgba(74,222,128,0.45); }
        .form-error {
          font-size: 0.82rem; color: #f87171; margin-bottom: 1rem;
          padding: 0.6rem 0.9rem;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2); border-radius: 6px;
        }
        .form-submit {
          width: 100%; background: #4ade80; color: #0d1117; border: none;
          padding: 0.85rem 1.8rem; border-radius: 6px; font-size: 0.9rem;
          font-weight: 600; letter-spacing: 0.01em; cursor: pointer;
          transition: background 0.2s; margin-top: 0.4rem;
          font-family: 'Inter', sans-serif;
        }
        .form-submit:hover { background: #86efac; }
        .form-submit:disabled { background: #374151; color: #6b7280; cursor: not-allowed; }
        .form-footer { margin-top: 1.6rem; font-size: 0.85rem; color: #4b5563; text-align: center; }
        .form-footer a { color: #4ade80; text-decoration: none; font-weight: 500; }
        .form-footer a:hover { color: #86efac; }
      `}</style>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="field-group">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="field-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="field-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="form-footer">
          Don't have an account? <Link href="/signup">Sign up</Link>
        </div>
      </form>
    </>
  );
}