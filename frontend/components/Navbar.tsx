"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.1rem 2.5rem;
          transition: background 0.35s ease, border-color 0.35s ease;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(13, 17, 23, 0.92);
          backdrop-filter: blur(14px);
          border-bottom-color: rgba(255,255,255,0.06);
        }
        .nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.25rem;
          color: #e2e8f0;
          letter-spacing: -0.02em;
          text-decoration: none;
        }
        /* Green accent on the second word */
        .nav-logo span { color: #4ade80; }

        .nav-links { display: flex; gap: 2.2rem; align-items: center; }
        .nav-links a {
          color: #4b5563; font-size: 0.85rem; text-decoration: none;
          transition: color 0.2s; letter-spacing: 0.01em;
        }
        .nav-links a:hover { color: #9ca3af; }

        .nav-cta {
          background: transparent;
          border: 1px solid rgba(74, 222, 128, 0.35);
          color: #4ade80;
          padding: 0.45rem 1rem; border-radius: 5px;
          font-size: 0.82rem; font-weight: 500;
          text-decoration: none; transition: background 0.2s, color 0.2s;
        }
        .nav-cta:hover { background: #4ade80; color: #000000; }

        @media(max-width: 600px) { .nav-links { display: none; } }
      `}</style>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="nav-logo">Mind<span>Space</span></a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#ai">AI</a>
          <a href="#start" className="nav-cta">Get started</a>
        </div>
      </nav>
    </>
  );
}