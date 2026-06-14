"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to backend auth endpoint
    console.log({ email, password });
  };

  return (
    <>
      <style>{`
        .auth-form { width: 100%; max-width: 380px; }

        .field-group { margin-bottom: 1.3rem; }
        .field-label {
          display: block;
          font-size: 0.78rem; color: #6b7280;
          letter-spacing: 0.04em; margin-bottom: 0.5rem;
        }
        .field-input {
          width: 100%;
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 0.75rem 0.95rem;
          font-size: 0.9rem;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s;
        }
        .field-input::placeholder { color: #374151; }
        .field-input:focus {
          outline: none;
          border-color: rgba(74, 222, 128, 0.45);
        }

        .form-submit {
          width: 100%;
          background: #4ade80;
          color: #0d1117;
          border: none;
          padding: 0.85rem 1.8rem;
          border-radius: 6px;
          font-size: 0.9rem; font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 0.4rem;
        }
        .form-submit:hover { background: #86efac; }

        .form-footer {
          margin-top: 1.6rem;
          font-size: 0.85rem; color: #4b5563;
          text-align: center;
        }
        .form-footer a {
          color: #4ade80; text-decoration: none;
          font-weight: 500;
        }
        .form-footer a:hover { color: #86efac; }
      `}</style>

      <form className="auth-form" onSubmit={handleSubmit}>
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

        <button type="submit" className="form-submit">Log in</button>

        <div className="form-footer">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </form>
    </>
  );
}